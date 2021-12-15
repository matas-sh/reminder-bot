const http = require('http')
const CacheSingleton = require('./reminderCache');
const { reduceTimestampAccuracyToMinutes } = require('./helpers');

const MILLISECONDS_IN_MINUTE = 60000;
const SCHEDULE_INTERVAL = MILLISECONDS_IN_MINUTE / 6

const sheduledReminderCheck = async (admonereBot) => {
    setInterval(async () => { 
        const currentTimestamp = reduceTimestampAccuracyToMinutes(Date.now());
        const cache = CacheSingleton.getInstance();
        const reminderEntries = cache.retrieveEntriesForTimestamp(currentTimestamp);
        
        if (reminderEntries) {
            const chatIds = Object.keys(reminderEntries);
        
            await chatIds.forEach(async (chatId) => {
                // await http.get(`http://api.callmebot.com/start.php?user=@mataxxx5&text=${reminderEntries[chatId]}&lang=en-GB&rpt=2'`);
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