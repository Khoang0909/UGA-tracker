//To send a JSON response to the client
import { NextResponse } from 'next/server';
//bcrypt hash used to encrypt password
import { hash } from 'bcryptjs';
//db.ts is the database connection function.
import { connectToDatabase } from '@/lib/db';

//Handle POST requests when form submitted from signup
export async function POST(request: Request) {
    try {
        //Get form data from the request
        const body = await request.json();

        //Get data from body object
        const username = body.username;
        const email = body.email;
        const password = body.password;

        //If a field is missing when signing up, send an error (400: Bad Request) and display a message.
        if (!username || !email || !password) {
            return NextResponse.json({ message: 'All fields must be filled out.' },
                { status: 400 }
            ); //return
        } //if

        //Connect to the database
        const database = await connectToDatabase();

        //Check if an email already exists in the database
        const dupEmail = await database.collection('users').findOne({ email: email });

        //If a duplicate email exists, send an error (409: Conflict) and display a message.
        if (dupEmail) {
            return NextResponse.json(
                { message: 'This email is already in use!' },
                { status: 409 }
            ); //return
        } //if

        //Encrypt the password using hash, using 16 salt round for better encryption
        const pwHash = await hash(password, 16);

        //If signup is successful, add the new user to a collection called 'users'.
        await database.collection('users').insertOne({
            username: username,
            email: email,
            password: pwHash
        }); //await

        //If signup is successful, send HTTP created code (201) and display a message.
        return NextResponse.json(
            { message: 'This user has been successfully created!' },
            { status: 201 }
        ); //return
    } //try

    //If any error is encountered, send a server error (500) and display a message.
    catch (error) {
        console.error('An error occured during the signup process. Please try again.', error);
        return NextResponse.json(
            { message: 'An error occured during the signup process. Please try again.' },
            {status: 500}
        ); //return
    } //catch
} //export async function POST
