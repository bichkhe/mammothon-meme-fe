import { NextResponse } from "next/server";

const CELESTIA_NODE_URL =
  "https://flying-minnow-discrete.ngrok-free.app/blob.Submit";
const CELESTIA_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBbGxvdyI6WyJwdWJsaWMiLCJyZWFkIiwid3JpdGUiLCJhZG1pbiJdLCJOb25jZSI6IjVLUGFXYVVGYW5TTlMwTk40Z1RqUk1QcUJWc0JRbDVRYWhmUGZ5UkhoNlk9IiwiRXhwaXJlc0F0IjoiMDAwMS0wMS0wMVQwMDowMDowMFoifQ.SxkCtdFk1sk87YGFh8GPgkExMi4BHTLsGj0ifiqAyCI";

// Function to send a request to Celestia Node with JSON-RPC
export async function POST(request: Request) {
  try {
    const requestData = await request.json();

    const response = await fetch(CELESTIA_NODE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CELESTIA_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Error when call Celestia API: " + error },
      { status: 500 }
    );
  }
}
