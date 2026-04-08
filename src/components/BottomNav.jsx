import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ClipboardList, BookOpen, RefreshCw, MoreHorizontal } from 'lucide-react';

const tabs = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/log', icon: ClipboardList, label: 'Log' },
  { path: '/protocol', icon: BookOpen, label: 'Protocol' },
  { path: '/cycles', icon: RefreshCw, label: 'Cycles' },
  { path: '/more', icon: MoreHorizontal, label: 'More' },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 safe-bottom z-50"
         style={{ backgroundColor: 'var(--bg-card)', borderTop: '1px solid var(--border)' }}>
      <div className="flex justify-around items-center h-16">
        {tabs.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path ||
                        (path !== '/' && location.pathname.startsWith(path));
          return (
            <Link key={path} to={path}
                  className="flex flex-col items-center gap-0.5 px-3 py-2 flex-1"
                  style={{ color: active ? 'var(--accent)' : 'var(--text-secondary)' }}>
              <Icon size={22} />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
