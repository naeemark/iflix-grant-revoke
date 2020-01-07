const calculateDays = async (startDate, endDate) => {
  return Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
};

module.exports = {
  calculateDays
}