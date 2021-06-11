import Telegraf from 'telegraf';
import { JSDOM } from 'jsdom';
import { Keyboard } from 'telegram-keyboard';
import config from './config';
import { Answer, extraPhotoOptions } from './constants';
import { getRandomCat, getRandomDog, replyWithAnimal } from './utils';
import { TelegrafContext } from 'telegraf/typings/context';

export const bot = new Telegraf(config.BOT_TOKEN!);
bot.launch();
bot.startWebhook('/hook', null, Number(process.env.PORT) || 5000);
console.log('Bot started');

bot.start(async (ctx) => {
    await ctx.reply(
        'Привет!\nХочешь послущать про попаданцев? Тогда ты по адресу, дружочек'
    );

    await reply(ctx);
});
bot.hears(Answer.Next, async (ctx) => {
    await reply(ctx);
});

const reply = async (ctx: TelegrafContext) => {
    await ctx.reply('Щас пришлю вариантик, погоди чуток');
    await replyWithBook(ctx);
    const keyboard = Keyboard.make([Answer.Next]);
    await ctx.reply('Ну что?', keyboard.reply());
};

export const replyWithBook = async (ctx: TelegrafContext) => {
    const { title, url, coverUrl } = await getBook();
    await ctx.replyWithPhoto(coverUrl as string, {
        caption: `${title}\n${url}`,
        ...extraPhotoOptions,
    });
};

const getBook = async () => {
    const randomPage = Math.floor(Math.random() * 70) + 1;
    const dom = await JSDOM.fromURL(
        `https://audioliba.com/genres/16?p=${randomPage}`
    );
    const document = dom.window.document;
    const items = document.querySelectorAll('.item');
    const randomItemIndex = Math.floor(Math.random() * items.length);
    const item = items[randomItemIndex];
    const link = item.querySelector('.book-link');
    const url = link?.getAttribute('href');
    const title = link?.textContent;
    const coverUrl = item
        .querySelector('.cover')
        ?.getAttribute('data-original');
    console.log(url, title, coverUrl);

    return {
        url,
        title,
        coverUrl,
    };
};
