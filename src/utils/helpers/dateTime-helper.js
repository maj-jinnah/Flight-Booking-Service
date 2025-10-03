
function compareTimeSlots(departureTime, arrivalTime) {
  const depTime = new Date(departureTime);
  const arrTime = new Date(arrivalTime);
  return depTime < arrTime;
}

module.exports = {
  compareTimeSlots
};