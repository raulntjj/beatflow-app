import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  // if (!token && request.nextUrl.pathname !== '/login') {
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }

  // Rota para redirecionar rota raiz para login
  if (!token && request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Rotas que não necessitam de token
  if(!token) {
    if (request.nextUrl.pathname.startsWith("/register/step2")) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  
    if (request.nextUrl.pathname.startsWith("/feed")) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  
    if (request.nextUrl.pathname.startsWith("/profile")) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if(token) {
    if (request.nextUrl.pathname.startsWith("/login")) {
      return NextResponse.redirect(new URL("/feed", request.url));
    }

    if (request.nextUrl.pathname === "/") {
      return NextResponse.redirect(new URL("/feed", request.url));
    }

    if (request.nextUrl.pathname === "/notifications") {
      return NextResponse.redirect(new URL("/notifications", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/register/:path*",
    "/login/:path*",
    "/feed/:path*",
    "/profile/:path*",
  ],
};
