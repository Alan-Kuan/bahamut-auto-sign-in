import { decorate_msg, MsgType } from '@/msg_decorator.ts';
import { HTTPError } from '@/error.ts';
import type { Fetcher } from '@/fetcher.ts';

type LoginResult = {
    ok: boolean,
    msg?: string,
};

const login_url = 'https://api.gamer.com.tw/mobile_app/user/v3/do_login.php';

export async function login(fetcher: Fetcher, uid: string, passwd: string,
        vcode: string): Promise<LoginResult> {
    return await fetcher.post(login_url, { uid, passwd, vcode })
        .then((res) => {
            if (!res.ok) {
                console.error('Error: post login url');
                throw new HTTPError(res.statusText);
            }
            return res.json();
        })
        .then((body) => {
            if (body.error) {
                console.error('Error: failed to log in');
                throw new Error(body.message);
            }
            return { ok: true };
        })
        .catch((err) => {
            const msg_type = err instanceof HTTPError
                ? MsgType.HTTP_ERROR
                : MsgType.UNKNOWN_ERROR;
            return { ok: false, msg: decorate_msg(err.message, msg_type) };
        });
}
