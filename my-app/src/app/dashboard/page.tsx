import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { TodoList } from "@/components/TodoList";
import { TodoForm } from "@/components/TodoForm";

// Server Components can:
// ✓ await database calls directly (no API round-trip needed)
// ✓ read session with auth() — no client-side hook needed
// ✓ pass data as props to Client Components
// ✗ use useState, useEffect, event listeners

export default async function DashboardPages() {
    const session = await auth();
    if (!session?.user?.id) redirect(/login);
    // Direct DB call — no fetch(), no API route, no loading state needed
    const todos = await prisma.todo.findMany({
        where: { user.Id: session.user.id },
        orderBy: { createdAt: "desc" };

    });
    return (
        <main className="max-w-xl mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold">My tasks</h1>
                    <p className="text-sm text-muted-foreground">{session.user.email}</p>
                </div>
                <LogoutButton />//{/* LogoutButton must be a Client Component (needs onClick) */}


            </div>
            {/* TodoForm is a Client Component — needs user interaction */}
            <TodoForm />
            {/* TodoList can be Server or Client depending on interactivity */}
            <TodoList todos={todos} />

        </main>
    )
}