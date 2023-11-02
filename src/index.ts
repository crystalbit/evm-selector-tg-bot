import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { BOT_TOKEN } from './env';
import { findMethods } from './find-methods';

const bot = new Telegraf(BOT_TOKEN);

bot.on(message('text'), async (ctx) => {
  // console.log(ctx.message.text);
  const result = findMethods(ctx.message.text);
  console.log(result);
  const answer = result.length > 0 ? result.join('\n') : 'No methods found';
  await ctx.reply(answer, { parse_mode: 'HTML' });
});

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))