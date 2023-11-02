import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { BOT_TOKEN } from './env';
import { findMethods } from './find-methods';

const bot = new Telegraf(BOT_TOKEN);

bot.on(message('text'), async (ctx) => {
  console.log(ctx.update.message.from.username ?? ctx.update.message.from.id, ctx.message.text.substring(0, 20));
  if (ctx.message.text === '/start') {
    await ctx.reply('Hello there :)\nSend me a solidity contract and I will find all methods for you\n\nContribute: https://github.com/crystalbit/evm-selector-tg-bot');
    return;
  }
  const result = findMethods(ctx.message.text);
  console.log(result);
  const answer = result.length > 0 ? result.join('\n') : 'No methods found';
  await ctx.reply(answer, { parse_mode: 'HTML' });
});

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))