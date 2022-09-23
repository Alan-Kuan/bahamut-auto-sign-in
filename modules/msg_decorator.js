export const MSG_TYPE = Object.freeze({
    UNKNOWN_ERROR: 0,
    HTTP_ERROR: 1,
    SIGNIN_SUCCESS: 2,
    SIGNIN_FAILED: 3,
    GUILD_SIGNIN_SUCCESS: 4,
    GUILD_SIGNING_FAILED: 5,
    ANI_ANSWER_SUCCESS: 6,
    ANI_ANSWER_FAILED: 7,
});

export function decorate_msg(msg, type) {
    let icon;
    switch (type) {
        case MSG_TYPE.UNKNOWN_ERROR:
            // shrugging
            icon = '\u{1f937}' + random_skin_tone() + random_gender();
            break;
        case MSG_TYPE.HTTP_ERROR:
            // frowning
            icon = '\u{1f64d}' + random_skin_tone() + random_gender();
            break;
        case MSG_TYPE.SIGNIN_SUCCESS:
        case MSG_TYPE.GUILD_SIGNIN_SUCCESS:
            icon = random_choice(['✌', '🤟', '👍']) + random_skin_tone();
            break;
        case MSG_TYPE.SIGNIN_FAILED:
        case MSG_TYPE.GUILD_SIGNING_FAILED:
            // face palm
            icon = '\u{1f926}' + random_skin_tone() + random_gender();
            break;
        case MSG_TYPE.ANI_ANSWER_SUCCESS:
            // gesture ok
            icon = '\u{1f646}' + random_skin_tone() + random_gender();
            break;
        case MSG_TYPE.ANI_ANSWER_FAILED:
            // gesture no
            icon = '\u{1f645}' + random_skin_tone() + random_gender();
            break;
        default:
            icon = '❓';
    }
    return `${icon} ${msg}`;
}

function random_choice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

const ZWJ = '\u{200d}'; // zero-width joiner
const VS16 = '\u{fe0f}'; // variation selector-16

function random_skin_tone() {
    return random_choice([
        '\u{1f3fb}', // light
        '\u{1f3fc}', // medium light
        '\u{1f3fd}', // medium
        '\u{1f3fe}', // medium dark
        '\u{1f3ff}', // dark
    ]);
}

function random_gender() {
    return ZWJ + random_choice([
        '\u{2642}', // male
        '\u{2640}', // female
    ]) + VS16;
}
