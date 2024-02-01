#!/usr/bin/env deno run --import-map import_maps.json

import { load } from 'dotenv';
import { Telegram } from 'telegram';
import { Fetcher } from '@/modules/fetcher.js';
import { login } from '@/modules/login.js';
import { sign_in } from '@/modules/sign_in.js';
import { guild_sign_in } from '@/modules/guild_sign_in.js';
import { ani_answer } from '@/modules/ani_answer.js';

// for production: read environment variables
// for development: read exported variables from .env
await load({ export: true });
const UID = Deno.env.get('UID');
const PASSWD = Deno.env.get('PASSWD');
const VCODE = Deno.env.get('VCODE');
const TG_BOT_TOKEN = Deno.env.get('TG_BOT_TOKEN');
const TG_USER_ID = Deno.env.get('TG_USER_ID');
const MY_TOKEN = Deno.env.get('MY_TOKEN');

const fetcher = new Fetcher(VCODE);
const tg_bot = new Telegram(TG_BOT_TOKEN);

export default async (req) => {
    if (!req.headers.has('Authorization')) {
        console.error('No token was given.');
        return new Response({ status: 400 });
    }

    if (req.headers.get('Authorization') !== `Bearer ${MY_TOKEN}`) {
        console.error('Wrong token was given.');
        return new Response({ status: 401 });
    }

    const status = await login(fetcher, UID, PASSWD, VCODE)
        .then(async (status) => {
            if (!status.ok) {
                throw new Error(status.msg);
            }

            const signin_msg = await sign_in(fetcher);
            const guild_signin_msg = await guild_sign_in(fetcher);
            const ani_answer_msg = await ani_answer(fetcher);

            const today = new Date().toLocaleDateString('zh-TW', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            }).replaceAll('/', '-');

            const msg = `[登入簽到]\n${signin_msg}\n\n` +
                `[公會簽到]\n${guild_signin_msg}\n\n` +
                `[動畫瘋問答遊戲]\n${ani_answer_msg}\n\n` +
                `#${today}`;
            await tg_bot.sendMessage({ chat_id: TG_USER_ID, text: msg });

            return 200;
        })
        .catch(async (err) => {
            console.error(err);

            const msg = `發生錯誤：\n${err.message}`;
            await tg_bot.sendMessage({ chat_id: TG_USER_ID, text: msg });

            return 500;
        });

    return new Response({ status });
};
