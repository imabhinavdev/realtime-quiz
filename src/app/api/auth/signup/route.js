import { NextResponse } from "next/server";
import db from "@/db/db";
import { UserModel } from "@/models/UserModel";




export async function POST(request) {
    const body = await request.json();
    const { email, password, name } = body;
    console.log(email, password, name)

    if (!email || !password || !name) {
        return NextResponse.json({ error: "Email and password are required", status: 400 });
    }


    await db();

    try {
        // Check if the email already exists
        const existingUser = await UserModel.findOne({ email: email });
        if (existingUser) {
            return NextResponse.json({ error: "Email already in use", status: 400 });
        }

        // Create a new user
        const user = await UserModel.create(body);
        const token = user.generateAuthToken(); // Assuming you need to generate an auth token here
        // refresh token
        user.password = undefined;
        const refreshToken = user.generateRefreshToken();
        const res = NextResponse.json({ user, token, refreshToken });

        const options = {
            httpOnly: true,
            secure: true,
        }
        res.cookies.set("refreshToken", refreshToken, options);
        res.cookies.set("authToken", token, options);

        return res;


    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "An error occurred", message: err.message }, { status: 500 });
    }
}
