// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   // Allow access to login and login API routes without a session
//   if (pathname.startsWith("/login") || pathname.startsWith("/api/login")) {
//     return NextResponse.next();
//   }

//   // Protect admin routes: check for a valid session cookie
//   if (pathname.startsWith("/admin")) {
//     const sessionCookie = request.cookies.get("session");
//     if (!sessionCookie || sessionCookie.value !== "admin-token") {
//       // Redirect to login page if no valid session exists
//       const loginUrl = new URL("/login", request.url);
//       return NextResponse.redirect(loginUrl);
//     }
//   }

//   return NextResponse.next();
// }

// // Apply middleware only for admin routes
// export const config = {
//   matcher: ["/admin/:path*"],
// };

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { recordVisit } from "@/lib/visit";
import { getProductBySlug } from "@/lib/models";
import { getIpInfo } from "@/lib/geoLocationService";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to login and login API routes without a session
  if (pathname.startsWith("/login") || pathname.startsWith("/api/login")) {
    return NextResponse.next();
  }

  // Protect admin routes: check for a valid session cookie
  if (pathname.startsWith("/admin")) {
    const sessionCookie = request.cookies.get("session");
    if (!sessionCookie || sessionCookie.value !== "admin-token") {
      // Redirect to login page if no valid session exists
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Track visits for product pages
  if (pathname.startsWith("/product/")) {
    try {
      // Extract the product slug from the URL
      const slug = pathname.split("/").pop();

      if (slug) {
        // Get the product ID from the slug
        const product = await getProductBySlug(slug);

        if (product) {
          // Get visitor's IP address
          let ip =
            request.headers.get("x-forwarded-for") || "0.0.0.0";

          // If it's a comma-separated list, take the first one
          if (ip.includes(",")) {
            ip = ip.split(",")[0].trim();
          }

          // Get country information based on IP
          const geoInfo = await getIpInfo(ip);
          const country = geoInfo?.country || "Unknown";

          // Record the visit asynchronously - don't wait for it to complete
          // This prevents slowing down the page load
          recordVisit(product.id, ip, country).catch((err) => {
            console.error("Error recording visit:", err);
          });
        }
      }
    } catch (error) {
      // Log the error but continue processing the request
      console.error("Error in visitor tracking:", error);
    }
  }

  return NextResponse.next();
}

// Apply middleware to both admin routes and product pages
export const config = {
  matcher: ["/admin/:path*", "/product/:path*"],
};
