var CacheSingleton = (function(){
    function Cache() {
        const cacheStorage = {};

        addEntry = (entry) => {
            const { timestamp, chatId, reminder } = entry;

            if (cacheStorage[timestamp]) {
                cacheStorage[timestamp] = {
                    ...cacheStorage[timestamp],
                    [chatId]: reminder
                }
            } else {
                cacheStorage[timestamp] = {
                    [chatId]: reminder
                }
            }
            
        }
        retrieveEntriesForTimestamp = (timestamp) => {
            if (cacheStorage[timestamp]) {
                return cacheStorage[timestamp];
            }

            return null;
        }
        deleteEntry = (entry) => {
            const { timestamp, chatId } = entry;

            delete cacheStorage[timestamp][chatId];

            if (!Object.keys(cacheStorage[timestamp]).length) {
                delete cacheStorage[timestamp];
            }
        }
        retrieveAllEntries = () => {
            return cacheStorage;
        }

        return {
            addEntry,
            retrieveEntriesForTimestamp,
            deleteEntry,
            retrieveAllEntries
        };
    }
    var instance;
    return {
        getInstance: function(){
            if (instance == null) {
                instance = new Cache();
                instance.constructor = null;
            }
            return instance;
        }
   };
})();

module.exports = CacheSingleton;