import { BookOpen, BookCopy, FileText, Clock, TrendingUp, Users, AlertCircle } from 'lucide-react';
import { useStore } from '../../store';
import { Card, StatCard } from '../../components/UI/Card';
import { Badge } from '../../components/UI/Table';
import { Button } from '../../components/UI/Button';
import { format, parseISO, isPast } from 'date-fns';

interface LibrarianDashboardProps {
  onPageChange: (page: string) => void;
}

export function LibrarianDashboard({ onPageChange }: LibrarianDashboardProps) {
  const { books, transactions, digitalResources, users, activityLogs, approveRequest } = useStore();

  const totalBooks = books.length;
  const issuedBooks = transactions.filter(t => t.status === 'issued').length;
  const pendingRequests = transactions.filter(t => t.status === 'requested');
  const overdueBooks = transactions.filter(t => t.status === 'issued' && isPast(parseISO(t.dueDate)));
  const totalResources = digitalResources.length;

  const recentActivities = activityLogs.slice(0, 4);

  const handleApproveRequest = (transactionId: string) => {
    approveRequest(transactionId);
    alert('Request approved!');
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <Card className="bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome, Librarian!</h2>
            <p className="text-white/80">Manage books, resources, and transactions efficiently.</p>
          </div>
          <div className="hidden md:block">
            <BookOpen size={64} className="text-white/30" />
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Books"
          value={totalBooks}
          icon={<BookOpen size={24} />}
          color="blue"
        />
        <StatCard
          title="Books Issued"
          value={issuedBooks}
          icon={<BookCopy size={24} />}
          color="amber"
        />
        <StatCard
          title="Pending Requests"
          value={pendingRequests.length}
          icon={<Clock size={24} />}
          color="purple"
        />
        <StatCard
          title="Digital Resources"
          value={totalResources}
          icon={<FileText size={24} />}
          color="green"
        />
      </div>

      {/* Alerts */}
      {(pendingRequests.length > 0 || overdueBooks.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pendingRequests.length > 0 && (
            <Card className="border-l-4 border-l-blue-500">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Clock className="text-blue-600" size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {pendingRequests.length} Pending Request{pendingRequests.length > 1 ? 's' : ''}
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">
                    New book requests waiting for your approval
                  </p>
                  <Button size="sm" className="mt-3" onClick={() => onPageChange('transactions')}>
                    View Requests
                  </Button>
                </div>
              </div>
            </Card>
          )}
          
          {overdueBooks.length > 0 && (
            <Card className="border-l-4 border-l-red-500">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <AlertCircle className="text-red-600" size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {overdueBooks.length} Overdue Book{overdueBooks.length > 1 ? 's' : ''}
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">
                    Books that need to be returned
                  </p>
                  <Button size="sm" variant="danger" className="mt-3" onClick={() => onPageChange('transactions')}>
                    View Overdue
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Requests */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Requests</h3>
            <Badge variant="info">{pendingRequests.length} pending</Badge>
          </div>
          {pendingRequests.length === 0 ? (
            <div className="text-center py-8">
              <Clock size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No pending requests</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingRequests.slice(0, 3).map(transaction => {
                const book = books.find(b => b.id === transaction.bookId);
                const user = users.find(u => u.id === transaction.userId);
                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <BookOpen size={16} className="text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">{book?.title}</p>
                        <p className="text-xs text-gray-500">{user?.name}</p>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => handleApproveRequest(transaction.id)}>
                      Approve
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Quick Stats */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <TrendingUp size={18} className="text-emerald-600" />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Available Books</span>
              </div>
              <span className="font-bold text-gray-900 dark:text-white">
                {books.reduce((acc, b) => acc + b.availableCopies, 0)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Users size={18} className="text-blue-600" />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Active Users</span>
              </div>
              <span className="font-bold text-gray-900 dark:text-white">
                {users.filter(u => u.role === 'user').length}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <FileText size={18} className="text-purple-600" />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Downloads</span>
              </div>
              <span className="font-bold text-gray-900 dark:text-white">
                {digitalResources.reduce((acc, r) => acc + r.downloads, 0)}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
        </div>
        <div className="space-y-3">
          {recentActivities.map((activity) => {
            const user = users.find(u => u.id === activity.userId);
            return (
              <div key={activity.id} className="flex items-start gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl transition-colors">
                <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                  <Clock size={16} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.action}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{activity.details}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400">{user?.name}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-400">
                      {format(new Date(activity.timestamp), 'MMM d, h:mm a')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
