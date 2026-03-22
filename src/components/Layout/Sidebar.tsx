import { 
  BookOpen, 
  LayoutDashboard, 
  FileText, 
  History, 
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Library,
  BookCopy,
  UserCog,
  Activity
} from 'lucide-react';
import { useStore } from '../../store';
import { cn } from '../../utils/cn';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const { currentUser, logout, sidebarOpen, toggleSidebar } = useStore();

  const adminLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Manage Users', icon: UserCog },
    { id: 'books', label: 'Books Catalog', icon: BookOpen },
    { id: 'transactions', label: 'Transactions', icon: BookCopy },
    { id: 'activity', label: 'Activity Logs', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const librarianLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'books', label: 'Manage Books', icon: BookOpen },
    { id: 'resources', label: 'Digital Resources', icon: FileText },
    { id: 'transactions', label: 'Issue/Return', icon: BookCopy },
    { id: 'history', label: 'History', icon: History },
  ];

  const userLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'books', label: 'Browse Books', icon: BookOpen },
    { id: 'resources', label: 'Digital Resources', icon: FileText },
    { id: 'mybooks', label: 'My Books', icon: BookCopy },
    { id: 'history', label: 'History', icon: History },
  ];

  const links = currentUser?.role === 'admin' 
    ? adminLinks 
    : currentUser?.role === 'librarian' 
      ? librarianLinks 
      : userLinks;

  const getRoleColor = () => {
    switch (currentUser?.role) {
      case 'admin': return 'from-red-500 to-rose-600';
      case 'librarian': return 'from-amber-500 to-orange-600';
      default: return 'from-emerald-500 to-teal-600';
    }
  };

  const getRoleBadge = () => {
    switch (currentUser?.role) {
      case 'admin': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'librarian': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      default: return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
    }
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out',
        'bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800',
        'flex flex-col',
        sidebarOpen ? 'w-64' : 'w-20'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className={cn('p-2 rounded-xl bg-gradient-to-br', getRoleColor())}>
            <Library className="h-6 w-6 text-white" />
          </div>
          {sidebarOpen && (
            <div className="flex flex-col">
              <span className="font-bold text-gray-900 dark:text-white text-sm">LibraryOS</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Cloud Platform</span>
            </div>
          )}
        </div>
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
        >
          {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      {/* User Info */}
      <div className={cn(
        'p-4 border-b border-gray-200 dark:border-gray-800',
        !sidebarOpen && 'flex justify-center'
      )}>
        <div className={cn('flex items-center gap-3', !sidebarOpen && 'justify-center')}>
          <div className={cn(
            'w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-semibold',
            getRoleColor()
          )}>
            {currentUser?.name.charAt(0).toUpperCase()}
          </div>
          {sidebarOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {currentUser?.name}
              </p>
              <span className={cn(
                'inline-flex text-xs px-2 py-0.5 rounded-full font-medium capitalize',
                getRoleBadge()
              )}>
                {currentUser?.role}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = currentPage === link.id;
          
          return (
            <button
              key={link.id}
              onClick={() => onPageChange(link.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
                'text-sm font-medium',
                isActive
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white',
                !sidebarOpen && 'justify-center px-2'
              )}
            >
              <Icon size={20} className={cn(isActive && 'text-white')} />
              {sidebarOpen && <span>{link.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={logout}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl',
            'text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20',
            'transition-colors duration-200',
            !sidebarOpen && 'justify-center px-2'
          )}
        >
          <LogOut size={20} />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
