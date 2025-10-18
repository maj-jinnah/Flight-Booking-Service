const axios = require('axios');
const { Booking } = require('../models');
const { sequelize } = require('../models');
const { ServerConfig, QueueConfig } = require('../config');
const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/app-error');
const { BookingRepository } = require('../repositories');

const bookingRepository = new BookingRepository();

const createBooking = async ({ flightId, userId, noOfSeats }) => {
    const t = await sequelize.transaction();
    try {
        const flight = await axios.get(`${ServerConfig.BASE_URL}/api/v1/flights/${flightId}`, { transaction: t });
        if (flight.status !== StatusCodes.OK) {
            throw new AppError('The flight you requested could not be found', StatusCodes.NOT_FOUND);
        }

        if (flight.data.data.totalSeats < noOfSeats) {
            throw new AppError('Not enough seats available', StatusCodes.BAD_REQUEST);
        }

        const totalBillingAmount = flight.data.data.price * noOfSeats;
        const bookingPayload = {
            flightId,
            userId,
            noOfSeats,
            totalCost: totalBillingAmount
        };

        const booking = await bookingRepository.createBooking(bookingPayload, t);
        if (!booking) {
            throw new AppError('Failed to create booking', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        await axios.patch(`${ServerConfig.BASE_URL}/api/v1/flights/${flightId}/seats`, {
            seats: noOfSeats
        }, { transaction: t });

        await t.commit();
        return true;
    } catch (error) {
        await t.rollback();
        throw error;
    }
}

const makePayment = async ({ bookingId, totalCost, transaction }) => {
    const t = await sequelize.transaction();
    try {
        const bookingDetails = await bookingRepository.findOne(bookingId, t);

        if (bookingDetails.status === 'cancelled') {
            throw new AppError('The booking is already cancelled', StatusCodes.BAD_REQUEST);
        }

        const bookingTime = new Date(bookingDetails.createdAt);
        const currentTime = new Date();
        const timeDiff = (currentTime - bookingTime) / (1000 * 60); // difference in minutes
        if (timeDiff > 30) {
            await cancelBooking(bookingId);
            throw new AppError('The booking has expired', StatusCodes.BAD_REQUEST);
        }

        if (bookingDetails.totalCost !== totalCost) {
            throw new AppError('Payment amount does not match booking total', StatusCodes.BAD_REQUEST);
        }

        if (bookingDetails.userId !== userId) {
            throw new AppError('User not authorized to make payment for this booking', StatusCodes.UNAUTHORIZED);
        }

        await bookingRepository.update(bookingId, { status: 'booked' }, t);

        await t.commit();

        await QueueConfig.sendMessage({
            // need to fetch user email from user service using user id
            to: "maj.jinnah2006@gmail",
            
            subject: 'Flight Booking',
            text: `You have successfully booked a flight`,
        });
    } catch (error) {
        await t.rollback();
        throw error;
    }
}

const cancelBooking = async (bookingId) => {
    const t = await sequelize.transaction();
    try {
        const bookingDetails = await bookingRepository.findOne(bookingId, t);
        if (!bookingDetails) {
            throw new AppError('Booking not found', StatusCodes.NOT_FOUND);
        }

        if (bookingDetails.status === 'cancelled') {
            await t.commit();
            return true;
        }

        await axios.patch(`${ServerConfig.BASE_URL}/api/v1/flights/${bookingDetails.flightId}/seats`, {
            seats: bookingDetails.noOfSeats,
            dec: false
        }, { transaction: t });

        await bookingRepository.update(bookingId, { status: 'cancelled' }, t);
        await t.commit();
    } catch (error) {
        await t.rollback();
        throw error;
    }
}

async function cancelOldBookings() {
    try {
        const time = new Date(Date.now() - 1000 * 1800); // time 30 mins ago
        const response = await bookingRepository.cancelOldBookings(time);

        return response;
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    createBooking,
    makePayment,
    cancelBooking,
    cancelOldBookings

}