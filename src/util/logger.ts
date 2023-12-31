export enum ANSI {
    reset = "\x1b[0m",
    bold = "\x1b[1m",
    dim = "\x1b[2m",
    underscore = "\x1b[4m",
    blink = "\x1b[5m",
    reverse = "\x1b[7m",
    hidden = "\x1b[8m",
    black = "\x1b[30m",
    red = "\x1b[31m",
    green = "\x1b[32m",
    yellow = "\x1b[33m",
    blue = "\x1b[34m",
    magenta = "\x1b[35m",
    cyan = "\x1b[36m",
    white = "\x1b[37m",
    bg_black = "\x1b[40m",
    bg_red = "\x1b[41m",
    bg_grees = "\x1b[42m",
    bg_yellow = "\x1b[43m",
    bg_blue = "\x1b[44m",
    bg_magenta = "\x1b[45m",
    bg_cyan = "\x1b[46m",
    bg_white = "\x1b[47m",
}

export const log = (message: string | Error, ...colors: ANSI[]): void => {
    if (message instanceof Error) {
        message = `\n${color(" ERROR ", ANSI.bg_red)} ${message.message}`;
    }

    console.log(
        colors
            .map((color) => {
                if (color.toLowerCase() in ANSI) {
                    return ANSI[color.toLowerCase()];
                } else {
                    return color;
                }
            })
            .join("") +
            message +
            ANSI.reset
    );
};

export const color = (message: string, ...colors: ANSI[]): string => {
    return (
        colors
            .map((color) => {
                if (color.toLowerCase() in ANSI) {
                    return ANSI[color.toLowerCase()];
                } else {
                    return color;
                }
            })
            .join("") +
        message +
        ANSI.reset
    );
};
