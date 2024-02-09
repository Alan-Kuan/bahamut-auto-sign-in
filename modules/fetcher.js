#!/usr/bin/env deno run --import-map import_maps.json

import { Cookie, CookieJar, wrapFetch } from 'another_cookiejar';

export class Fetcher {
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
        const full_url = params ? url + '?' + new URLSearchParams(params) : url;
        return this.fetch(full_url, {
            method: 'GET',
            credentials: this.credentials,
            headers: this.headers,
        });
    }

    post(url, body) {
        return this.fetch(url, {
            method: 'POST',
            credentials: this.credentials,
            headers: this.headers,
            body: new URLSearchParams(body), // since our Content-Type is "application/x-www-form-urlencoded"
        });
    }
}
