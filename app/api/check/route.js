import { getServerSession } from "next-auth/next";

import { authConfig } from "#/configs/auth";

export async function GET() {
  return Response.json(
    (await getServerSession(authConfig)) === null ? null : 200
  );
}
