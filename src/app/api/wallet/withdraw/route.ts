
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySession } from '@/lib/auth';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session')?.value;
    const session = await verifySession(sessionToken);

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { amount, method } = await request.json();
        const withdrawAmount = parseFloat(amount);

        if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
            return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
        }

        if (!method) {
            return NextResponse.json({ error: 'Payment method required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { id: session.userId } });
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        if (withdrawAmount > parseFloat(user.balance.toString())) {
            return NextResponse.json({ error: 'Insufficient funds' }, { status: 400 });
        }

        // Atomic transaction
        await prisma.$transaction([
            prisma.user.update({
                where: { id: user.id },
                data: { balance: { decrement: withdrawAmount } }
            }),
            prisma.withdrawalRequest.create({
                data: {
                    userId: user.id,
                    amount: withdrawAmount,
                    method: method,
                    status: 'PENDING'
                }
            }),
            prisma.transaction.create({
                data: {
                    userId: user.id,
                    amount: withdrawAmount,
                    type: 'WITHDRAW',
                    status: 'PENDING',
                    description: `Withdrawal to ${method}`
                }
            })
        ]);

        return NextResponse.json({ success: true });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
