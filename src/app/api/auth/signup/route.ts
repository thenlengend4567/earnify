
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, createSession } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, name } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'User already exists' },
                { status: 400 }
            );
        }

        const passwordHash = await hashPassword(password);
        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                name,
            },
        });

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
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
