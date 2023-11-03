import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { BOT_TOKEN } from './env';
import { findMethods } from './find-methods';
import { findEventHashes, findSelectors } from './helpers';
import { openChainQuery } from './openchain-api';

const bot = new Telegraf(BOT_TOKEN);
const CREDITS = '\n\nSelectors and event hashes are checked against <a href="https://openchain.xyz">OpenChain</a> database';

bot.on(message('text'), async (ctx) => {
  console.log(ctx.update.message.from.username ?? ctx.update.message.from.id, ctx.message.text.substring(0, 20));
  if (ctx.message.text === '/start') {
    await ctx.reply('Hello there :)\nSend me a solidity code, selectors or/and event hashes\n\nContribute: https://github.com/crystalbit/evm-selector-tg-bot');
    return;
  }
  // first check methods
  const result = findMethods(ctx.message.text);
  if (result.length > 0) {
    const answer = result.join('\n');
    await ctx.reply(answer, { parse_mode: 'HTML' });
  }
  // now api call
  const selectors = findSelectors(ctx.message.text);
  const eventHashes = findEventHashes(ctx.message.text);
  if (selectors.length > 0 || eventHashes.length > 0) {
    const data = await openChainQuery(selectors, eventHashes);
    if (data.length > 0) {
      await ctx.reply(data + CREDITS, { parse_mode: 'HTML' });
    } else {
      await ctx.reply('No selectors and event hashes found in database' + CREDITS);
    }
  }

  // if we haven't answered yet
  if (result.length === 0 && selectors.length === 0 && eventHashes.length === 0) {
    await ctx.reply('No methods, selectors and event hashes found');
    return;
  }
});

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))