const { StatusCodes } = require('http-status-codes');
const AppError = require("../utils/errors/app-error");
const { Logger } = require('../config')

class CrudRepository {

    constructor(model) {
        this.model = model;
    }

    async create(data) {
        const response = await this.model.create(data);
        return response;
    }

    async delete(id) {
        const response = await this.model.destroy({
            where: {
                id: id,
            }
        });

        if(!response){
            throw new AppError('Not able to find the resource', StatusCodes.NOT_FOUND);
        }
        return response;

    }

    async update(id, data) {  //data must be a object
        const response = await this.model.update(data, {
            where: {
                id: id,
            }
        });
        if(response.length == 0 || response[0] == 0){
            throw new AppError('Not able to find the resource', StatusCodes.NOT_FOUND);
        }
        return response;
    }

    async findAll() {
        const response = await this.model.findAll();
        return response;
    }

    async findOne(id) {
        const response = await this.model.findByPk(id);
        if (!response) {
            throw new AppError('Not able to find the resource', StatusCodes.NOT_FOUND);
        }
        return response;
    }

}

module.exports = CrudRepository;