
import { Navbar } from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { verifySession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function getUser() {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;
    const session = await verifySession(sessionToken);

    if (!session) return null;

    const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { name: true, role: true },
    });

    return user;
}

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-[var(--background)] flex">
            {/* Sidebar */}
            <Sidebar user={user} />

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8 overflow-y-auto h-screen">
                {/* Top Header */}
                <header className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold">Dashboard</h2>
                    <div className="flex items-center gap-4">
                        {/* Search / Notifications could go here */}
                        <button className="p-2 rounded-full hover:bg-[var(--secondary)]">
                            <span className="sr-only">Notifications</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                        </button>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 overflow-hidden">
                            {/* Avatar Placeholder */}
                        </div>
                    </div>
                </header>

                {children}
            </main>
        </div>
    );
}
