import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
export function middleware(request) {
  const path = request.nextUrl.pathname;

  // Handle signup and login paths
  if (path === "/signup" || path === "/login") {
    const authToken = request.cookies.get('authToken');
    const refreshToken = request.cookies.get('refreshToken');
    if (authToken) {
      return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
    } else {
      return NextResponse.next();
    }
  }

  // Handle logout

  if (path === "/logout") {
    // clear cookies
    const res = NextResponse.redirect(new URL("/login", request.nextUrl));
    res.cookies.set("authToken", "", { maxAge: 0 });
    res.cookies.set("refreshToken", "", { maxAge: 0 });
    return res;
  }

  // Handle dashboard
  if (path.startsWith("/user")) {
    const authToken = request.cookies.get('authToken');
    if (!authToken) {
      return NextResponse.redirect(new URL("/login", request.nextUrl));
    }
    return NextResponse.next();
  }

  // Handle API paths
  // if (path.startsWith('/api/') && path !== '/api/auth') {
  //   const authToken = request.cookies.get('authToken');
  //   if (!authToken) {
  //     return NextResponse.redirect(new URL("/login", request.nextUrl));
  //   }
  //   const decodedToken = jwt.decode(authToken);
  //   console.log(decodedToken)


  // }
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/signup", "/login", "/dashboard", "/logout", "/user/:path*"]
};
