import { useState, useMemo, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, BookOpen, Filter, Grid, List } from 'lucide-react';
import { useStore } from '../../store';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Modal } from '../../components/UI/Modal';
import { Input, Textarea } from '../../components/UI/Input';
import { Badge } from '../../components/UI/Table';
import type { Book } from '../../types';
import { cn } from '../../utils/cn';
import { fetchBooks, searchBooks, createBook, updateBook as updateBookService, deleteBook as deleteBookService } from '../../services';

interface BooksPageProps {
  canEdit?: boolean;
}

export function BooksPage({ canEdit = false }: BooksPageProps) {
  const { books, addBook, updateBook, deleteBook, currentUser, issueBook, requestBook, transactions, setBooks } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    isbn: '',
    description: '',
    totalCopies: 1,
  });

  // Load books from database
  useEffect(() => {
    const loadBooks = async () => {
      setIsLoading(true);
      try {
        const result = await fetchBooks();
        if (result.data) {
          // Update store with real data from database
          setBooks(result.data);
        }
      } catch (error) {
        console.error('Error loading books:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadBooks();
  }, [setBooks]);

  const categories = useMemo(() => {
    const cats = new Set(books.map(b => b.category));
    return ['all', ...Array.from(cats)];
  }, [books]);

  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const matchesSearch = 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.isbn.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || book.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [books, searchQuery, categoryFilter]);

  const handleOpenModal = (book?: Book) => {
    if (book) {
      setEditingBook(book);
      setFormData({
        title: book.title,
        author: book.author,
        category: book.category,
        isbn: book.isbn,
        description: book.description,
        totalCopies: book.totalCopies,
      });
    } else {
      setEditingBook(null);
      setFormData({ title: '', author: '', category: '', isbn: '', description: '', totalCopies: 1 });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      if (editingBook) {
        // Update existing book
        const result = await updateBookService(editingBook.id, {
          ...formData,
          availableCopies: editingBook.availableCopies + (formData.totalCopies - editingBook.totalCopies),
          availabilityStatus: (editingBook.availableCopies + (formData.totalCopies - editingBook.totalCopies)) === 0 ? 'issued' : 'available',
        });

        if (result.error) {
          setMessage({ type: 'error', text: result.error });
        } else {
          updateBook(editingBook.id, result.data!);
          setMessage({ type: 'success', text: 'Book updated successfully!' });
        }
      } else {
        // Create new book
        const result = await createBook({
          ...formData,
          availableCopies: formData.totalCopies,
          availabilityStatus: 'available',
          addedBy: currentUser?.id || '',
        });

        if (result.error) {
          setMessage({ type: 'error', text: result.error });
        } else {
          addBook(result.data!);
          setMessage({ type: 'success', text: 'Book created successfully!' });
        }
      }

      if (!message?.type || message.type === 'success') {
        setIsModalOpen(false);
        setEditingBook(null);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
      console.error('Error saving book:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this book?')) {
      try {
        const result = await deleteBookService(id);
        if (result.error) {
          setMessage({ type: 'error', text: result.error });
        } else {
          deleteBook(id);
          setMessage({ type: 'success', text: 'Book deleted successfully!' });
        }
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to delete book' });
        console.error('Error deleting book:', error);
      }
    }
  };

  const handleBorrowRequest = (bookId: string) => {
    if (!currentUser) return;
    
    // Check if user already has this book
    const existingTransaction = transactions.find(
      t => t.userId === currentUser.id && t.bookId === bookId && (t.status === 'issued' || t.status === 'requested')
    );
    
    if (existingTransaction) {
      alert('You already have this book or a pending request for it.');
      return;
    }
    
    if (currentUser.role === 'user') {
      requestBook(currentUser.id, bookId);
      alert('Book request submitted! A librarian will approve your request.');
    } else {
      issueBook(currentUser.id, bookId);
      alert('Book issued successfully!');
    }
  };

  const getStatusBadge = (book: Book) => {
    if (book.availableCopies === 0) {
      return <Badge variant="danger">Not Available</Badge>;
    }
    if (book.availableCopies < book.totalCopies) {
      return <Badge variant="warning">{book.availableCopies} Available</Badge>;
    }
    return <Badge variant="success">Available</Badge>;
  };

  const bookColors = [
    'from-blue-500 to-indigo-600',
    'from-emerald-500 to-teal-600',
    'from-purple-500 to-violet-600',
    'from-amber-500 to-orange-600',
    'from-rose-500 to-pink-600',
  ];

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
            {canEdit ? 'Manage Books' : 'Browse Books'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            {filteredBooks.length} books in catalog
          </p>
        </div>
        {canEdit && (
          <Button onClick={() => handleOpenModal()} icon={<Plus size={18} />}>
            Add Book
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, author, or ISBN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex gap-3">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex rounded-xl bg-gray-100 dark:bg-gray-800 p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  viewMode === 'grid' 
                    ? 'bg-white dark:bg-gray-700 shadow-sm text-indigo-600' 
                    : 'text-gray-500 hover:text-gray-700'
                )}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  viewMode === 'list' 
                    ? 'bg-white dark:bg-gray-700 shadow-sm text-indigo-600' 
                    : 'text-gray-500 hover:text-gray-700'
                )}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Books Grid/List */}
      {filteredBooks.length === 0 ? (
        <Card className="text-center py-12">
          <BookOpen size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No books found matching your criteria</p>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredBooks.map((book, index) => (
            <Card key={book.id} hover className="flex flex-col">
              <div className={cn(
                'h-32 rounded-xl mb-4 flex items-center justify-center bg-gradient-to-br',
                bookColors[index % bookColors.length]
              )}>
                <BookOpen size={48} className="text-white/80" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">{book.title}</h3>
                  {getStatusBadge(book)}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{book.author}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">{book.category} • {book.isbn}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">{book.description}</p>
              </div>
              <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                {canEdit ? (
                  <>
                    <Button size="sm" variant="ghost" onClick={() => handleOpenModal(book)}>
                      <Edit2 size={14} />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(book.id)}>
                      <Trash2 size={14} />
                    </Button>
                  </>
                ) : (
                  <Button 
                    size="sm" 
                    fullWidth 
                    disabled={book.availableCopies === 0}
                    onClick={() => handleBorrowRequest(book.id)}
                  >
                    {book.availableCopies === 0 ? 'Not Available' : 'Request Book'}
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card padding="none">
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredBooks.map((book, index) => (
              <div key={book.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <div className={cn(
                  'w-16 h-20 rounded-lg flex items-center justify-center bg-gradient-to-br flex-shrink-0',
                  bookColors[index % bookColors.length]
                )}>
                  <BookOpen size={24} className="text-white/80" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">{book.title}</h3>
                    {getStatusBadge(book)}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{book.author}</p>
                  <p className="text-xs text-gray-400">{book.category} • ISBN: {book.isbn}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {book.availableCopies}/{book.totalCopies}
                  </span>
                  {canEdit ? (
                    <>
                      <Button size="sm" variant="ghost" onClick={() => handleOpenModal(book)}>
                        <Edit2 size={14} />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(book.id)}>
                        <Trash2 size={14} />
                      </Button>
                    </>
                  ) : (
                    <Button 
                      size="sm" 
                      disabled={book.availableCopies === 0}
                      onClick={() => handleBorrowRequest(book.id)}
                    >
                      Request
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBook ? 'Edit Book' : 'Add New Book'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter book title"
              required
            />
            <Input
              label="Author"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              placeholder="Enter author name"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="e.g., Computer Science"
              required
            />
            <Input
              label="ISBN"
              value={formData.isbn}
              onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
              placeholder="Enter ISBN"
              required
            />
          </div>
          <Input
            label="Total Copies"
            type="number"
            min={1}
            value={formData.totalCopies}
            onChange={(e) => setFormData({ ...formData, totalCopies: parseInt(e.target.value) || 1 })}
            required
          />
          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter book description"
            rows={3}
          />
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} fullWidth disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" fullWidth disabled={isSaving}>
              {isSaving ? 'Saving...' : (editingBook ? 'Update Book' : 'Add Book')}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
