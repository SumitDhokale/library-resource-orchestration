import { Clock, User, BookOpen, FileText, Filter } from 'lucide-react';
import { useStore } from '../../store';
import { Card } from '../../components/UI/Card';
import { Badge } from '../../components/UI/Table';
import { format } from 'date-fns';
import { useState } from 'react';
import { cn } from '../../utils/cn';

export function ActivityLogs() {
  const { activityLogs, users } = useStore();
  const [filter, setFilter] = useState<string>('all');

  const getActionIcon = (action: string) => {
    if (action.includes('Book')) return <BookOpen size={16} />;
    if (action.includes('Resource')) return <FileText size={16} />;
    if (action.includes('User')) return <User size={16} />;
    return <Clock size={16} />;
  };

  const getActionColor = (action: string) => {
    if (action.includes('Issued')) return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';
    if (action.includes('Returned')) return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400';
    if (action.includes('Uploaded')) return 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400';
    if (action.includes('Deleted')) return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400';
    return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400';
  };

  const filteredLogs = filter === 'all' 
    ? activityLogs 
    : activityLogs.filter(log => log.action.toLowerCase().includes(filter));

  const filterOptions = [
    { value: 'all', label: 'All Activities' },
    { value: 'issued', label: 'Book Issues' },
    { value: 'returned', label: 'Book Returns' },
    { value: 'uploaded', label: 'Uploads' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Activity Logs</h2>
          <p className="text-gray-500 dark:text-gray-400">Monitor all system activities</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {filterOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{activityLogs.length}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Activities</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-blue-600">{activityLogs.filter(l => l.action.includes('Issued')).length}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Books Issued</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-emerald-600">{activityLogs.filter(l => l.action.includes('Returned')).length}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Books Returned</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-purple-600">{activityLogs.filter(l => l.action.includes('Uploaded')).length}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Uploads</p>
        </Card>
      </div>

      {/* Activity Timeline */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Activity Timeline</h3>
        <div className="space-y-1">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12">
              <Clock size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No activities found</p>
            </div>
          ) : (
            filteredLogs.map((log, index) => {
              const user = users.find(u => u.id === log.userId);
              return (
                <div
                  key={log.id}
                  className={cn(
                    'relative pl-8 pb-6',
                    index !== filteredLogs.length - 1 && 'border-l-2 border-gray-200 dark:border-gray-700 ml-3'
                  )}
                >
                  <div className={cn(
                    'absolute left-0 -translate-x-1/2 p-2 rounded-full',
                    getActionColor(log.action)
                  )}>
                    {getActionIcon(log.action)}
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 ml-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="info">{log.action}</Badge>
                          <span className="text-xs text-gray-400">
                            {format(new Date(log.timestamp), 'MMM d, yyyy h:mm a')}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{log.details}</p>
                        <p className="text-sm text-gray-500 mt-1">by {user?.name || 'Unknown User'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
}
