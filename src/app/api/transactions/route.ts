
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySession } from '@/lib/auth';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session')?.value;

    try {
        const session = await verifySession(sessionToken);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const transactions = await prisma.transaction.findMany({
            where: { userId: session.userId },
            orderBy: { createdAt: 'desc' },
            take: 50
        });

        return NextResponse.json({ transactions });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ transactions: [] });
    }
}
