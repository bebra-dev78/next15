import Credentials from "next-auth/providers/credentials";

export const authConfig = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: {
          label: "email",
          type: "text",
        },
        password: {
          label: "password",
          type: "password",
        },
      },
      authorize: (credentials) =>
        fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login?email=${credentials.email}&password=${credentials.password}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Secret: "bebra",
            },
          }
        )
          .then((res) => res.json())
          .then((res) =>
            res === 200
              ? {
                  email: credentials.email,
                }
              : null
          ),
    }),
  ],
  pages: {
    signIn: "/login",
  },
  secret: "bebra",
};
