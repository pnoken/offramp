import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';

export async function POST(req: Request) {
    try {
        const { filename, portableDid } = await req.json();

        await fs.writeFile(filename, JSON.stringify(portableDid, null, 2));
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error writing to file:', error);
        return NextResponse.json({ success: false, error: 'Error writing to file' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    return NextResponse.json({ message: 'GET method is not implemented' }, { status: 405 });
}

export async function PUT(req: Request) {
    return NextResponse.json({ message: 'PUT method is not implemented' }, { status: 405 });
}

export async function DELETE(req: Request) {
    return NextResponse.json({ message: 'DELETE method is not implemented' }, { status: 405 });
}
