import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const HOME_PATH = '/home';

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname.split('/')[1];
    if ([''].includes(path)) return NextResponse.redirect(HOME_PATH);
}