const cron = require('node-cron');
const { BookingService } = require('../../services');

function startCronJob() {
    cron.schedule('*/15 * * * *', () => { // Runs every 15 minutes
    console.log('Running booking cancellation job...');
    BookingService.cancelOldBookings();
});
}

module.exports = startCronJob;