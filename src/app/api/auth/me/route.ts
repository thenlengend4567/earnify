
import { NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session')?.value;

    if (!sessionToken) {
        return NextResponse.json({ user: null });
    }

    try {
        const session = await verifySession(sessionToken);

        if (!session) {
            return NextResponse.json({ user: null });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                balance: true,
                referralCode: true,
            },
        });

        return NextResponse.json({ user });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ user: null });
    }
}
