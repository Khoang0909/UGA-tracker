import { SessionOptions } from 'iron-session';

//Data to put in the cookie
export interface SessionData {
    userId: string;
    username: string;
    userEmail: string;
    isLoggedIn: boolean;
} //SessionData

//cookie settings
export const sesOpts: SessionOptions = {
    password: process.env.SESSION_PASSWORD as string,

    cookieName: 'WebDawgFutures-session-cookie',

    cookieOptions: {
        secure: process.env.NODE_ENV === 'production'
    } //cookieOptions
}; //sesOpts