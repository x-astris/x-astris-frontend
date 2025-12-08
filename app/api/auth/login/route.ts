import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const backendRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await backendRes.json();

    return NextResponse.json(data, { status: backendRes.status });
  } catch (e: any) {
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
}
