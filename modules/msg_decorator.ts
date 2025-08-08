export const enum MsgType {
    UNKNOWN_ERROR,
    HTTP_ERROR,
    SIGNIN_SUCCESS,
    SIGNIN_FAILED,
    GUILD_SIGNIN_SUCCESS,
    GUILD_SIGNING_FAILED,
    ANI_ANSWER_SUCCESS,
    ANI_ANSWER_FAILED,
};

export function decorate_msg(msg: string, type: MsgType): string {
    let icon;
    switch (type) {
        case MsgType.UNKNOWN_ERROR:
            // shrugging
            icon = '\u{1f937}' + random_skin_tone() + random_gender();
            break;
        case MsgType.HTTP_ERROR:
            // frowning
            icon = '\u{1f64d}' + random_skin_tone() + random_gender();
            break;
        case MsgType.SIGNIN_SUCCESS:
        case MsgType.GUILD_SIGNIN_SUCCESS:
            icon = random_choice(['✌', '🤟', '👍']) + random_skin_tone();
            break;
        case MsgType.SIGNIN_FAILED:
        case MsgType.GUILD_SIGNING_FAILED:
            // face palm
            icon = '\u{1f926}' + random_skin_tone() + random_gender();
            break;
        case MsgType.ANI_ANSWER_SUCCESS:
            // gesture ok
            icon = '\u{1f646}' + random_skin_tone() + random_gender();
            break;
        case MsgType.ANI_ANSWER_FAILED:
            // gesture no
            icon = '\u{1f645}' + random_skin_tone() + random_gender();
            break;
        default:
            icon = '❓';
    }
    return `${icon} ${msg}`;
}

function random_choice(arr: string[]): string {
    return arr[Math.floor(Math.random() * arr.length)];
}

const ZWJ = '\u{200d}'; // zero-width joiner
const VS16 = '\u{fe0f}'; // variation selector-16

function random_skin_tone(): string {
    return random_choice([
        '\u{1f3fb}', // light
        '\u{1f3fc}', // medium light
        '\u{1f3fd}', // medium
        '\u{1f3fe}', // medium dark
        '\u{1f3ff}', // dark
    ]);
}

function random_gender(): string {
    return ZWJ + random_choice([
        '\u{2642}', // male
        '\u{2640}', // female
    ]) + VS16;
}
