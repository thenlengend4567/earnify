
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

        // Fetch all active tasks
        // In a real app, we might filter tasks already completed by the user
        // For now, let's fetch all active tasks
        const tasks = await prisma.task.findMany({
            where: { active: true },
            orderBy: { createdAt: 'desc' },
        });

        // Check which ones user has completed
        const completed = await prisma.completedTask.findMany({
            where: { userId: session.userId },
            select: { taskId: true },
        });

        const completedIds = new Set(completed.map((c) => c.taskId));

        const tasksWithStatus = tasks.map((task) => ({
            ...task,
            completed: completedIds.has(task.id),
        }));

        return NextResponse.json({ tasks: tasksWithStatus });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ tasks: [] });
    }
}

export async function POST(request: Request) {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session')?.value;
    const session = await verifySession(sessionToken);

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { taskId } = await request.json();

    if (!taskId) {
        return NextResponse.json({ error: 'Task ID required' }, { status: 400 });
    }

    try {
        const task = await prisma.task.findUnique({ where: { id: taskId } });
        if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        if (!task.active) return NextResponse.json({ error: 'Task is inactive' }, { status: 400 });

        // Check if already completed (if we enforce one-time)
        // For this app, let's assume tasks can be done once per user for simplicity, or we check if done "today" for daily
        const alreadyDone = await prisma.completedTask.findFirst({
            where: { userId: session.userId, taskId: taskId }
        });

        if (alreadyDone) {
            return NextResponse.json({ error: 'Task already completed' }, { status: 400 });
        }

        // Transaction to update balance and record completion
        await prisma.$transaction([
            prisma.user.update({
                where: { id: session.userId },
                data: { balance: { increment: task.rewardAmount } }
            }),
            prisma.completedTask.create({
                data: { userId: session.userId, taskId: taskId }
            }),
            prisma.transaction.create({
                data: {
                    userId: session.userId,
                    amount: task.rewardAmount,
                    type: 'EARN',
                    description: `Completed task: ${task.title}`
                }
            })
        ]);

        return NextResponse.json({ success: true, reward: task.rewardAmount });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
