/*
    formats to support - when time is unspecified always 12:00
    - Time relative reminders -  2 hours, 10 min(utes), 2 days : from now
    - next day specified time reminders - 18:00, 6pm, 10:00, 8am
    - Composite specific date & time - 7th December, 07/11 ,  07/11/2021, 10:00 07/11/2021, 6pm 7th December 
*/

/*
    REGEX_FORMAT_CAPTURE_MAP explained
    - RELATIVE_TIME_FORMAT - will capture a single instance of value and unit 2 hours, 10 min(utes), 2 days
    - next day specified time reminders - 18:00, 6pm, 10:00, 8am
    - Composite specific date & time - 7th December, 07/11 ,  07/11/2021, 10:00 07/11/2021, 6pm 7th December 
*/
const CacheSingleton = require('./reminderCache');
const { reduceTimestampAccuracyToMinutes } = require('./helpers');


const REGEX_FORMAT_CAPTURE_MAP = {
    RELATIVE_TIME_FORMAT: /(([1-9]|[0-9])+ +)(\bmins\b|\bminutes\b|\bhours\b|\bdays\b)/gm
}

const STRING_TO_TIME_MAP = {
    // unique set of charaters to represent day, hour and minutes for each kye and millisecond counterpart
    m: 60000,
    h: 3.6e+6,
    d: 8.64e+7
}


const processUserText = (userText, chatId) => {
    /* TODO
        1. when capturing fits start from Composite date format, to specified time then to Relative time format

    */

    let messageBack;

    if(validateReminderFormat(userText)) {
        const [date, content] = splitReminderDateAndContent(userText);
        const reminderTimestamp = transformReminderTimeToTimestamp(date);
        const cache = CacheSingleton.getInstance();
        cache.addEntry({
            timestamp: reduceTimestampAccuracyToMinutes(reminderTimestamp),
            chatId,
            reminder: content
        });

        console.log('cache: ', cache.retrieveAllEntries());
        console.log('timestamp: ',reminderTimestamp)
        console.log('date: ', new Date(reminderTimestamp).toString());
        console.log('timestamp before: ', reminderTimestamp);
        console.log('reduceTimestampAccuracyToMinutes: ',reduceTimestampAccuracyToMinutes(reminderTimestamp));

        console.log('process ', new Date(reduceTimestampAccuracyToMinutes(reminderTimestamp)).toString())
        messageBack = `reminder set ${new Date(reminderTimestamp).toString()}`;
    } else {
        console.log('format not valid');
        messageBack = 'format not valid, reminder couldn\'t be set';
    }

    return messageBack;
};

const transformReminderTimeToTimestamp = (date) => {
    const matchNumbersRegex = /([1-9]|[0-9])+/;
    const matchTimeUnit = /(m|h|d)/;

    let millisecondsOffset = 0;

    date.forEach((datePart) => {
        const matchedTimeUnit = datePart.match(matchTimeUnit);
        const matchedTimeValue = datePart.match(matchNumbersRegex);

        if(matchedTimeUnit && matchedTimeValue) {
            millisecondsOffset += STRING_TO_TIME_MAP[matchedTimeUnit[0]] * matchedTimeValue[0];
        }
    });

    const unixTimestamp = Date.now() + millisecondsOffset;
    return unixTimestamp;
}


const validateReminderFormat = (userText) => {
    if (userText.match(REGEX_FORMAT_CAPTURE_MAP.RELATIVE_TIME_FORMAT)) {
       return true;
    };

    return false;
};

const splitReminderDateAndContent = (userText) => {
    if (userText.match(REGEX_FORMAT_CAPTURE_MAP.RELATIVE_TIME_FORMAT)) {
        const relativeTimeArray = userText.match(REGEX_FORMAT_CAPTURE_MAP.RELATIVE_TIME_FORMAT);
        const content = userText.replace(REGEX_FORMAT_CAPTURE_MAP.RELATIVE_TIME_FORMAT, '');
        
        return [relativeTimeArray, content];
    }

};

module.exports = processUserText;



