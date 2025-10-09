const { Booking } = require('../models');
const CrudRepository = require('./crud-repository');

class BookingRepository extends CrudRepository {
    constructor() {
        super(Booking)
    }

    async createBooking (data, transaction){
        return await Booking.create(data, { transaction: transaction });
    }

    async findOne(id, transaction) {
        const response = await this.model.findByPk(id, { transaction: transaction });
        if (!response) {
            throw new AppError('Not able to find the resource', StatusCodes.NOT_FOUND);
        }
        return response;
    }

    async update(id, data, transaction) {  //data must be a object
        const response = await this.model.update(data, {
            where: {
                id: id,
            },
            transaction: transaction
        });
        if(response.length == 0 || response[0] == 0){
            throw new AppError('Not able to find the resource', StatusCodes.NOT_FOUND);
        }
        return response;
    }
}

module.exports = BookingRepository;