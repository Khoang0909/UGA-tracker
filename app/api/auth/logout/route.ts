//To send a JSON response to the client
import { NextResponse } from 'next/server';
//Create a cookie with session functions
import { getIronSession } from 'iron-session';
import { sesOpts, SessionData } from '@/lib/session';
import { cookies } from 'next/headers';

//Handle the POST HTTP request method
export async function POST (request: Request) {
    try {
        //obtain the user's current session using the browser cookie
        const session = await getIronSession<SessionData>(cookies(), sesOpts);

        //When the user logs out, destroy/terminate the session.
        session.destroy();
        //If all is successful, send an HTTP 200 (OK) to signify that the logout was successful
        return NextResponse.json(
            { message: 'Logout successful.' },
            { status: 200 }
        ); //return
    } //try

    //If any error is encountered, send a server error (500) and display a message.
    catch (error) {
        console.error('An error occured during the logout process. Please try again.', error);
        return NextResponse.json(
            { message: 'An error occured during the logout process. Please try again.' },
            {status: 500}
        ); //return
    } //catch

} //POST