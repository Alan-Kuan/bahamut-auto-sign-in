import { decorate_msg, MSG_TYPE } from '@/modules/msg_decorator.js';
import { HTTPError } from '@/modules/error.js';

const login_url = 'https://api.gamer.com.tw/mobile_app/user/v3/do_login.php';

export function login(req, uid, passwd, vcode) {
    return req.post(login_url, { uid, passwd, vcode })
        .then((res) => {
            if (!res.ok) {
                throw new HTTPError(res.statusText);
            }
            return res.json();
        })
        .then((body) => {
            if (body.error) {
                throw new Error(body.message);
            }
        })
        .catch((err) => {
            const msg_type = err instanceof HTTPError
                ? MSG_TYPE.HTTP_ERROR
                : MSG_TYPE.UNKNOWN_ERROR;
            throw decorate_msg(err.message, msg_type);
        });
}
