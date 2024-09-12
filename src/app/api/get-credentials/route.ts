import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    const country = searchParams.get('country');
    const did = searchParams.get('did');

    if (!name || !country || !did) {
        return NextResponse.json({ message: 'Missing required parameters' }, { status: 400 });
    }

    try {
        const response = await fetch(
            `https://mock-idv.tbddev.org/kcc?name=${name}&country=${country}&did=${did}`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch credentials');
        }

        const credentials = await response.text();
        return NextResponse.json({ credentials });
    } catch (error) {
        console.error('Error fetching credentials:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}