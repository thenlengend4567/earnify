
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

        if (!session || session.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const [usersCount, tasksCount, totalPayouts, pendingWithdrawals] = await Promise.all([
            prisma.user.count(),
            prisma.task.count(),
            prisma.transaction.aggregate({
                where: { type: 'WITHDRAW', status: 'COMPLETED' },
                _sum: { amount: true }
            }),
            prisma.withdrawalRequest.findMany({
                where: { status: 'PENDING' },
                include: { user: true },
                orderBy: { createdAt: 'desc' }
            })
        ]);

        return NextResponse.json({
            stats: {
                users: usersCount,
                tasks: tasksCount,
                payouts: totalPayouts._sum.amount || 0,
                pendingCount: pendingWithdrawals.length
            },
            withdrawals: pendingWithdrawals
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
