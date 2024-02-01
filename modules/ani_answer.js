#!/usr/bin/env deno run --import-map import_maps.json

import { decorate_msg, MSG_TYPE } from '@/modules/msg_decorator.js';
import { HTTPError } from '@/modules/error.js';

const api_base_url = 'https://api.gamer.com.tw/mobile_app/bahamut/v1';
const ani_base_url = 'https://ani.gamer.com.tw/ajax';

export function ani_answer(req) {
    return req.get(`${api_base_url}/home.php`, {
        owner: 'blackXblue',
        page: 1,
    })
        .then((res) => {
            if (!res.ok) {
                throw new HTTPError(res.statusText);
            }
            return res.json();
        })
        .then((body) => {
            const ans_sn = body.creation[0].sn;
            return req.get(`${api_base_url}/home_creation_detail.php`, {
                sn: ans_sn,
            });
        })
        .then((res) => {
            if (!res.ok) {
                throw new HTTPError(res.statusText);
            }
            return res.json();
        })
        .then((body) => {
            const ans = body.content.match(/A:(\d)/)[1];
            return req.get(`${ani_base_url}/animeGetQuestion.php`, {
                t: Date.now(),
            })
                .then((res) => {
                    if (!res.ok) {
                        throw new HTTPError(res.statusText);
                    }
                    return res.json();
                })
                .then((body) => {
                    const token = body.token;
                    return req.post(`${ani_base_url}/animeAnsQuestion.php`, {
                        token,
                        ans,
                        t: Date.now(),
                    });
                });
        })
        .then((res) => {
            if (!res.ok) {
                throw new HTTPError(res.statusText);
            }
            return res.json();
        })
        .then((body) => {
            if (body.ok) {
                return decorate_msg(body.gift, MSG_TYPE.ANI_ANSWER_SUCCESS);
            } else if (body.error) {
                return decorate_msg(body.msg, MSG_TYPE.ANI_ANSWER_FAILED);
            }
        })
        .catch((err) => {
            const msg_type = err instanceof HTTPError
                ? MSG_TYPE.HTTP_ERROR
                : MSG_TYPE.UNKNOWN_ERROR;
            return decorate_msg(err.message, msg_type);
        });
}
