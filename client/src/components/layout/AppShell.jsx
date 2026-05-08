import useAuthStore from '../../store/authStore';
import IconSidebar from './IconSidebar';
import FriendsPanel from './FriendsPanel';

/**
 * AppShell — The 4-panel gaming launcher layout
 * [IconSidebar 68px] [Main Content flex-1] [Right Panel] [Friends Panel 68px]
 *
 * FriendsPanel is only mounted when a user is authenticated so that
 * usePresence never tries to open a Realtime channel without a user._id.
 *
 * Usage:
 *   <AppShell rightPanel={<MyRightPanel />}>
 *     <MyMainContent />
 *   </AppShell>
 */
export default function AppShell({ children, rightPanel }) {
  // Read directly from the store (not a hook) to keep AppShell a pure layout
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-wine-main">
      {/* LEFT: Icon Sidebar */}
      <IconSidebar />

      {/* CENTER: Main content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-wine-panel min-w-0">
        {children}
      </main>

      {/* RIGHT: Optional stats/info panel */}
      {rightPanel && (
        <aside className="w-72 flex-shrink-0 bg-wine-card border-l border-wine-elevated flex flex-col overflow-y-auto">
          {rightPanel}
        </aside>
      )}

      {/* FAR RIGHT: Friends panel — only mount when logged in */}
      {isAuthenticated && <FriendsPanel />}
    </div>
  );
}
