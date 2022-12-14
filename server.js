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







// async function chatGpt(msg, bot) {
//   try {
//     const openAIAuth = await getOpenAIAuth({ email, password })
//     const api = new ChatGPTAPI({ ...openAIAuth })
//     await api.ensureAuth()
//     bot.sendMessage(msg.chat.id, '🤔正在组织语言...').then((res) => {
//       bot.sendChatAction(msg.chat.id, 'typing')
//       tempId = res.message_id
//     })
//     const response = await api.sendMessage(msg.text)
//     bot.deleteMessage(msg.chat.id, tempId)
//     console.log(new Date().toLocaleString(), '--AI回复:<', msg.text, '>:', response);
//     bot.sendMessage(msg.chat.id, response, { parse_mode: 'Markdown' });
//   } catch (err) {
//     console.log(err)
//     tempId && bot.deleteMessage(msg.chat.id, tempId)
//     bot.sendMessage(msg.chat.id, '😭出错了，请稍后再试；如果您是管理员，请检查日志。');
//     throw err
//   }
// }



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