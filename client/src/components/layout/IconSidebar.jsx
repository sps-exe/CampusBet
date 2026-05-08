import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Gamepad2, Trophy, TrendingUp,
  Wallet, MessageCircle, Plus, Zap,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { getInitials } from '../../utils/formatters';

const NAV_ITEMS = [
  { to: '/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/lobbies',      icon: Gamepad2,        label: 'Lobbies'   },
  { to: '/tournaments',  icon: Trophy,          label: 'Tournaments'},
  { to: '/leaderboard',  icon: TrendingUp,      label: 'Leaderboard'},
  { to: '/wallet',       icon: Wallet,          label: 'Wallet'    },
  { to: '/profile',      icon: MessageCircle,   label: 'Profile'   },
];

export default function IconSidebar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="w-[68px] min-h-screen bg-wine-deepest flex flex-col items-center py-4 gap-2 border-r border-wine-card flex-shrink-0 relative">
      {/* Subtle crimson glow on left */}
      <div className="absolute inset-0 bg-sidebar-glow pointer-events-none" />

      {/* Logo */}
      <button
        onClick={() => navigate('/dashboard')}
        className="w-10 h-10 rounded-xl bg-gradient-to-br from-crimson to-credits flex items-center justify-center mb-3 shadow-glow-crimson-sm hover:shadow-glow-crimson transition-shadow duration-300 flex-shrink-0"
      >
        <Zap className="w-5 h-5 text-white" />
      </button>

      {/* Nav icons */}
      <nav className="flex flex-col items-center gap-1 flex-1">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            title={label}
            className={({ isActive }) =>
              `relative w-11 h-11 flex items-center justify-center rounded-xl transition-all duration-200 group
              ${isActive
                ? 'bg-crimson/20 text-crimson shadow-glow-crimson-sm'
                : 'text-white/30 hover:text-white/70 hover:bg-wine-elevated'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className="w-5 h-5" />
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-crimson rounded-r-full" />
                )}
                {/* Tooltip */}
                <span className="absolute left-full ml-3 px-2 py-1 bg-wine-card text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 border border-wine-elevated transition-opacity">
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Create button */}
      <button
        onClick={() => navigate('/lobbies/create')}
        title="Create Lobby"
        className="w-10 h-10 rounded-xl border border-dashed border-crimson/50 flex items-center justify-center text-crimson hover:bg-crimson hover:text-white hover:border-crimson transition-all duration-200 mb-2"
      >
        <Plus className="w-4 h-4" />
      </button>

      {/* User avatar */}
      <button
        onClick={() => navigate('/profile')}
        title="My Profile"
        className="w-9 h-9 rounded-full bg-gradient-to-br from-crimson to-credits flex items-center justify-center text-white text-xs font-bold border-2 border-wine-elevated hover:border-crimson transition-colors"
      >
        {getInitials(user?.name || '?')}
      </button>
    </aside>
  );
}
