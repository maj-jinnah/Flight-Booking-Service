const express = require("express");
const router = express.Router();

const {InfoController} = require("../../controllers");
const bookingRoutes = require("./booking-routes");


// localhost:4000/api/v1

router.get('/health', InfoController.health);
router.use('/bookings', bookingRoutes);



module.exports = router;