import { useState, useEffect } from 'react';
import { useStore } from './store';
import { LoginPage } from './pages/Login';
import { Layout } from './components/Layout/Layout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ManageUsers } from './pages/admin/ManageUsers';
import { ActivityLogs } from './pages/admin/ActivityLogs';
import { LibrarianDashboard } from './pages/librarian/LibrarianDashboard';
import { UserDashboard } from './pages/user/UserDashboard';
import { BooksPage } from './pages/shared/BooksPage';
import { TransactionsPage } from './pages/shared/TransactionsPage';
import { DigitalResourcesPage } from './pages/shared/DigitalResourcesPage';
import { SettingsPage } from './pages/shared/SettingsPage';
import { HistoryPage } from './pages/shared/HistoryPage';

export default function App() {
  const { isAuthenticated, currentUser, theme } = useStore();
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Apply theme to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Reset to dashboard on login
  useEffect(() => {
    if (isAuthenticated) {
      setCurrentPage('dashboard');
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const getPageTitle = () => {
    switch (currentPage) {
      case 'dashboard': return 'Dashboard';
      case 'users': return 'Manage Users';
      case 'books': return currentUser?.role === 'user' ? 'Browse Books' : 'Manage Books';
      case 'resources': return 'Digital Resources';
      case 'transactions': return currentUser?.role === 'user' ? 'My Books' : 'Manage Transactions';
      case 'mybooks': return 'My Books';
      case 'history': return 'History';
      case 'activity': return 'Activity Logs';
      case 'settings': return 'Settings';
      default: return 'Dashboard';
    }
  };

  const renderPage = () => {
    // Admin Pages
    if (currentUser?.role === 'admin') {
      switch (currentPage) {
        case 'dashboard':
          return <AdminDashboard />;
        case 'users':
          return <ManageUsers />;
        case 'books':
          return <BooksPage canEdit />;
        case 'transactions':
          return <TransactionsPage canManage />;
        case 'activity':
          return <ActivityLogs />;
        case 'settings':
          return <SettingsPage />;
        default:
          return <AdminDashboard />;
      }
    }

    // Librarian Pages
    if (currentUser?.role === 'librarian') {
      switch (currentPage) {
        case 'dashboard':
          return <LibrarianDashboard onPageChange={setCurrentPage} />;
        case 'books':
          return <BooksPage canEdit />;
        case 'resources':
          return <DigitalResourcesPage canManage />;
        case 'transactions':
          return <TransactionsPage canManage />;
        case 'history':
          return <HistoryPage />;
        default:
          return <LibrarianDashboard onPageChange={setCurrentPage} />;
      }
    }

    // User Pages
    switch (currentPage) {
      case 'dashboard':
        return <UserDashboard onPageChange={setCurrentPage} />;
      case 'books':
        return <BooksPage />;
      case 'resources':
        return <DigitalResourcesPage />;
      case 'mybooks':
        return <TransactionsPage />;
      case 'history':
        return <HistoryPage />;
      default:
        return <UserDashboard onPageChange={setCurrentPage} />;
    }
  };

  return (
  <Layout
  title={getPageTitle()}
  currentPage={currentPage}
  onPageChange={setCurrentPage}
  >
    {renderPage()}
  </Layout>
  );
}
