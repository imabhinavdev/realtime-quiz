import { NextResponse } from "next/server";
import db from "@/db/db";
import { UserModel } from "@/models/UserModel";


export async function POST(request) {
    const { email, password } = await request.json();

    if (!email || !password) {
        return NextResponse.json({ error: "Email and password are required", status: 400 });
    }

    await db();

    try {
        // Check if the email already exists
        const existingUser = await UserModel.findOne({
            email: email
        });
        if (!existingUser) {
            return NextResponse.json({ error: "Invalid email or password", status: 400 });
        }

        // Check if the password is correct
        const isMatch = await existingUser.comparePassword(password);
        if (!isMatch) {
            return NextResponse.json({ error: "Invalid email or password", status: 400 });
        }

        // Generate an auth token
        const token = existingUser.generateAuthToken();
        const refreshToken = existingUser.generateRefreshToken();
        const res = NextResponse.json({ user: existingUser, token, refreshToken });

        const options = {
            httpOnly: true,
            secure: true
        };
        res.cookies.set("refreshToken", refreshToken, options);
        res.cookies.set("authToken", token, options);

        return res;
    }
    catch (err) {
        console.error(err);
        return NextResponse.json({ error: "An error occurred", message: err.message }, { status: 500 });
    }
}