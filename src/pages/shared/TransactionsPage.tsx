import { useState, useEffect } from 'react';
import { Check, X, Clock, BookCopy, Search, Filter, AlertCircle } from 'lucide-react';
import { useStore } from '../../store';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Badge } from '../../components/UI/Table';
import { format, isPast, parseISO } from 'date-fns';
import { cn } from '../../utils/cn';
import { fetchTransactions, issueBook as issueBookService, returnBook as returnBookService, requestBook as requestBookService } from '../../services';

interface TransactionsPageProps {
  canManage?: boolean;
}

export function TransactionsPage({ canManage = false }: TransactionsPageProps) {
  const { transactions, users, books, returnBook, approveRequest, currentUser, setTransactions } = useStore();
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load transactions from database
  useEffect(() => {
    const loadTransactions = async () => {
      setIsLoading(true);
      try {
        const result = await fetchTransactions();
        if (result.data && result.data.length > 0) {
          // Update store with real data from database (only when there are records)
          setTransactions(result.data);
        }
      } catch (error) {
        console.error('Error loading transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTransactions();
  }, [setTransactions]);

  // Filter transactions based on role
  const relevantTransactions = canManage 
    ? transactions 
    : transactions.filter(t => t.userId === currentUser?.id);

  const filteredTransactions = relevantTransactions.filter(t => {
    const matchesFilter = filter === 'all' || t.status === filter;
    const book = books.find(b => b.id === t.bookId);
    const user = users.find(u => u.id === t.userId);
    const matchesSearch = 
      book?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user?.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const pendingRequests = filteredTransactions.filter(t => t.status === 'requested');
  const activeIssues = filteredTransactions.filter(t => t.status === 'issued');
  const overdueBooks = activeIssues.filter(t => isPast(parseISO(t.dueDate)));

  const getStatusBadge = (status: string, dueDate: string) => {
    if (status === 'issued' && isPast(parseISO(dueDate))) {
      return <Badge variant="danger">Overdue</Badge>;
    }
    switch (status) {
      case 'issued': return <Badge variant="warning">Issued</Badge>;
      case 'returned': return <Badge variant="success">Returned</Badge>;
      case 'requested': return <Badge variant="info">Pending</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const handleReturn = async (transactionId: string) => {
    if (confirm('Confirm book return?')) {
      try {
        const result = await returnBookService(transactionId);
        if (result.error) {
          setMessage({ type: 'error', text: result.error });
        } else {
          returnBook(transactionId);
          // Reload transactions to sync with database
          const transactionsResult = await fetchTransactions();
          if (transactionsResult.data) {
            setTransactions(transactionsResult.data);
          }
          setMessage({ type: 'success', text: 'Book returned successfully!' });
        }
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to return book' });
        console.error('Error returning book:', error);
      }
    }
  };

  const handleApprove = async (transactionId: string) => {
    try {
      // Get the transaction to find the book
      const transaction = transactions.find(t => t.id === transactionId);
      if (!transaction) return;

      // Issue the book
      const result = await issueBookService(transaction.userId, transaction.bookId);
      if (result.error) {
        setMessage({ type: 'error', text: result.error });
      } else {
        approveRequest(transactionId);
        // Reload transactions to sync
        const transactionsResult = await fetchTransactions();
        if (transactionsResult.data) {
          setTransactions(transactionsResult.data);
        }
        setMessage({ type: 'success', text: 'Request approved! Book issued successfully.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to approve request' });
      console.error('Error approving request:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Message Display */}
      {message && (
        <Card className={cn(
          'p-4 rounded-lg',
          message.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200' : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
        )}>
          {message.text}
        </Card>
      )}
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {canManage ? 'Manage Transactions' : 'My Books'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            {canManage ? 'Issue, return, and manage book transactions' : 'View your borrowed books and requests'}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {canManage && (
          <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingRequests.length}</p>
                <p className="text-sm text-white/80">Pending Requests</p>
              </div>
            </div>
          </Card>
        )}
        <Card className={cn(!canManage && 'col-span-2')}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <BookCopy size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeIssues.length}</p>
              <p className="text-sm text-gray-500">Currently Issued</p>
            </div>
          </div>
        </Card>
        <Card className={cn(!canManage && 'col-span-2')}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <AlertCircle size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{overdueBooks.length}</p>
              <p className="text-sm text-gray-500">Overdue</p>
            </div>
          </div>
        </Card>
        {canManage && (
          <Card>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <Check size={20} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {filteredTransactions.filter(t => t.status === 'returned').length}
                </p>
                <p className="text-sm text-gray-500">Returned</p>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by book or user..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="requested">Pending Requests</option>
              <option value="issued">Issued</option>
              <option value="returned">Returned</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Pending Requests (for librarians) */}
      {canManage && pendingRequests.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Clock className="text-blue-500" size={20} />
            Pending Requests ({pendingRequests.length})
          </h3>
          <div className="space-y-3">
            {pendingRequests.map(transaction => {
              const book = books.find(b => b.id === transaction.bookId);
              const user = users.find(u => u.id === transaction.userId);
              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <BookCopy size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{book?.title}</p>
                      <p className="text-sm text-gray-500">Requested by {user?.name}</p>
                      <p className="text-xs text-gray-400">
                        {format(parseISO(transaction.issueDate), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" onClick={() => handleApprove(transaction.id)} icon={<Check size={14} />}>
                      Approve
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Transactions List */}
      <Card padding="none">
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {filteredTransactions.filter(t => t.status !== 'requested').length === 0 ? (
            <div className="text-center py-12">
              <BookCopy size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No transactions found</p>
            </div>
          ) : (
            filteredTransactions
              .filter(t => t.status !== 'requested')
              .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime())
              .map(transaction => {
                const book = books.find(b => b.id === transaction.bookId);
                const user = users.find(u => u.id === transaction.userId);
                const isOverdue = transaction.status === 'issued' && isPast(parseISO(transaction.dueDate));

                return (
                  <div
                    key={transaction.id}
                    className={cn(
                      'flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50',
                      isOverdue && 'bg-red-50 dark:bg-red-900/10'
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        'w-12 h-14 rounded-lg flex items-center justify-center bg-gradient-to-br',
                        isOverdue ? 'from-red-500 to-rose-600' : 'from-indigo-500 to-purple-600'
                      )}>
                        <BookCopy size={20} className="text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900 dark:text-white">{book?.title}</p>
                          {getStatusBadge(transaction.status, transaction.dueDate)}
                        </div>
                        {canManage && (
                          <p className="text-sm text-gray-500">Borrowed by {user?.name}</p>
                        )}
                        <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                          <span>Issued: {format(parseISO(transaction.issueDate), 'MMM d, yyyy')}</span>
                          <span>•</span>
                          <span className={isOverdue ? 'text-red-500 font-medium' : ''}>
                            Due: {format(parseISO(transaction.dueDate), 'MMM d, yyyy')}
                          </span>
                          {transaction.returnDate && (
                            <>
                              <span>•</span>
                              <span>Returned: {format(parseISO(transaction.returnDate), 'MMM d, yyyy')}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    {transaction.status === 'issued' && canManage && (
                      <Button 
                        size="sm" 
                        variant="secondary"
                        onClick={() => handleReturn(transaction.id)}
                        icon={<X size={14} />}
                      >
                        Return
                      </Button>
                    )}
                  </div>
                );
              })
          )}
        </div>
      </Card>
    </div>
  );
}
