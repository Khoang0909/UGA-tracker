//To send a JSON response to the client
import { NextResponse } from 'next/server';
//Compare the password to the hashed password stored using bcrypt
import { compare } from 'bcryptjs';
//db.ts is the database connection function.
import { connectToDatabase } from '@/lib/db';
//Create a cookie with session functions
import { getIronSession } from 'iron-session';
import { sesOpts, SessionData } from '@/lib/session';
import { cookies } from 'next/headers';

//Handle the POST HTTP request method
export async function POST (request: Request) {
    try {
        //Get form data from the request
        const body = await request.json();
        //Get data from body object
        const email = body.email;
        const password = body.password;
        //Conenct to database
        const database = await connectToDatabase();
        
        //Find the user in the users collection (created in ../signup/route.ts)
        const user = await database.collection('users').findOne({ email: email });
        //Check if the user was found in the collection
        if (user == null) {
            //Send a 401 Error (Authentication required or missing credentials) if not found.
            return NextResponse.json(
                { message: 'Invalid credentials. Please try again.' },
                { status: 401 }
            );
        } //if

        //If the user was found in the collection, compare its password to the hashed password in the database using compare()
        const pwGood = await compare(password, user.password);
        //Check if pwGood returned true/false
        if (!pwGood) {
            //Send a 401 Error (Authentication required or missing credentials) if not found.
            return NextResponse.json(
                { message: 'Invalid credentials. Please try again.' },
                { status: 401 }
            );
        } //try


        //If neither of those errors are encountered, proceed with creating a session.
        const session = await getIronSession<SessionData>(cookies(), sesOpts);
        session.isLoggedIn = true;
        //"Type 'ObjectId' is not assignable to type 'string'." Added .toString() to fix.
        session.userId = user._id.toString();
        session.userEmail = user.email;
        session.username = user.username;

        //Save the session and send the cookie to the browser
        await session.save();

        //If all is successful, send an HTTP 200 (OK) and the user's info
        return NextResponse.json(
            { id: user._id.toString(),
              username: user.username,
              email: user.email
            },
            { status: 200 }
        ); //return
    } //try

    //If any error is encountered, send a server error (500) and display a message.
    catch (error) {
        console.error('An error occured during the login process. Please try again.', error);
        return NextResponse.json(
            { message: 'An error occured during the login process. Please try again.' },
            {status: 500}
        ); //return
    } //catch
} //POST
