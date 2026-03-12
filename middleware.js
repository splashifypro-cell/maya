import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      const { pathname } = req.nextUrl;
      // Allow access to login page without token
      if (pathname === "/admin/login") return true;
      // Require token for all other /admin routes
      return !!token;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
});

export const config = {
  matcher: [
    "/admin/:path*",
  ],
};
