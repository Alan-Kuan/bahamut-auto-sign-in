#!/usr/bin/env deno run --import-map import_maps.json

import { decorate_msg, MSG_TYPE } from '@/modules/msg_decorator.js';
import { HTTPError } from '@/modules/error.js';

const guild_url = 'https://api.gamer.com.tw/ajax/common/topBar.php';
const guild_signin_url = 'https://guild.gamer.com.tw/ajax/guildSign.php';

export function guild_sign_in(req) {
    return req.get(guild_url, { type: 'forum' })
        .then((res) => {
            if (!res.ok) {
                throw new HTTPError(res.statusText);
            }
            return res.text();
        })
        .then((guild_slider_html) => {
            const matches = [
                ...guild_slider_html.matchAll(/guild\.php\?gsn=(\d+)/g),
            ];
            const msg_promises = matches.map((match) => {
                const gsn = match[1];
                return req.post(guild_signin_url, { sn: gsn })
                    .then((res) => {
                        if (!res.ok) {
                            throw new HTTPError(res.statusText);
                        }
                        return res.json();
                    })
                    .then((body) => {
                        const msg_type = body.ok
                            ? MSG_TYPE.GUILD_SIGNIN_SUCCESS
                            : MSG_TYPE.GUILD_SIGNING_FAILED;
                        return decorate_msg(body.msg, msg_type);
                    })
                    .catch((err) => {
                        const msg_type = err instanceof HTTPError
                            ? MSG_TYPE.HTTP_ERROR
                            : MSG_TYPE.UNKNOWN_ERROR;
                        return decorate_msg(err.message, msg_type);
                    });
            });
            return Promise.all(msg_promises);
        })
        .then((msgs) => {
            return msgs.join('\n');
        })
        .catch((err) => {
            const msg_type = err instanceof HTTPError
                ? MSG_TYPE.HTTP_ERROR
                : MSG_TYPE.UNKNOWN_ERROR;
            return decorate_msg(err.message, msg_type);
        });
}
