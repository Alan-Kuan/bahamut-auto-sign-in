import { decorate_msg, MsgType } from '@/msg_decorator.ts';
import { HTTPError } from '@/error.ts';
import type { Fetcher } from '@/fetcher.ts';

const guild_url = 'https://api.gamer.com.tw/ajax/common/topBar.php';
const guild_signin_url = 'https://guild.gamer.com.tw/ajax/guildSign.php';

export async function guild_sign_in(fetcher: Fetcher): Promise<string> {
    return await fetcher.get(guild_url, { type: 'forum' })
        .then((res) => {
            if (!res.ok) {
                console.error('Error: get forum content from top bar');
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
                return fetcher.post(guild_signin_url, { sn: gsn })
                    .then((res) => {
                        if (!res.ok) {
                            console.error('Error: post guild sign-in url');
                            throw new HTTPError(res.statusText);
                        }
                        return res.json();
                    })
                    .then((body) => {
                        const msg_type = body.ok
                            ? MsgType.GUILD_SIGNIN_SUCCESS
                            : MsgType.GUILD_SIGNING_FAILED;
                        return decorate_msg(body.msg, msg_type);
                    })
                    .catch((err) => {
                        const msg_type = err instanceof HTTPError
                            ? MsgType.HTTP_ERROR
                            : MsgType.UNKNOWN_ERROR;
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
                ? MsgType.HTTP_ERROR
                : MsgType.UNKNOWN_ERROR;
            return decorate_msg(err.message, msg_type);
        });
}
