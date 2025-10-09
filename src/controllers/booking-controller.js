const { StatusCodes } = require('http-status-codes');
const { BookingService } = require('../services');
const { SuccessResponse, ErrorResponse } = require('../utils/common');
const AppError = require('../utils/errors/app-error');

const createBooking = async (req, res) => {
    try {
        const { flightId, userId, noOfSeats } = req.body;
        if (!flightId) {
            throw new AppError('FlightId is required', StatusCodes.BAD_REQUEST);
        }
        const result = await BookingService.createBooking({ flightId, userId, noOfSeats });
        SuccessResponse.data = result;
        return res
            .status(StatusCodes.OK)
            .json(SuccessResponse);
    } catch (error) {
        if (error.status === 404) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({
                    success: false,
                    message: "The flight you requested could not be found",
                    data: {},
                });
        }
        ErrorResponse.error = error;
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(ErrorResponse);
    }
}

const makePayment = async (req, res) => {
    try {
        const { bookingId, totalCost, userId } = req.body;
        const result = await BookingService.makePayment({ bookingId, totalCost, userId });
        SuccessResponse.data = result;
        return res
            .status(StatusCodes.OK)
            .json(SuccessResponse);
    } catch (error) {
        if (error.status === 404) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({
                    success: false,
                    message: "The flight you requested could not be found",
                    data: {},
                });
        }
        ErrorResponse.error = error;
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(ErrorResponse);
    }
}

module.exports = {
    createBooking,
    makePayment
}