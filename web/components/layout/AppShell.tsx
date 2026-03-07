import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

// ─── AppShell ─────────────────────────────────────────────────────────────────
// Wraps every authenticated page.
// Desktop: sidebar left + main content right
// Mobile: top bar + content + bottom nav

export function AppShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-dvh w-full overflow-hidden bg-gray-50">
            {/* Desktop sidebar */}
            <Sidebar />

            {/* Main content area */}
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                {/* Mobile top bar */}
                <TopBar />

                {/* Page content */}
                <main className="flex-1 overflow-hidden">
                    {children}
                </main>

                {/* Mobile bottom nav is inside TopBar component */}
            </div>
        </div>
    );
}
