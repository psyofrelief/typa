// app/api/add-user-data/route.ts
import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { username, wpm, cpm, accuracy } = await request.json();
    const result = await sql`
INSERT INTO user_data (username, wpm, cpm, accuracy, submission_date)
      VALUES (${username}, ${wpm}, ${cpm}, ${accuracy}, CURRENT_TIMESTAMP)
      RETURNING *;`;

    return NextResponse.json(
      { message: "User data submitted.", user: result.rows[0] },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
