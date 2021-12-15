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
const { supportedTimeFormatResolvers, supportedDateFormatsResolvers  } = require('./dateAndTimeFormatResolvers');
const { reduceTimestampAccuracyToMinutes, getDaysSinceEPOCH, daysToMillisenconds } = require('./helpers');

const REGEX_FORMAT_CAPTURE_MAP = {
    RELATIVE_TIME_FORMAT: /(([1-9]|[0-9])+ +)(\bmin\b|\bmins\b|\bminute\b|\bminutes\b|\bhours\b|\bhours\b|\bdays\b|\bdays\b)/gm
}

const processUserText = (userText, chatId) => {
    let messageBack;

    if(validateReminderFormat(userText)) {
        const [date, content] = splitReminderDateAndContent(userText);
        console.log()
        const reminderTimestamp = transformReminderTimeToTimestamp(date);

        const cache = CacheSingleton.getInstance();
        cache.addEntry({
            timestamp: reduceTimestampAccuracyToMinutes(reminderTimestamp),
            chatId,
            reminder: content
        });

        console.log('cache: ', cache.retrieveAllEntries());
        messageBack = `reminder set ${new Date(reminderTimestamp).toString()}`;
    } else {
        console.log('format not valid');
        messageBack = 'format not valid, reminder couldn\'t be set';
    }

    return messageBack;
};

const transformReminderTimeToTimestamp = (date) => {

    const dateInTimestamp = date.map(date => {
        const validDateFound = supportedDateFormatsResolvers.find(dateFormat => date.match(dateFormat.matcher));
        const validTimeFound = supportedTimeFormatResolvers.find(timeFormat =>  date.match(timeFormat.matcher));
        if (validTimeFound) {
            return validTimeFound.resolver(date);
        }

        if (validDateFound) {
            return validDateFound.resolver(date);
        }
    });

    let unixTimestamp = 0;

    if (dateInTimestamp.length > 1) {
        unixTimestamp = dateInTimestamp.reduce((acc, timestamp) => {
            acc += timestamp;

            return acc;
        }, 0);
    } else {
        const currentDate = new Date();
        const daysSinceEpoch = getDaysSinceEPOCH(
            currentDate.getDate(), 
            (currentDate.getMonth() + 1), // this month index starts from 0 rather than one
            currentDate.getFullYear()
        );
        unixTimestamp = daysToMillisenconds(daysSinceEpoch) + dateInTimestamp[0];
    }

    return unixTimestamp;
}


const validateReminderFormat = (userText) => {
    const validTimeFound = supportedTimeFormatResolvers.find(timeFormat =>  userText.match(timeFormat.matcher));

    if (userText.match(REGEX_FORMAT_CAPTURE_MAP.RELATIVE_TIME_FORMAT)) {
       return true;
    };

    if (validTimeFound) {
        return true;
    }

    return false;
};

const splitReminderDateAndContent = (userText) => {
    const validDateFound = supportedDateFormatsResolvers.find(dateFormat => userText.match(dateFormat.matcher));
    const validTimeFound = supportedTimeFormatResolvers.find(timeFormat =>  userText.match(timeFormat.matcher));
    const date = [];
    let content = userText;

    if (userText.match(REGEX_FORMAT_CAPTURE_MAP.RELATIVE_TIME_FORMAT)) {
        const relativeTimeArray = content.match(REGEX_FORMAT_CAPTURE_MAP.RELATIVE_TIME_FORMAT);
        content = content.replace(REGEX_FORMAT_CAPTURE_MAP.RELATIVE_TIME_FORMAT, '');
        
        return [relativeTimeArray, content];
    }
    
    if (validTimeFound) {
        date.push(content.match(validTimeFound.matcher)[0]);
        content = content.replace(validTimeFound.matcher, '');
    }
    
    if (validDateFound) {
        date.push(content.match(validDateFound.matcher)[0]);
        content = content.replace(validDateFound.matcher, '');
    }

    return [date, content];
};

module.exports = processUserText;



