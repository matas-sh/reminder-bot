const reduceTimestampAccuracyToMinutes = (timestamp) => {
    // matches the digits reponsible for seconds and milliseconds
    const matchSecondsInJSONDate = /([0-9]{2}.[0-9]+Z)$/
    const jsonDate = new Date(timestamp).toJSON();

    const minuteAccurtateDate = jsonDate.replace(matchSecondsInJSONDate, '00.000');
    return Date.parse(minuteAccurtateDate);
}

module.exports = {
    reduceTimestampAccuracyToMinutes
}