import { Bell, Search, Moon, Sun, Menu } from 'lucide-react';
import { useStore } from '../../store';
import { cn } from '../../utils/cn';
import { useState } from 'react';

interface HeaderProps {
  title: string;
  onSearch?: (query: string) => void;
}

export function Header({ title, onSearch }: HeaderProps) {
  const { theme, toggleTheme, sidebarOpen, toggleSidebar, notifications, currentUser } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  
  const unreadNotifications = notifications.filter(n => !n.read && n.userId === currentUser?.id).length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <header className={cn(
      'sticky top-0 z-30 h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl',
      'border-b border-gray-200 dark:border-gray-800',
      'flex items-center justify-between px-6',
      'transition-all duration-300',
      sidebarOpen ? 'ml-64' : 'ml-20'
    )}>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
        >
          <Menu size={20} className="text-gray-600 dark:text-gray-400" />
        </button>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        {onSearch && (
          <form onSubmit={handleSearch} className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                'w-64 pl-10 pr-4 py-2 rounded-xl',
                'bg-gray-100 dark:bg-gray-800 border-0',
                'text-sm text-gray-900 dark:text-white placeholder-gray-500',
                'focus:outline-none focus:ring-2 focus:ring-indigo-500'
              )}
            />
          </form>
        )}

        {/* Notifications */}
        <button className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <Bell size={20} className="text-gray-600 dark:text-gray-400" />
          {unreadNotifications > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {unreadNotifications}
            </span>
          )}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {theme === 'light' ? (
            <Moon size={20} className="text-gray-600" />
          ) : (
            <Sun size={20} className="text-gray-400" />
          )}
        </button>
      </div>
    </header>
  );
}
