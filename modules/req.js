#!/usr/bin/env deno run --import-map import_maps.json

import { Cookie, CookieJar, wrapFetch } from 'another_cookiejar';

export class Req {
    timeout = 1000;
    credentials = 'include';
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
    };

    constructor(vcode) {
        const cookie = new Cookie({
            name: 'ckAPP_VCODE',
            value: vcode,
            domain: 'gamer.com.tw',
        });
        const jar = new CookieJar([cookie]);
        this.fetch = wrapFetch({ cookieJar: jar });
    }

    get(url, params) {
        return this.fetch(url + '?' + new URLSearchParams(params), {
            method: 'GET',
            timeout: this.timeout,
            credentials: this.credentials,
            headers: this.headers,
        });
    }

    post(url, body) {
        return this.fetch(url, {
            method: 'POST',
            timeout: this.timeout,
            credentials: this.credentials,
            headers: this.headers,
            body: new URLSearchParams(body), // since our Content-Type is "application/x-www-form-urlencoded"
        });
    }
}
