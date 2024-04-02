// app/api/retrieve-user-stats/route.ts
import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { username } = await request.json(); // Assuming the request body contains JSON data with "username" and "password" fields

    const result = await sql`
     SELECT id, wpm, cpm, accuracy, submission_date
      FROM user_data
      WHERE username = ${username};`;

    return NextResponse.json({ users: result.rows }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
