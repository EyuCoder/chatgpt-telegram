import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { ChatGPTAPI, getOpenAIAuth } from 'chatgpt'
import * as dotenv from 'dotenv'
dotenv.config()

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start(async (ctx) => {
  // Using context shortcut
  await ctx.reply(`Hello ${ctx.chat.username ? ctx.chat.username : ctx.chat.id}`);
});

bot.help((ctx) => ctx.reply('Send me a sticker'));

bot.on(message('sticker'), (ctx) => ctx.reply('👍'));

bot.hears('hi', (ctx) => ctx.reply('Hey there, what can i help you with?'));

bot.on(message('text'), async (ctx) => {
  // Using context shortcut
  // await ctx.reply(ctx.message.text);
  await ctx.replyWithMarkdownV2(chatGpt(ctx.message.text))

});
bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));


async function chatGpt(msg) {
  try {
    const api = new ChatGPTAPI({
      sessionToken: process.env.CHATGPT_TOKEN,
      clearanceToken: process.env.CF_CLEARANCE
    });
    await api.ensureAuth()

    // send a message and wait for the response
    const response = await api.sendMessage(msg)
    // response is a markdown-formatted string
    console.log(response)
    return response;

  } catch (err) {
    console.log(err)
    return err
  }
}