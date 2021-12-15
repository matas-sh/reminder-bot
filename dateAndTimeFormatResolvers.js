const { isALeapYear, getDaysSinceEPOCH, daysToMillisenconds } = require('./helpers');
const { 
    STRING_UNITS_TO_MILLISECONDS,
    MONTH_TO_DAY_INDEX,
    LEAP_MONTH,
    LEAP_MONTH_DAYS
 } = require('./constants');

const regexToGetMilitaryTime = /([0-9]{2}:[0-9]{2})/; //12:00 8:00 23:00
const regextToGetMeridiemIndicatorsTime = /([0-9]+(pm|am))/i; // 8PM 8AM 4pm 8am 6:20pm 12
const regexToGetDateWithMonthAndOrYear = /([0-9]+\/[0-9]+\/?([0-9]{4}|[0-9]{2})?)/ // 1/11 1/11/2021
const regexToGetRelativeTime = /(([1-9]|[0-9])+ +)(\bmin\b|\bmins\b|\bminute\b|\bminutes\b|\bhours\b|\bhours\b|\bdays\b|\bdays\b)/gm

const supportedTimeFormatResolvers = [
    {
        matcher: regexToGetMilitaryTime,
        resolver: (matchedString) => {
            const [hours, minutes] = matchedString.split(':');

            return (hours * STRING_UNITS_TO_MILLISECONDS.hour) + (minutes * STRING_UNITS_TO_MILLISECONDS.minute);
        },
        validator: (matchedString) => {
            // exp 14:21
            const [hours, minutes] = matchedString.split(':');
            const validHours = Number(hours) >= 0 && Number(hours) <=24;
            const validMinutes = Number(minutes) >= 0 && Number(minutes) < 60;

            if (validHours && validMinutes) {
                return true;
            }
            return false;
        },
    },
    {
        matcher: regexToGetRelativeTime,
        resolver: (matchedString) => {
            const [hours, minutes] = matchedString.split(':');

            return (hours * STRING_UNITS_TO_MILLISECONDS.hour) + (minutes * STRING_UNITS_TO_MILLISECONDS.minute);
        },
        validator: (matchedString) => {
            // exp 14:21
            const [hours, minutes] = matchedString.split(':');
            const validHours = Number(hours) >= 0 && Number(hours) <=24;
            const validMinutes = Number(minutes) >= 0 && Number(minutes) < 60;

            if (validHours && validMinutes) {
                return true;
            }
            return false;
        },
    }
];

const supportedDateFormatsResolvers = [
    {
        matcher: regexToGetDateWithMonthAndOrYear,
        resolver: (matchedString) => {
            // exp 1/11 or 1/11/2021
            let [day, month, year] = matchedString.split('/');
            if (!year) {
                year = (new Date()).getFullYear();
            }

            const daysSinceEpoch = getDaysSinceEPOCH(Number(day), Number(month), Number(year));
            const millisecondValue = daysToMillisenconds(daysSinceEpoch);

            return millisecondValue;
        },
        validator: (matchedString) => {
            // exp 14:21
            const [day, month, year] = matchedString.split('/');
            const isItALeapYear = isALeapYear(month);
            const dayInt = Number(day);
            const monthInt = Number(month);


            if (!day || !Number.isInteger(dayInt) || dayInt < 1) {
                return false;
            }
            if (!monthInt || !Number.isInteger(monthInt) || monthInt < 1) {
                return false;
            }
            if (!yearInt || !Number.isInteger(yearInt) || yearInt < 1) {
                return false;
            }


            let validDay = false;
            if (month == LEAP_MONTH) {
                validDay = day > 0 && day <= (isItALeapYear? LEAP_MONTH_DAYS : MONTH_TO_DAY_INDEX[month]);
            } else {
                validDay = day > 0 && day <= MONTH_TO_DAY_INDEX[month];
            }

            const validMonth = month > 0 && month <= 12;
            
            if (year) {
                const yearInt = Number(year);

                if (!yearInt || !Number.isInteger(yearInt) || yearInt < 1) {
                    return false;
                }
                const validYear = year > 2021 && year <= 2031;
                
                return validDay && validMonth && validYear;
            }

            return validDay && validMonth;
        },
    }
];

module.exports = {
    supportedTimeFormatResolvers,
    supportedDateFormatsResolvers
};
