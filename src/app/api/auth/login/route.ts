
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, createSession } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const isValid = await verifyPassword(password, user.passwordHash);

        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const session = await createSession(user.id, user.role);

        // Await the cookies() call
        const cookieStore = await cookies();
        cookieStore.set('session', session, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            path: '/',
            sameSite: 'lax',
        });

        return NextResponse.json({ success: true, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
