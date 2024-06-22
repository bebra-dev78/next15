import { getServerSession } from "next-auth/next";

import { authConfig } from "#/configs/auth";

export async function GET() {
  const s = await getServerSession(authConfig);

  if (s === null) {
    return Response.json(null);
  } else {
    return fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/resourses/user?email=${s.user.email}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Secret: "bebra",
        },
      }
    );
  }
}
