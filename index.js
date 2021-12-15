const { Telegraf } = require('telegraf');
const dotenv = require('dotenv');
const sheduledReminderCheck = require('./reminderScheduler');
const processUserText = require('./processUserText');

dotenv.config();

const admonereBot = new Telegraf(process.env.BOT_TOKEN);

admonereBot.on('text', async (ctx) => {
    console.log('context: ', ctx.update.message.from);
    const messageBack = processUserText(ctx.update.message.text, ctx.chat.id);
    admonereBot.telegram.sendMessage(ctx.chat.id, messageBack);
});

sheduledReminderCheck(admonereBot);

admonereBot.launch();

process.once('SIGINT', () => admonereBot.stop('SIGINT'))
process.once('SIGTERM', () => admonereBot.stop('SIGTERM'))