import { NextResponse } from 'next/server';
import db from '@/lib/mongoose';


export async function GET() {
    try {
        console.log('API Route Hit');

        await db.connect();
        console.log('DB Connected');

        return NextResponse.json({ message: 'db connected - ready for production' }, { status: 200 });

    } catch {
        console.error('error');
        return NextResponse.json({ error: 'error' }, { status: 500 });
    }
}
