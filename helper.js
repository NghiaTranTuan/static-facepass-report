const formatTimeStamp = (timeText) => {
  if (timeText.length === 14) {
    const year = timeText.slice(0, 4);
    const month = timeText.slice(4, 6);
    const date = timeText.slice(6, 8);
    const hour = timeText.slice(8,10);
    const minute = timeText.slice(10,12);
    const second = timeText.slice(12,14);
    const fullDate = `${year}-${month}-${date} ${hour}:${minute}:${second}`;
    return fullDate
  }
};

module.exports = {
  formatTimeStamp,
};
