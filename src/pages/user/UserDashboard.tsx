import { BookOpen, BookCopy, FileText, Clock, Download, ArrowRight } from 'lucide-react';
import { useStore } from '../../store';
import { Card, StatCard } from '../../components/UI/Card';
import { Badge } from '../../components/UI/Table';
import { Button } from '../../components/UI/Button';
import { format, parseISO, isPast, differenceInDays } from 'date-fns';
import { cn } from '../../utils/cn';

interface UserDashboardProps {
  onPageChange: (page: string) => void;
}

export function UserDashboard({ onPageChange }: UserDashboardProps) {
  const { currentUser, books, transactions, digitalResources } = useStore();

  const myTransactions = transactions.filter(t => t.userId === currentUser?.id);
  const currentlyBorrowed = myTransactions.filter(t => t.status === 'issued');
  const pendingRequests = myTransactions.filter(t => t.status === 'requested');
  const overdueBooks = currentlyBorrowed.filter(t => isPast(parseISO(t.dueDate)));
  const totalBorrowed = myTransactions.filter(t => t.status === 'returned' || t.status === 'issued').length;

  const recentBooks = books.slice(0, 4);
  const popularResources = [...digitalResources].sort((a, b) => b.downloads - a.downloads).slice(0, 3);

  const bookColors = [
    'from-blue-500 to-indigo-600',
    'from-emerald-500 to-teal-600',
    'from-purple-500 to-violet-600',
    'from-amber-500 to-orange-600',
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <Card className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome back, {currentUser?.name}!</h2>
            <p className="text-white/80">Discover new books and manage your library resources.</p>
          </div>
          <div className="hidden md:block">
            <BookOpen size={64} className="text-white/30" />
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Currently Borrowed"
          value={currentlyBorrowed.length}
          icon={<BookCopy size={24} />}
          color="blue"
        />
        <StatCard
          title="Total Borrowed"
          value={totalBorrowed}
          icon={<BookOpen size={24} />}
          color="green"
        />
        <StatCard
          title="Pending Requests"
          value={pendingRequests.length}
          icon={<Clock size={24} />}
          color="amber"
        />
        <StatCard
          title="Available Books"
          value={books.filter(b => b.availableCopies > 0).length}
          icon={<BookOpen size={24} />}
          color="purple"
        />
      </div>

      {/* Alerts */}
      {overdueBooks.length > 0 && (
        <Card className="border-l-4 border-l-red-500 bg-red-50 dark:bg-red-900/20">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
              <Clock className="text-red-600" size={24} />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-red-800 dark:text-red-400">
                You have {overdueBooks.length} overdue book{overdueBooks.length > 1 ? 's' : ''}!
              </h4>
              <p className="text-sm text-red-600 dark:text-red-400/80 mt-1">
                Please return them as soon as possible to avoid fines.
              </p>
            </div>
            <Button variant="danger" size="sm" onClick={() => onPageChange('mybooks')}>
              View Details
            </Button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Books */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">My Borrowed Books</h3>
            <Button size="sm" variant="ghost" onClick={() => onPageChange('mybooks')}>
              View All <ArrowRight size={14} />
            </Button>
          </div>
          {currentlyBorrowed.length === 0 ? (
            <div className="text-center py-8">
              <BookCopy size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No books borrowed yet</p>
              <Button size="sm" className="mt-4" onClick={() => onPageChange('books')}>
                Browse Books
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {currentlyBorrowed.map((transaction, index) => {
                const book = books.find(b => b.id === transaction.bookId);
                const daysLeft = differenceInDays(parseISO(transaction.dueDate), new Date());
                const isOverdue = daysLeft < 0;

                return (
                  <div
                    key={transaction.id}
                    className={cn(
                      'flex items-center gap-4 p-3 rounded-xl',
                      isOverdue ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-50 dark:bg-gray-800'
                    )}
                  >
                    <div className={cn(
                      'w-12 h-14 rounded-lg flex items-center justify-center bg-gradient-to-br',
                      bookColors[index % bookColors.length]
                    )}>
                      <BookOpen size={20} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">{book?.title}</p>
                      <p className="text-sm text-gray-500">{book?.author}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={cn(
                          'text-xs',
                          isOverdue ? 'text-red-600 font-medium' : 'text-gray-400'
                        )}>
                          {isOverdue 
                            ? `Overdue by ${Math.abs(daysLeft)} day${Math.abs(daysLeft) !== 1 ? 's' : ''}`
                            : `Due in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`}
                        </span>
                      </div>
                    </div>
                    <Badge variant={isOverdue ? 'danger' : 'warning'}>
                      {format(parseISO(transaction.dueDate), 'MMM d')}
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Pending Requests */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Pending Requests</h3>
          {pendingRequests.length === 0 ? (
            <div className="text-center py-8">
              <Clock size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No pending requests</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingRequests.map((transaction) => {
                const book = books.find(b => b.id === transaction.bookId);
                return (
                  <div
                    key={transaction.id}
                    className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl"
                  >
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Clock size={16} className="text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{book?.title}</p>
                      <p className="text-xs text-gray-500">Awaiting approval</p>
                    </div>
                    <Badge variant="info">Pending</Badge>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Browse Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* New Arrivals */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">New Arrivals</h3>
            <Button size="sm" variant="ghost" onClick={() => onPageChange('books')}>
              Browse All <ArrowRight size={14} />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {recentBooks.map((book, index) => (
              <div
                key={book.id}
                className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onPageChange('books')}
              >
                <div className={cn(
                  'h-20 rounded-lg mb-3 flex items-center justify-center bg-gradient-to-br',
                  bookColors[index % bookColors.length]
                )}>
                  <BookOpen size={24} className="text-white/80" />
                </div>
                <p className="font-medium text-gray-900 dark:text-white text-sm line-clamp-1">{book.title}</p>
                <p className="text-xs text-gray-500 line-clamp-1">{book.author}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Popular Resources */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Popular Resources</h3>
            <Button size="sm" variant="ghost" onClick={() => onPageChange('resources')}>
              View All <ArrowRight size={14} />
            </Button>
          </div>
          <div className="space-y-3">
            {popularResources.map((resource) => (
              <div
                key={resource.id}
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onPageChange('resources')}
              >
                <div className="p-2 bg-gradient-to-br from-red-500 to-rose-600 rounded-lg">
                  <FileText size={20} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white text-sm line-clamp-1">{resource.title}</p>
                  <p className="text-xs text-gray-500">{resource.category}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Download size={12} />
                  {resource.downloads}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
