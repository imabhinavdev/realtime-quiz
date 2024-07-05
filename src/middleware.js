import { NextResponse } from 'next/server'


// This function can be marked `async` if using `await` inside




export function middleware(request) {
  const path=request.nextUrl.pathname;

  
  if(path=="/signup" || path=="/login"){
    const authToken=request.cookies.authToken;
    const refreshToken=request.cookies.refreshToken;
    if(authToken){
      return NextResponse.redirect(new URL("/dashboard",request.nextUrl));
    }
    else{
      return NextResponse.next();
    }
  }
  
    
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/dashboard","/auth/:path*"]
}