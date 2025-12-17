
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySession } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session')?.value;
    const session = await verifySession(sessionToken);

    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, status } = await request.json();

    if (!['APPROVED', 'REJECTED'].includes(status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    try {
        const withdrawal = await prisma.withdrawalRequest.findUnique({
            where: { id },
            include: { user: true }
        });

        if (!withdrawal) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        if (withdrawal.status !== 'PENDING') return NextResponse.json({ error: 'Already processed' }, { status: 400 });

        await prisma.$transaction(async (tx) => {
            // Update withdrawal status
            await tx.withdrawalRequest.update({
                where: { id },
                data: { status }
            });

            // Update transaction status
            // We need to find the transaction linked to this withdrawal. 
            // In our current schema they aren't directly linked by FK, but by time/user/type.
            // Ideally we would add transactionId to withdrawalRequest. 
            // For now, let's just find the pending transaction for this user/amount.
            const txRecord = await tx.transaction.findFirst({
                where: {
                    userId: withdrawal.userId,
                    type: 'WITHDRAW',
                    status: 'PENDING',
                    amount: withdrawal.amount
                    // In a real high-concurrency app, passing ID is safer.
                }
            });

            if (txRecord) {
                if (status === 'REJECTED') {
                    // Refund the user
                    await tx.user.update({
                        where: { id: withdrawal.userId },
                        data: { balance: { increment: withdrawal.amount } }
                    });

                    await tx.transaction.update({
                        where: { id: txRecord.id },
                        data: { status: 'FAILED', description: 'Withdrawal Rejected - Refunded' }
                    });
                } else {
                    await tx.transaction.update({
                        where: { id: txRecord.id },
                        data: { status: 'COMPLETED' }
                    });
                }
            }
        });

        return NextResponse.json({ success: true });

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
