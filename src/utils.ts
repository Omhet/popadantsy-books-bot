import axios from 'axios';
import { TelegrafContext } from 'telegraf/typings/context';
import config from './config';
import { extraPhotoOptions } from './constants';
import { Animal, AnimalResponse, TotalNumber } from './types';

axios.defaults.baseURL = config.SHELTER_API;

export const getTotalDogs = async () => {
    const { data } = await axios.request<TotalNumber>({ url: `dogs/number` });
    return data?.total ?? 0;
};
export const getRandomDog = async (): Promise<Animal> => {
    const total = await getTotalDogs();
    const index = Math.floor(Math.random() * total);
    const { data: animal } = await axios.request<AnimalResponse>({ url: `dogs/${index}` });
    const caption = getDogCaption(animal);
    
    return {
        ...animal,
        caption
    };
};

export const getTotalCats = async () => {
    const { data } = await axios.request<TotalNumber>({ url: `cats/number` });
    return data?.total ?? 0;
};
export const getRandomCat = async (): Promise<Animal> => {
    const total = await getTotalCats();
    const index = Math.floor(Math.random() * total);
    const { data: animal } = await axios.request<AnimalResponse>({ url: `cats/${index}` });
    const caption = getCatCaption(animal);

    return {
        ...animal,
        caption
    };
};

export const getAnimalCaption = ({ name, gender, description, link }: AnimalResponse, linkText: string) =>
    `${name}, ${gender}\n\n${description}\n\n<a href="${link}">${linkText}</a>`;
export const getCatCaption = (animal: AnimalResponse) =>
    `🐱 ${getAnimalCaption(animal, 'Забрать котика')}`;
export const getDogCaption = (animal: AnimalResponse) =>
    `🐶 ${getAnimalCaption(animal, 'Забрать песика')}`;


export const replyWithAnimal = (ctx: TelegrafContext, animal: Animal) => {
    ctx.replyWithPhoto(animal.img, { caption: animal.caption, ...extraPhotoOptions });
}