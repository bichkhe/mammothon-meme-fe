import { NextResponse } from 'next/server';

//req is short for request
export async function GET() {
  return NextResponse.json({ message: 'this is a get request' }, { status: 200 });
}

export async function POST() {
  return NextResponse.json({ message: 'This is a post request' }, { status: 200 });
}

export async function PATCH() {
  return NextResponse.json({ message: 'This is a patch request' }, { status: 200 });
}
// you can also handle PATCH, DELETE, PUT
