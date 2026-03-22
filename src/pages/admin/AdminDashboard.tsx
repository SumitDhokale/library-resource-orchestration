import { BookOpen, Users, BookCopy, FileText, TrendingUp, Clock } from 'lucide-react';
import { useStore } from '../../store';
import { Card, StatCard } from '../../components/UI/Card';
import { Badge } from '../../components/UI/Table';
import { format } from 'date-fns';

export function AdminDashboard() {
  const { users, books, transactions, digitalResources, activityLogs } = useStore();

  const totalBooks = books.length;
  const issuedBooks = transactions.filter(t => t.status === 'issued').length;
  const totalUsers = users.filter(u => u.role === 'user').length;
  const totalResources = digitalResources.length;

  const recentActivities = activityLogs.slice(0, 5);

  const categoryStats = books.reduce((acc, book) => {
    acc[book.category] = (acc[book.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Books"
          value={totalBooks}
          icon={<BookOpen size={24} />}
          color="blue"
          trend={{ value: 12, positive: true }}
        />
        <StatCard
          title="Books Issued"
          value={issuedBooks}
          icon={<BookCopy size={24} />}
          color="amber"
          trend={{ value: 8, positive: true }}
        />
        <StatCard
          title="Active Users"
          value={totalUsers}
          icon={<Users size={24} />}
          color="green"
          trend={{ value: 5, positive: true }}
        />
        <StatCard
          title="Digital Resources"
          value={totalResources}
          icon={<FileText size={24} />}
          color="purple"
          trend={{ value: 15, positive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
            <Badge variant="info">Live</Badge>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => {
              const user = users.find(u => u.id === activity.userId);
              return (
                <div key={activity.id} className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                    <Clock size={18} className="text-indigo-600 dark:text-indigo-400" />
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

        {/* Category Distribution */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Books by Category</h3>
          <div className="space-y-4">
            {Object.entries(categoryStats).map(([category, count]) => {
              const percentage = (count / totalBooks) * 100;
              return (
                <div key={category}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{category}</span>
                    <span className="text-sm text-gray-500">{count}</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
              <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Books Available</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {books.reduce((acc, b) => acc + b.availableCopies, 0)}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-900/30">
              <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pending Returns</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {transactions.filter(t => t.status === 'issued').length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30">
              <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Staff</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {users.filter(u => u.role !== 'user').length}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
