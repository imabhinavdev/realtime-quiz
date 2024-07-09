import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
export function middleware(request) {
  const path = request.nextUrl.pathname;

  if (path.startsWith('/_next')) {
    return NextResponse.next();
  }
  // Handle signup and login paths
  if (path === "/signup" || path === "/login") {
    const authToken = request.cookies.get('authToken');
    const refreshToken = request.cookies.get('refreshToken');
    if (authToken) {
      return NextResponse.redirect(new URL("/user/dashboard", request.nextUrl));
    } else {
      return NextResponse.next();
    }
  }

  // Handle logout



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
  matcher: ["/signup", "/login", "/dashboard", "/logout", "/user/:path*", "/_next/:path*"]
};
