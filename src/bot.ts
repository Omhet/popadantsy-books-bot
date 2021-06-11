import Telegraf from 'telegraf';
import { Keyboard, Key } from 'telegram-keyboard';
import config from './config';
import { AnimalKind, extraPhotoOptions } from './constants';
import {
    getRandomDog,
    getDogCaption,
    getRandomCat,
    getCatCaption,
    replyWithAnimal,
} from './utils';

export const bot = new Telegraf(config.BOT_TOKEN!);
bot.launch();
bot.startWebhook('/hook', null, Number(process.env.PORT) || 5000);
console.log('Bot started');

bot.start((ctx) => {
    const keyboard = Keyboard.make([AnimalKind.Cat, AnimalKind.Dog])
    ctx.reply('Привет!\nВыбери кого ты хочешь приютить?', keyboard.reply())
});
bot.hears(AnimalKind.Dog, async (ctx) => {
    const animal = await getRandomDog();
    replyWithAnimal(ctx, animal);
});
bot.hears(AnimalKind.Cat, async (ctx) => {
    const animal = await getRandomCat();
    replyWithAnimal(ctx, animal);
});
