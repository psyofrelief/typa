// app/api/create-user/route.ts
import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json(); // Assuming the request body contains JSON data with "username" and "password" fields

    // Execute a query to check if a user exists with the provided username and password
    const result = await sql`
    INSERT INTO user_logins (username, password)
      VALUES (${username}, ${password});`;

    // If a user exists with the provided username and password, return success response
    if (result.rowCount > 0) {
      return NextResponse.json({ message: "User created." }, { status: 201 });
    } else {
      return NextResponse.json(
        { message: "User cannot be created." },
        { status: 404 },
      );
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
