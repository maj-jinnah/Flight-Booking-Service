const dotenv = require("dotenv")

dotenv.config();

module.exports = {
    PORT: process.env.PORT,
    BASE_URL: process.env.BASE_URL,
}