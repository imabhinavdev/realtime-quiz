import { NextResponse } from "next/server";

// Logout route
export async function POST(request) {
    const res = NextResponse.json({ message: "Logged out" });
    res.cookies.set("refreshToken", "", { maxAge: 0 });
    res.cookies.set("authToken", "", { maxAge: 0 });
    return res;
}