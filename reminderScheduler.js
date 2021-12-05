const CacheSingleton = require('./reminderCache');
const { reduceTimestampAccuracyToMinutes } = require('./helpers');

const MILLISECONDS_IN_MINUTE = 60000;
const SCHEDULE_INTERVAL = MILLISECONDS_IN_MINUTE / 6

const sheduledReminderCheck = (admonereBot) => {
    setInterval(() => { 
        const currentTimestamp = reduceTimestampAccuracyToMinutes(Date.now());
        const cache = CacheSingleton.getInstance();
        const reminderEntries = cache.retrieveEntriesForTimestamp(currentTimestamp);
        
        if (reminderEntries) {
            const chatIds = Object.keys(reminderEntries);
        
            chatIds.forEach((chatId) => {
                admonereBot.telegram.sendMessage(chatId, reminderEntries[chatId]);
                cache.deleteEntry({
                    timestamp: currentTimestamp,
                    chatId: chatId
                });
            });
        }


        console.log('current cache', cache.retrieveAllEntries());
    }, SCHEDULE_INTERVAL);
};

module.exports = sheduledReminderCheck;