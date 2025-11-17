//To send a JSON response to the client
import { NextResponse } from 'next/server';
//Create a cookie with session functions
import { getIronSession } from 'iron-session';
import { sesOpts, SessionData } from '@/lib/session';
import { cookies } from 'next/headers';

//Handle the GET HTTP request method
export async function GET (request: Request) {
    try {
        //obtain the user's current session using the browser cookie
        const session = await getIronSession<SessionData>(cookies(), sesOpts);

        //Check for the cookie's isLoggedIn flag
        if (session.isLoggedIn !== true) {
            //Send a 401 Error (Unauthorized) if the user is not logged in.
            return NextResponse.json(
                { message: 'This user is not logged in.' },
                { status: 401 }
            ); //return
        } //if

        //However, if the user is logged in, send the info back.
        return NextResponse.json(
            { id: session.userId,
              username: session.username,
              email: session.userEmail
            },
            { status: 200 }
        ); //return
    } //try

    //If any error is encountered, send a server error (500) and display a message.
    catch (error) {
        console.error('An error occured during the check session process.', error);
        return NextResponse.json(
            { message: 'An error occured during the check session process.' },
            {status: 500}
        ); //return
    } //catch

} //GET