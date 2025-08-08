import { decorate_msg, MsgType } from '@/msg_decorator.ts';
import { HTTPError } from '@/error.ts';
import type { Fetcher } from '@/fetcher.ts';

const api_base_url = 'https://api.gamer.com.tw/mobile_app/bahamut/v1';
const ani_base_url = 'https://ani.gamer.com.tw/ajax';

export async function ani_answer(fetcher: Fetcher): Promise<string> {
    const ans = await fetcher.get(`${api_base_url}/home.php`, {
        owner: 'blackXblue',
        page: 1,
    })
        .then((res) => {
            if (!res.ok) {
                console.error('Error: get home page');
                throw new HTTPError(res.statusText);
            }
            return res.json();
        })
        .then((body) => {
            const ans_sn = body.creation[0].sn;
            return fetcher.get(`${api_base_url}/home_creation_detail.php`, {
                sn: ans_sn,
            });
        })
        .then((res) => {
            if (!res.ok) {
                console.error('Error: get creation detail');
                throw new HTTPError(res.statusText);
            }
            return res.json();
        })
        .then((body) => {
            return body.content.match(/A:(\d)/)[1];
        })
        .catch((err) => {
            const msg_type = err instanceof HTTPError
                ? MsgType.HTTP_ERROR
                : MsgType.UNKNOWN_ERROR;
            return decorate_msg(err.message, msg_type);
        });

    const msg = await fetcher.get(`${ani_base_url}/animeGetQuestion.php`)
        .then((res) => {
            if (!res.ok) {
                console.error('Error: get anime question');
                throw new HTTPError(res.statusText);
            }
            return res.json();
        })
        .then((body) => {
            const token = body.token;
            return fetcher.post(`${ani_base_url}/animeAnsQuestion.php`, {
                token,
                ans,
            });
        })
        .then((res) => {
            if (!res.ok) {
                console.error('Error: post anime answer');
                throw new HTTPError(res.statusText);
            }
            return res.json();
        })
        .then((body) => {
            if (body.ok) {
                return decorate_msg(body.gift, MsgType.ANI_ANSWER_SUCCESS);
            } else {
                return decorate_msg(body.msg, MsgType.ANI_ANSWER_FAILED);
            }
        })
        .catch((err) => {
            const msg_type = err instanceof HTTPError
                ? MsgType.HTTP_ERROR
                : MsgType.UNKNOWN_ERROR;
            return decorate_msg(err.message, msg_type);
        });

    return msg;
}
