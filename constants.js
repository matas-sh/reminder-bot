const EPOCH_YEAR = 1970;
const STRING_UNITS_TO_MILLISECONDS = {
    minute: 60000,
    hour: 3600000,
    day: 8.64e+7,
}
const DAYS_IN_A_NON_LEAP_YEAR = 365;
const DAYS_IN_LEAP_YEAR = 366;
const MONTH_TO_DAY_INDEX = {
    1: 31,
    2: 28, // or 29 if leap year: leap year if {year_number} / 4 === whole_number && {year_number} / 100 !== whole_number  && {year_number} / 400 === whole_number https://www.timeanddate.com/date/leapyear.html
    3: 31,
    4: 30,
    5: 31,
    6: 30,
    7: 31,
    8: 31,
    9: 30,
    10: 31,
    11: 30,
    12: 31
};
const LEAP_MONTH = 2;
const LEAP_MONTH_DAYS = 29;

module.exports = {
    EPOCH_YEAR,
    STRING_UNITS_TO_MILLISECONDS,
    DAYS_IN_A_NON_LEAP_YEAR,
    DAYS_IN_LEAP_YEAR,
    MONTH_TO_DAY_INDEX,
    LEAP_MONTH,
    LEAP_MONTH_DAYS
}