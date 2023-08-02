export type MIME =
    | "text/html"
    | "application/json"
    | "text/plain"
    | "text/css"
    | "text/javascript"
    | "image/png"
    | "image/jpeg"
    | "image/gif"
    | "image/svg+xml"
    | "image/x-icon"
    | "image/webp"
    | "audio/mpeg"
    | "audio/ogg"
    | "audio/wav"
    | "audio/webm"
    | "video/mp4"
    | "video/ogg"
    | "video/webm"
    | "application/pdf";

export type ResponseData = {
    type?: MIME;
    content?: string;
    status?: number;
    redirect?: string;
    headers?: Record<string, string>;
};

const make = (type: MIME, content: string | TemplateStringsArray): ResponseData => ({
    type,
    content: String(content),
    status: 200,
});

export const error = (status: number, content: string | TemplateStringsArray) => ({
    type: "text/plain",
    content: String(content),
    status,
});

export const redirect = (url: string, status = 302) => ({
    status,
    redirect: url,
});

/**
 * Create a response object for HTML content.
 */
export const html = (content: string | TemplateStringsArray) => make("text/html", String(content));
/**
 * Create a response object for JSON content.
 */
export const json = (content: object | string | TemplateStringsArray) =>
    make("application/json", typeof content === "string" ? content : JSON.stringify(content));
/**
 * Create a response object for plaintext content.
 */
export const text = (content: string | TemplateStringsArray) => make("text/plain", content);
/**
 * Create a response object for CSS content.
 */
export const css = (content: string | TemplateStringsArray) => make("text/css", content);
/**
 * Create a response object for JavaScript content.
 */
export const js = (content: string | TemplateStringsArray) => make("text/javascript", content);
/**
 * Create a response object for a PNG image.
 */
export const png = (content: string | TemplateStringsArray) => make("image/png", content);
/**
 * Create a response object for a JPEG image.
 */
export const jpg = (content: string | TemplateStringsArray) => make("image/jpeg", content);
