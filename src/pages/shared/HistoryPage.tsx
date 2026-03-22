import { useState } from 'react';
import { History, BookOpen, Calendar, Filter, Download } from 'lucide-react';
import { useStore } from '../../store';
import { Card } from '../../components/UI/Card';
import { Badge } from '../../components/UI/Table';
import { format, parseISO } from 'date-fns';
import { cn } from '../../utils/cn';

export function HistoryPage() {
  const { currentUser, transactions, books, digitalResources } = useStore();
  const [filter, setFilter] = useState<'all' | 'books' | 'downloads'>('all');

  const myTransactions = transactions
    .filter(t => t.userId === currentUser?.id && t.status === 'returned')
    .sort((a, b) => new Date(b.returnDate || b.issueDate).getTime() - new Date(a.returnDate || a.issueDate).getTime());

  const bookColors = [
    'from-blue-500 to-indigo-600',
    'from-emerald-500 to-teal-600',
    'from-purple-500 to-violet-600',
    'from-amber-500 to-orange-600',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">History</h2>
          <p className="text-gray-500 dark:text-gray-400">View your borrowing and download history</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{myTransactions.length}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Books Returned</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-indigo-600">{transactions.filter(t => t.userId === currentUser?.id && t.status === 'issued').length}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Currently Borrowed</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-emerald-600">{digitalResources.length}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Resources Available</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-amber-600">{transactions.filter(t => t.userId === currentUser?.id).length}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Transactions</p>
        </Card>
      </div>

      {/* Filter */}
      <Card>
        <div className="flex items-center gap-4">
          <Filter size={18} className="text-gray-400" />
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'All' },
              { value: 'books', label: 'Books' },
              { value: 'downloads', label: 'Downloads' },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilter(opt.value as typeof filter)}
                className={cn(
                  'px-4 py-2 rounded-xl text-sm font-medium transition-colors',
                  filter === opt.value
                    ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* History Timeline */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <History size={20} className="text-indigo-600" />
          Borrowing History
        </h3>
        
        {myTransactions.length === 0 ? (
          <div className="text-center py-12">
            <History size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No history yet</p>
            <p className="text-sm text-gray-400">Start borrowing books to see your history here</p>
          </div>
        ) : (
          <div className="space-y-1">
            {myTransactions.map((transaction, index) => {
              const book = books.find(b => b.id === transaction.bookId);
              return (
                <div
                  key={transaction.id}
                  className={cn(
                    'relative pl-8 pb-6',
                    index !== myTransactions.length - 1 && 'border-l-2 border-gray-200 dark:border-gray-700 ml-3'
                  )}
                >
                  <div className={cn(
                    'absolute left-0 -translate-x-1/2 w-10 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br',
                    bookColors[index % bookColors.length]
                  )}>
                    <BookOpen size={18} className="text-white" />
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 ml-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">{book?.title}</h4>
                          <Badge variant="success">Returned</Badge>
                        </div>
                        <p className="text-sm text-gray-500">{book?.author}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                          <div className="flex items-center gap-1">
                            <Calendar size={12} />
                            <span>Issued: {format(parseISO(transaction.issueDate), 'MMM d, yyyy')}</span>
                          </div>
                          {transaction.returnDate && (
                            <div className="flex items-center gap-1">
                              <Calendar size={12} />
                              <span>Returned: {format(parseISO(transaction.returnDate), 'MMM d, yyyy')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Download History Placeholder */}
      {(filter === 'all' || filter === 'downloads') && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Download size={20} className="text-purple-600" />
            Download History
          </h3>
          <div className="text-center py-8">
            <Download size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-gray-500 dark:text-gray-400">Download tracking coming soon</p>
            <p className="text-sm text-gray-400 mt-1">Your resource downloads will be tracked here</p>
          </div>
        </Card>
      )}
    </div>
  );
}
