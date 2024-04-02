// app/api/check-user/route.ts
import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { username } = await request.json(); // Assuming the request body contains JSON data with "username" and "password" fields

    const result = await sql`
      SELECT *
      FROM user_logins
      WHERE username = ${username}
      LIMIT 1;`;

    if (result.rowCount > 0) {
      return NextResponse.json(
        { message: "User exists in database.", user_located: true },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        { message: "User doesn't exist in database.", user_located: false },
        { status: 200 },
      );
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
