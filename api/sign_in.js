import { config } from 'dotenv';
import { Telegram } from 'telegram';
import { Req } from '@/modules/req.js';
import { login } from '@/modules/login.js';
import { sign_in } from '@/modules/sign_in.js';
import { guild_sign_in } from '@/modules/guild_sign_in.js';
import { ani_answer } from '@/modules/ani_answer.js';

const env = config({ safe: true });
const req = new Req(env.VCODE);
const tg_bot = new Telegram(env.TG_BOT_TOKEN);

login(req, env.UID, env.PASSWD, env.VCODE)
    .then(async () => {
        const signin_msg = await sign_in(req);
        const guild_signin_msg = await guild_sign_in(req);
        const ani_answer_msg = await ani_answer(req);
        const today = new Date().toLocaleDateString('zh-TW').replaceAll('/', '-');
        const msg = `[登入簽到]\n${signin_msg}\n\n` +
            `[公會簽到]\n${guild_signin_msg}\n\n` +
            `[動畫瘋問答遊戲]\n${ani_answer_msg}\n\n` +
            `#${today}`;
        console.log(msg);
        tg_bot.sendMessage({ chat_id: env.TG_USER_ID, text: msg });
    })
    .catch((err) => {
        console.error(err);
        tg_bot.sendMessage({ chat_id: env.TG_USER_ID, text: err });
    });
