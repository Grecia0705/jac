
export interface RequestExtMd extends Request {
    isAuthenticated: () => boolean;
    flash: any;
}

export interface ResponseExtMd extends Response {
    redirect: any;
}
