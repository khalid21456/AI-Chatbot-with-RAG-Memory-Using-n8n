import { NextResponse } from 'next/server';


export async function POST(request: Request) {
    try {
        const body = await request.json();
        const prompt = body?.prompt ?? body;
        const response = await fetch("http://localhost:5678/webhook-test/api/prompt", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(prompt),
        });
        console.log('POST /api/prompt body:', prompt);
        return NextResponse.json({ message: prompt });
    }catch(e) {
        console.error(e);
        return NextResponse.json({ error: "Error parsing request" }, { status: 500 });
    }
}