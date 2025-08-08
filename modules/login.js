import { decorate_msg, MSG_TYPE } from '@/modules/msg_decorator.js';
import { HTTPError } from '@/modules/error.js';

const login_url = 'https://api.gamer.com.tw/mobile_app/user/v3/do_login.php';

export function login(fetcher, uid, passwd, vcode) {
    return fetcher.post(login_url, { uid, passwd, vcode })
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
                ? MSG_TYPE.HTTP_ERROR
                : MSG_TYPE.UNKNOWN_ERROR;
            return { ok: false, msg: decorate_msg(err.message, msg_type) };
        });
}
