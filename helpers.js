const { 
    STRING_UNITS_TO_MILLISECONDS,
    EPOCH_YEAR,
    LEAP_MONTH,
    DAYS_IN_A_NON_LEAP_YEAR,
    DAYS_IN_LEAP_YEAR,
    MONTH_TO_DAY_INDEX
 } = require('./constants');


const reduceTimestampAccuracyToMinutes = (timestamp) => {
    // matches the digits reponsible for seconds and milliseconds
    const matchSecondsInJSONDate = /([0-9]{2}.[0-9]+Z)$/
    const jsonDate = new Date(timestamp).toJSON();

    const minuteAccurtateDate = jsonDate.replace(matchSecondsInJSONDate, '00.000');
    return Date.parse(minuteAccurtateDate);
};

const isALeapYear = (yearNumber) => {
    return ((yearNumber % 4 == 0) && (yearNumber % 100 != 0)) || (yearNumber % 400 == 0);
};

const getDaysSinceEPOCH = (day, month, year = 1970) => {
    const numOfYearsSinceEPOCH = year - EPOCH_YEAR;
    const yearsInDays = (numOfYearsSinceEPOCH => {
        let dayCounter = 0;
        for (let i = 1; i <= numOfYearsSinceEPOCH; i++) {
            dayCounter += (isALeapYear(EPOCH_YEAR + i) ? DAYS_IN_LEAP_YEAR : DAYS_IN_A_NON_LEAP_YEAR);
        }

        return dayCounter;
    })(numOfYearsSinceEPOCH);

    const monthsInDays = (indexOfMonth => {
        let dayCounter = 0;
        for (let i = 1; i < indexOfMonth; i++) {
            if (i === LEAP_MONTH) {
                dayCounter += isALeapYear(year) ? LEAP_MONTH_DAYS : MONTH_TO_DAY_INDEX[i];
            } else {
                dayCounter += MONTH_TO_DAY_INDEX[i];
            }
        }

        return dayCounter;
    })(month);
    // need to take one off since EPOC start from 1970/01/01
    return yearsInDays + monthsInDays + (day - 1);
}

const daysToMillisenconds = (days) => {
    return days * STRING_UNITS_TO_MILLISECONDS.day;
}

module.exports = {
    reduceTimestampAccuracyToMinutes,
    isALeapYear,
    getDaysSinceEPOCH,
    daysToMillisenconds
}