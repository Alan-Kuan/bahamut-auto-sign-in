import { decorate_msg, MsgType } from '@/msg_decorator.ts';
import { HTTPError, SignInError } from '@/error.ts';
import type { Fetcher } from '@/fetcher.ts';

const ajax_base_url = 'https://www.gamer.com.tw/ajax';

export async function sign_in(fetcher: Fetcher): Promise<string> {
    return await fetcher.post(`${ajax_base_url}/signin.php`, { action: 2 })
        .then((res) => {
            if (!res.ok) {
                console.error('Error: post sign-in url with action 2');
                throw new HTTPError(res.statusText);
            }
            return res.json();
        })
        .then((body) => {
            if (body.data.signin === 1) {
                console.error('Error: already signed in');
                throw new SignInError('今日已簽到');
            }
            return fetcher.get(`${ajax_base_url}/get_csrf_token.php`);
        })
        .then((res) => {
            if (!res.ok) {
                console.error('Error: get csrf token');
                throw new HTTPError(res.statusText);
            }
            return res.text();
        })
        .then((token) => {
            return fetcher.post(`${ajax_base_url}/signin.php`, {
                action: 1,
                token,
            });
        })
        .then((res) => {
            if (!res.ok) {
                console.error('Error: post sign-in url with action 1');
                throw new HTTPError(res.statusText);
            }
            return res.json();
        })
        .then((body) => {
            if (body.error) {
                console.error('Error: failed to sign in');
                throw new SignInError(body.error.message);
            }
            return decorate_msg(
                `簽到成功！已連續簽到 ${body.data.days} 天`,
                MsgType.SIGNIN_SUCCESS,
            );
        })
        .catch((err) => {
            const msg_type = err instanceof HTTPError
                ? MsgType.HTTP_ERROR
                : (err instanceof SignInError
                    ? MsgType.SIGNIN_FAILED
                    : MsgType.UNKNOWN_ERROR);
            return decorate_msg(err.message, msg_type);
        });
}
