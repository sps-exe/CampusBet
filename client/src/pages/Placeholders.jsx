/**
 * Placeholder page — Dev 2 will implement this.
 * Used as a stub for all protected routes that Dev 2 owns.
 */

import { Link } from 'react-router';
import { Construction } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

/**
 * @param {{ title: string, description?: string }} props
 */
const PlaceholderPage = ({ title, description }) => (
  <div style={{ minHeight: '100vh', background: 'var(--color-background)', display: 'flex', flexDirection: 'column' }}>
    <Navbar />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', textAlign: 'center' }}>
      <Construction size={48} color="var(--color-primary)" style={{ marginBottom: 24, opacity: 0.8 }} />
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 800, marginBottom: 12 }}>{title}</h1>
      <p style={{ fontSize: 15, color: 'var(--color-text-secondary)', maxWidth: 400, lineHeight: 1.7, marginBottom: 28 }}>
        {description || 'This page is being built by Dev 2. Check back soon!'}
      </p>
      <Link to="/dashboard" style={{ color: 'var(--color-primary)', fontSize: 14 }}>← Back to Dashboard</Link>
    </div>
    <Footer />
  </div>
);

export const Dashboard          = () => <PlaceholderPage title="Dashboard"          description="Your personalized player dashboard. Stats, upcoming matches, and activity feed — built by Dev 2." />;
export const BrowseTournaments  = () => <PlaceholderPage title="Browse Tournaments" description="Discover and filter tournaments by game, status, and college. Built by Dev 2." />;
export const TournamentDetail   = () => <PlaceholderPage title="Tournament Details" description="Full tournament info, bracket view, and participant list. Built by Dev 2." />;
export const CreateTournament   = () => <PlaceholderPage title="Create Tournament"  description="Multi-step tournament creation form. Built by Dev 2." />;
export const HostDashboard      = () => <PlaceholderPage title="Host Dashboard"     description="Manage your tournaments, advance brackets, and view stats. Built by Dev 2." />;
export const Leaderboard        = () => <PlaceholderPage title="Leaderboard"        description="Campus-wide rankings across all games and time periods. Built by Dev 2." />;
export const Profile            = () => <PlaceholderPage title="My Profile"         description="Your gaming profile, stats, badges, and match history. Built by Dev 2." />;
