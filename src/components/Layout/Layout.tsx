import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useStore } from '../../store';
import { cn } from '../../utils/cn';

interface LayoutProps {
  children: ReactNode;
  title: string;
  currentPage: string;
  onPageChange: (page: string) => void;
  onSearch?: (query: string) => void;
}

export function Layout({ children, title, currentPage, onPageChange, onSearch }: LayoutProps) {
  const { sidebarOpen, theme } = useStore();

  return (
    <div className={cn('min-h-screen', theme === 'dark' && 'dark')}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Sidebar currentPage={currentPage} onPageChange={onPageChange} />
        <div className={cn('transition-all duration-300', sidebarOpen ? 'ml-64' : 'ml-20')}>
          <Header title={title} onSearch={onSearch} />
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
