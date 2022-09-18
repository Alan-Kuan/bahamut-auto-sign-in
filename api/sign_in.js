import { config } from 'dotenv';
import { Req } from '@/modules/req.js';
import { login } from '@/modules/login.js';
import { sign_in } from '@/modules/sign_in.js';
import { guild_sign_in } from '@/modules/guild_sign_in.js';
import { ani_answer } from '@/modules/ani_answer.js';

const env = config({ safe: true });
const req = new Req(env.VCODE);

login(req, env.UID, env.PASSWD, env.VCODE)
    .then(async () => {
        const signin_msg = await sign_in(req);
        const guild_signin_msg = await guild_sign_in(req);
        const ani_answer_msg = await ani_answer(req);
        const msg = `${signin_msg}\n${guild_signin_msg}\n${ani_answer_msg}`;
        console.log(msg);
    })
    .catch((err) => {
        console.error(err);
    });
