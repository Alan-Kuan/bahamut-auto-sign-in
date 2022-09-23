#!/usr/bin/env deno run --import-map=../import_maps.json

import { config } from 'dotenv';
import { Telegram } from 'telegram';
import { Req } from '@/modules/req.js';
import { login } from '@/modules/login.js';
import { sign_in } from '@/modules/sign_in.js';
import { guild_sign_in } from '@/modules/guild_sign_in.js';
import { ani_answer } from '@/modules/ani_answer.js';

await config({ safe: true, export: true });
const UID = Deno.env.get('UID');
const PASSWD = Deno.env.get('PASSWD');
const VCODE = Deno.env.get('VCODE');
const TG_BOT_TOKEN = Deno.env.get('TG_BOT_TOKEN');
const TG_USER_ID = Deno.env.get('TG_USER_ID');
const MY_TOKEN = Deno.env.get('MY_TOKEN');

const req = new Req(VCODE);
const tg_bot = new Telegram(TG_BOT_TOKEN);

export default async ({ request }) => {
    if (!request.headers.has('Authorization')) {
        return responseWith(400);
    }

    const recv_token = request.headers.get('Authorization')
        .replace('Bearer ', '');
    if (recv_token !== MY_TOKEN) {
        return responseWith(401);
    }

    const status = await login(req, UID, PASSWD, VCODE)
        .then(async () => {
            const signin_msg = await sign_in(req);
            const guild_signin_msg = await guild_sign_in(req);
            const ani_answer_msg = await ani_answer(req);

            const today = new Date().toLocaleDateString('zh-TW', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            }).replaceAll('/', '-');

            const msg = `[登入簽到]\n${signin_msg}\n\n` +
                `[公會簽到]\n${guild_signin_msg}\n\n` +
                `[動畫瘋問答遊戲]\n${ani_answer_msg}\n\n` +
                `#${today}`;

            send(msg);
            return 200;
        })
        .catch((err) => {
            send(err);
            return 500;
        });

    return responseWith(status);
};

function send(msg) {
    console.log(msg);
    tg_bot.sendMessage({ chat_id: TG_USER_ID, text: msg });
}

function responseWith(status) {
    return new Response('', { status });
}
