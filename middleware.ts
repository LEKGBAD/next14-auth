
import authConfig from "./auth.config"
import NextAuth from "next-auth"
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  publicRoutes,
  authRoutes
} from "@/routes"

const {auth}=NextAuth(authConfig)
export default auth((req) => {
  // req.auth
 const {nextUrl}=req;
 const isLoggedIn=!!req.auth;

 const isApiAuthRoutes = nextUrl.pathname.startsWith(apiAuthPrefix);
 const isPublicRoute=publicRoutes.includes(nextUrl.pathname)
 const isAuthRoute=authRoutes.includes(nextUrl.pathname)

 if(isApiAuthRoutes) return null

 if(isAuthRoute) {
  if (isLoggedIn) {
    return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT,nextUrl))
  }
  return null
 }
 if(!isLoggedIn && !isPublicRoute){
  let callbackurl=nextUrl.pathname;
  if(nextUrl.search){
    callbackurl += nextUrl.search
  }
  const encodedCallbackUrl=encodeURIComponent(callbackurl)
  return Response.redirect(new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`,nextUrl))
 }

 return null
})

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}