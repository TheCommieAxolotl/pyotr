import { ResponseData } from "./common";
export * from "./common";

export const status = (status: number): ResponseData => {
    return {
        status,
        type: "text/plain",
        content: `Status ${status}`,
    };
};
