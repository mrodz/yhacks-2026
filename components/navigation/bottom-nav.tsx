'use client';

import { useApp } from '@/lib/app-context';
import { AppScreen } from '@/lib/types';
import { Home, FileText, Scan, HelpCircle, User } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems: { id: AppScreen; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'scan-choice', label: 'Scan', icon: Scan },
  { id: 'help', label: 'Help', icon: HelpCircle },
  { id: 'profile', label: 'Profile', icon: User },
];

export function BottomNav() {
  const { currentScreen, setCurrentScreen } = useApp();
  
  const isActive = (id: AppScreen) => {
    if (id === 'home' && currentScreen === 'home') return true;
    if (id === 'documents' && currentScreen === 'documents') return true;
    if (id === 'scan-choice' && ['scan-choice', 'scan-camera', 'scan-review', 'upload', 'processing'].includes(currentScreen)) return true;
    if (id === 'help' && currentScreen === 'help') return true;
    if (id === 'profile' && currentScreen === 'profile') return true;
    return false;
  };
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-area-bottom z-50">
      <div className="max-w-md mx-auto flex items-center justify-around py-2 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.id);
          
          return (
            <button
              key={item.id}
              onClick={() => setCurrentScreen(item.id)}
              className="relative flex flex-col items-center gap-1 py-2 px-3 min-w-[60px]"
            >
              {item.id === 'scan-choice' ? (
                <div className="absolute -top-6 w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg">
                  <Icon className="w-6 h-6 text-primary-foreground" />
                </div>
              ) : (
                <div className={`transition-colors ${active ? 'text-primary' : 'text-muted-foreground'}`}>
                  <Icon className="w-6 h-6" />
                </div>
              )}
              <span className={`text-xs font-medium transition-colors ${
                item.id === 'scan-choice' ? 'mt-6' : ''
              } ${active ? 'text-primary' : 'text-muted-foreground'}`}>
                {item.label}
              </span>
              {active && item.id !== 'scan-choice' && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -bottom-2 w-1 h-1 rounded-full bg-primary"
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
