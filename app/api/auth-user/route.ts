// app/api/auth-user/route.ts
import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json(); // Assuming the request body contains JSON data with "username" and "password" fields

    // Execute a query to check if a user exists with the provided username and password
    const result = await sql`
      SELECT *
      FROM user_logins
      WHERE username = ${username}
      AND password = ${password}
      LIMIT 1;`;

    // If a user exists with the provided username and password, return success response
    if (result.rowCount > 0) {
      return NextResponse.json({ message: "User authorised" }, { status: 200 });
    } else {
      return NextResponse.json(
        { message: "Incorrect credentials." },
        { status: 401 },
      );
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
