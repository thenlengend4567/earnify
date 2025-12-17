
import { verifySession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import DashboardClient from '@/components/DashboardClient';

async function getData() {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session')?.value;
    const session = await verifySession(sessionToken);

    if (!session) return null;

    const [userRaw, tasksRaw, transactionsRaw] = await Promise.all([
        prisma.user.findUnique({
            where: { id: session.userId },
            select: { name: true, balance: true, email: true },
        }),
        prisma.task.findMany({
            where: { active: true },
            take: 5
        }),
        prisma.transaction.findMany({
            where: { userId: session.userId },
            orderBy: { createdAt: 'desc' },
            take: 10
        }),
    ]);

    // Serialize Prisma data (Decimal/Date) for Client Component
    const user = userRaw ? {
        ...userRaw,
        balance: userRaw.balance.toString(),
    } : null;

    const tasks = tasksRaw.map(task => ({
        ...task,
        rewardAmount: task.rewardAmount.toString(),
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString(),
    }));

    const transactions = transactionsRaw.map(tx => ({
        ...tx,
        amount: tx.amount.toString(),
        createdAt: tx.createdAt.toISOString(),
    }));

    return { user, tasks, transactions };
}

export default async function DashboardPage() {
    const data = await getData();

    if (!data?.user) return null;

    return <DashboardClient user={data.user} tasks={data.tasks} transactions={data.transactions} />;
}
