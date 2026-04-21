import React, { useContext, useMemo, useState } from 'react';
import { signOut } from 'firebase/auth';
import { FirebaseContext } from '../context/FirebaseContext';
import { PAGES } from '../utils/constants';

const navItems = [
  { page: PAGES.HOME, name: 'Home', icon: 'home', tone: 'blue' },
  { page: PAGES.JOURNAL, name: 'Journal', icon: 'book', tone: 'violet' },
  { page: PAGES.GOALS, name: 'Goals', icon: 'check', tone: 'green' },
  { page: PAGES.GAMES, name: 'Games', icon: 'game', tone: 'amber' },
  { page: PAGES.COMMUNITY, name: 'Community', icon: 'users', tone: 'rose' },
  { page: PAGES.CHAT, name: 'CalmBot', icon: 'chat', tone: 'cyan' },
];

function Icon({ type }) {
  switch (type) {
    case 'home':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 12L12 3l9 9" />
          <path d="M9 21V12h6v9" />
        </svg>
      );
    case 'book':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20" />
          <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5Z" />
        </svg>
      );
    case 'check':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      );
    case 'game':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 12h12" />
          <path d="M12 6v12" />
          <circle cx="17" cy="17" r="2" />
          <circle cx="7" cy="7" r="2" />
        </svg>
      );
    case 'users':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case 'chat':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Sidebar({ currentPage, setCurrentPage, setAuthPage }) {
  const [collapsed, setCollapsed] = useState(false);
  const { auth, user } = useContext(FirebaseContext);
  const isAuthenticated = useMemo(() => Boolean(user), [user]);

  const handleGetStarted = () => {
    if (!isAuthenticated) {
      setAuthPage?.('login');
      return;
    }

    setCurrentPage?.(PAGES.HOME);
  };

  const handleLogout = async () => {
    if (!auth) return;

    try {
      await signOut(auth);
      setCurrentPage?.(PAGES.HOME);
    } catch (error) {
      console.error('Failed to sign out', error);
    }
  };

  return (
    <aside className={`sidebar${collapsed ? ' sidebar--collapsed' : ''}`} aria-label="Primary navigation">
      <div className="sidebar__top">
        <div className="sidebar__brand-row">
          <button
            type="button"
            className="sidebar__brand"
            onClick={() => setCurrentPage?.(PAGES.HOME)}
            aria-label="Go to CalmSpace home"
          >
            <span className="sidebar__brand-mark">C</span>
            {!collapsed && (
              <span className="sidebar__brand-text">
                <span>CalmSpace</span>
                <small>Quiet menu</small>
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setCollapsed(prev => !prev)}
            className="sidebar__collapse"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? '>' : '<'}
          </button>
        </div>

        <nav className="sidebar__nav">
          {navItems.map(item => {
            const isActive = currentPage === item.page;

            return (
              <button
                type="button"
                key={item.page}
                onClick={() => setCurrentPage?.(item.page)}
                className={`sidebar__link${isActive ? ' sidebar__link--active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
                title={collapsed ? item.name : undefined}
              >
                <span className={`sidebar__icon sidebar__icon--${item.tone}`}>
                  <Icon type={item.icon} />
                </span>
                {!collapsed && <span className="sidebar__label">{item.name}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="sidebar__footer">
        <div className="sidebar__focus">
          <span className="sidebar__spark">+</span>
          {!collapsed && (
            <span>
              <strong>Focus mode</strong>
              <small>Shrink to stay calm.</small>
            </span>
          )}
        </div>

        <div className="sidebar__actions">
          {isAuthenticated && (
            <button type="button" onClick={handleLogout} className="sidebar__button sidebar__button--ghost">
              {collapsed ? 'Out' : 'Logout'}
            </button>
          )}
          <button type="button" onClick={handleGetStarted} className="sidebar__button sidebar__button--primary">
            {collapsed ? 'Go' : 'Get Started'}
          </button>
        </div>
      </div>
    </aside>
  );
}
