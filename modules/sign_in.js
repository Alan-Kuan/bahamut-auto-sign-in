import { decorate_msg, MSG_TYPE } from '@/modules/msg_decorator.js';
import { HTTPError, SignInError } from '@/modules/error.js';

const ajax_base_url = 'https://www.gamer.com.tw/ajax';

export function sign_in(req) {
    return req.post(`${ajax_base_url}/signin.php`, { action: 2 })
        .then((res) => {
            if (!res.ok) {
                throw new HTTPError(err.statusText);
            }
            return res.json();
        })
        .then((body) => {
            if (body.data.signin === 1) {
                throw new SignInError('今日已簽到');
            }
            return req.get(`${ajax_base_url}/get_csrf_token.php`);
        })
        .then((res) => {
            if (!res.ok) {
                throw new HTTPError(res.statusText);
            }
            return res.text();
        })
        .then((token) => {
            return req.post(`${ajax_base_url}/signin.php`, {
                action: 1,
                token,
            });
        })
        .then((res) => {
            if (!res.ok) {
                throw new HTTPError(res.statusText);
            }
            return res.json();
        })
        .then((body) => {
            if (body.error) {
                throw new SignInError(body.error.message);
            }
            return decorate_msg(
                `簽到成功！已連續簽到 ${body.data.days} 天`,
                MSG_TYPE.SIGNIN_SUCCESS,
            );
        })
        .catch((err) => {
            const msg_type = err instanceof HTTPError
                ? MSG_TYPE.HTTP_ERROR
                : (err instanceof SignInError
                    ? MSG_TYPE.SIGNIN_FAILED
                    : MSG_TYPE.UNKNOWN_ERROR);
            return decorate_msg(err.message, msg_type);
        });
}
