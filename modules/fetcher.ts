import { Cookie, CookieJar, wrapFetch } from '@jd1378/another-cookiejar';

export class Fetcher {
    static headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
    };
    fetch: ReturnType<typeof wrapFetch>;

    constructor(vcode: string) {
        const cookie = new Cookie({
            name: 'ckAPP_VCODE',
            value: vcode,
            domain: 'gamer.com.tw',
        });
        const jar = new CookieJar([cookie]);
        this.fetch = wrapFetch({ cookieJar: jar });
    }

    get(url: string, params?: { [key: string]: any }) {
        const full_url = params ? url + '?' + new URLSearchParams(params) : url;
        return this.fetch(full_url, {
            method: 'GET',
            credentials: 'include',
            headers: Fetcher.headers,
        });
    }

    post(url: string, body: { [key: string]: any }) {
        return this.fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: Fetcher.headers,
            body: new URLSearchParams(body), // since our Content-Type is "application/x-www-form-urlencoded"
        });
    }
}
