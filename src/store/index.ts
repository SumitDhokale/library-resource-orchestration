import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Book, Transaction, DigitalResource, Notification, ActivityLog } from '../types';

// Sample data
const sampleUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@library.com',
    password: 'admin123',
    role: 'admin',
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    name: 'Mrs. Anis Fatima',
    email: 'librarian@library.com',
    password: 'librarian123',
    role: 'librarian',
    createdAt: '2024-01-15',
  },
  {
    id: '3',
    name: 'Sumit Dhokale',
    email: 'sumit@student.com',
    password: 'user123',
    role: 'user',
    createdAt: '2024-02-01',
  },
  {
    id: '4',
    name: 'Rahul Sharma',
    email: 'rahul@student.com',
    password: 'user123',
    role: 'user',
    createdAt: '2024-02-15',
  },
];

const sampleBooks: Book[] = [
  {
    id: '1',
    title: 'Introduction to Algorithms',
    author: 'Thomas H. Cormen',
    category: 'Computer Science',
    isbn: '978-0262033848',
    description: 'A comprehensive textbook on algorithms covering a broad range of algorithms in depth.',
    availabilityStatus: 'available',
    totalCopies: 5,
    availableCopies: 3,
    addedBy: '2',
    createdAt: '2024-01-10',
  },
  {
    id: '2',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    category: 'Software Engineering',
    isbn: '978-0132350884',
    description: 'A handbook of agile software craftsmanship.',
    availabilityStatus: 'available',
    totalCopies: 3,
    availableCopies: 2,
    addedBy: '2',
    createdAt: '2024-01-15',
  },
  {
    id: '3',
    title: 'Design Patterns',
    author: 'Gang of Four',
    category: 'Software Engineering',
    isbn: '978-0201633610',
    description: 'Elements of Reusable Object-Oriented Software.',
    availabilityStatus: 'issued',
    totalCopies: 2,
    availableCopies: 0,
    addedBy: '2',
    createdAt: '2024-01-20',
  },
  {
    id: '4',
    title: 'Database System Concepts',
    author: 'Abraham Silberschatz',
    category: 'Database',
    isbn: '978-0073523323',
    description: 'Comprehensive coverage of database system concepts.',
    availabilityStatus: 'available',
    totalCopies: 4,
    availableCopies: 4,
    addedBy: '2',
    createdAt: '2024-02-01',
  },
  {
    id: '5',
    title: 'Computer Networks',
    author: 'Andrew S. Tanenbaum',
    category: 'Networking',
    isbn: '978-0132126953',
    description: 'A top-down approach to networking.',
    availabilityStatus: 'available',
    totalCopies: 3,
    availableCopies: 1,
    addedBy: '2',
    createdAt: '2024-02-10',
  },
  {
    id: '6',
    title: 'Operating System Concepts',
    author: 'Abraham Silberschatz',
    category: 'Operating Systems',
    isbn: '978-1118063330',
    description: 'Foundational concepts of operating systems.',
    availabilityStatus: 'available',
    totalCopies: 5,
    availableCopies: 5,
    addedBy: '2',
    createdAt: '2024-02-15',
  },
];

const sampleTransactions: Transaction[] = [
  {
    id: '1',
    userId: '3',
    bookId: '1',
    issueDate: '2024-03-01',
    dueDate: '2024-03-15',
    status: 'issued',
  },
  {
    id: '2',
    userId: '3',
    bookId: '2',
    issueDate: '2024-02-15',
    dueDate: '2024-03-01',
    returnDate: '2024-02-28',
    status: 'returned',
  },
  {
    id: '3',
    userId: '4',
    bookId: '3',
    issueDate: '2024-03-05',
    dueDate: '2024-03-19',
    status: 'issued',
  },
  {
    id: '4',
    userId: '4',
    bookId: '5',
    issueDate: '2024-02-20',
    dueDate: '2024-03-05',
    returnDate: '2024-03-03',
    status: 'returned',
  },
];

const sampleDigitalResources: DigitalResource[] = [
  {
    id: '1',
    title: 'Cloud Computing Fundamentals',
    description: 'An introduction to cloud computing concepts and architectures.',
    fileUrl: '/resources/cloud-computing.pdf',
    fileType: 'PDF',
    fileSize: '2.5 MB',
    category: 'Cloud Computing',
    uploadedBy: '2',
    createdAt: '2024-01-20',
    downloads: 45,
  },
  {
    id: '2',
    title: 'Machine Learning Research Paper',
    description: 'Latest advances in deep learning algorithms.',
    fileUrl: '/resources/ml-research.pdf',
    fileType: 'PDF',
    fileSize: '1.8 MB',
    category: 'Machine Learning',
    uploadedBy: '2',
    createdAt: '2024-02-01',
    downloads: 32,
  },
  {
    id: '3',
    title: 'Web Development Best Practices',
    description: 'Guide to modern web development techniques.',
    fileUrl: '/resources/webdev.pdf',
    fileType: 'PDF',
    fileSize: '3.2 MB',
    category: 'Web Development',
    uploadedBy: '2',
    createdAt: '2024-02-15',
    downloads: 67,
  },
];

const sampleActivityLogs: ActivityLog[] = [
  {
    id: '1',
    userId: '3',
    action: 'Book Issued',
    details: 'Introduction to Algorithms issued to Sumit Dhokale',
    timestamp: '2024-03-01T10:30:00',
  },
  {
    id: '2',
    userId: '4',
    action: 'Book Returned',
    details: 'Computer Networks returned by Rahul Sharma',
    timestamp: '2024-03-03T14:15:00',
  },
  {
    id: '3',
    userId: '2',
    action: 'Resource Uploaded',
    details: 'Cloud Computing Fundamentals PDF uploaded',
    timestamp: '2024-01-20T09:00:00',
  },
];

interface StoreState {
  // Auth
  currentUser: User | null;
  isAuthenticated: boolean;
  
  // Data
  users: User[];
  books: Book[];
  transactions: Transaction[];
  digitalResources: DigitalResource[];
  notifications: Notification[];
  activityLogs: ActivityLog[];
  
  // UI State
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  
  // Auth Actions
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (name: string, email: string, password: string) => boolean;
  
  // User Actions
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  
  // Book Actions
  addBook: (book: Omit<Book, 'id' | 'createdAt'>) => void;
  updateBook: (id: string, updates: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  
  // Transaction Actions
  issueBook: (userId: string, bookId: string) => boolean;
  returnBook: (transactionId: string) => void;
  requestBook: (userId: string, bookId: string) => void;
  approveRequest: (transactionId: string) => void;
  
  // Digital Resource Actions
  addDigitalResource: (resource: Omit<DigitalResource, 'id' | 'createdAt' | 'downloads'>) => void;
  updateDigitalResource: (id: string, updates: Partial<DigitalResource>) => void;
  deleteDigitalResource: (id: string) => void;
  incrementDownload: (id: string) => void;
  
  // Notification Actions
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markNotificationRead: (id: string) => void;
  
  // Activity Log Actions
  addActivityLog: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => void;
  
  // UI Actions
  toggleTheme: () => void;
  toggleSidebar: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Initial State
      currentUser: null,
      isAuthenticated: false,
      users: sampleUsers,
      books: sampleBooks,
      transactions: sampleTransactions,
      digitalResources: sampleDigitalResources,
      notifications: [],
      activityLogs: sampleActivityLogs,
      theme: 'light',
      sidebarOpen: true,
      
      // Auth Actions
      login: (email, password) => {
        const user = get().users.find(u => u.email === email && u.password === password);
        if (user) {
          set({ currentUser: user, isAuthenticated: true });
          return true;
        }
        return false;
      },
      
      logout: () => {
        set({ currentUser: null, isAuthenticated: false });
      },
      
      register: (name, email, password) => {
        const exists = get().users.find(u => u.email === email);
        if (exists) return false;
        
        const newUser: User = {
          id: Date.now().toString(),
          name,
          email,
          password,
          role: 'user',
          createdAt: new Date().toISOString().split('T')[0],
        };
        set(state => ({ users: [...state.users, newUser] }));
        return true;
      },
      
      // User Actions
      addUser: (user) => {
        const newUser: User = {
          ...user,
          id: Date.now().toString(),
          createdAt: new Date().toISOString().split('T')[0],
        };
        set(state => ({ users: [...state.users, newUser] }));
      },
      
      updateUser: (id, updates) => {
        set(state => ({
          users: state.users.map(u => u.id === id ? { ...u, ...updates } : u),
        }));
      },
      
      deleteUser: (id) => {
        set(state => ({
          users: state.users.filter(u => u.id !== id),
        }));
      },
      
      // Book Actions
      addBook: (book) => {
        const newBook: Book = {
          ...book,
          id: Date.now().toString(),
          createdAt: new Date().toISOString().split('T')[0],
        };
        set(state => ({ books: [...state.books, newBook] }));
      },
      
      updateBook: (id, updates) => {
        set(state => ({
          books: state.books.map(b => b.id === id ? { ...b, ...updates } : b),
        }));
      },
      
      deleteBook: (id) => {
        set(state => ({
          books: state.books.filter(b => b.id !== id),
        }));
      },
      
      // Transaction Actions
      issueBook: (userId, bookId) => {
        const book = get().books.find(b => b.id === bookId);
        if (!book || book.availableCopies <= 0) return false;
        
        const transaction: Transaction = {
          id: Date.now().toString(),
          userId,
          bookId,
          issueDate: new Date().toISOString().split('T')[0],
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'issued',
        };
        
        set(state => ({
          transactions: [...state.transactions, transaction],
          books: state.books.map(b => 
            b.id === bookId 
              ? { 
                  ...b, 
                  availableCopies: b.availableCopies - 1,
                  availabilityStatus: b.availableCopies - 1 === 0 ? 'issued' : 'available'
                }
              : b
          ),
        }));
        
        // Add activity log
        const user = get().users.find(u => u.id === userId);
        get().addActivityLog({
          userId,
          action: 'Book Issued',
          details: `${book.title} issued to ${user?.name}`,
        });
        
        return true;
      },
      
      returnBook: (transactionId) => {
        const transaction = get().transactions.find(t => t.id === transactionId);
        if (!transaction) return;
        
        const book = get().books.find(b => b.id === transaction.bookId);
        const user = get().users.find(u => u.id === transaction.userId);
        
        set(state => ({
          transactions: state.transactions.map(t => 
            t.id === transactionId 
              ? { ...t, returnDate: new Date().toISOString().split('T')[0], status: 'returned' as const }
              : t
          ),
          books: state.books.map(b => 
            b.id === transaction.bookId
              ? { 
                  ...b, 
                  availableCopies: b.availableCopies + 1,
                  availabilityStatus: 'available' as const
                }
              : b
          ),
        }));
        
        get().addActivityLog({
          userId: transaction.userId,
          action: 'Book Returned',
          details: `${book?.title} returned by ${user?.name}`,
        });
      },
      
      requestBook: (userId, bookId) => {
        const transaction: Transaction = {
          id: Date.now().toString(),
          userId,
          bookId,
          issueDate: new Date().toISOString().split('T')[0],
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'requested',
        };
        
        set(state => ({
          transactions: [...state.transactions, transaction],
        }));
      },
      
      approveRequest: (transactionId) => {
        const transaction = get().transactions.find(t => t.id === transactionId);
        if (!transaction) return;
        
        const book = get().books.find(b => b.id === transaction.bookId);
        if (!book || book.availableCopies <= 0) return;
        
        set(state => ({
          transactions: state.transactions.map(t => 
            t.id === transactionId 
              ? { ...t, status: 'issued' as const, issueDate: new Date().toISOString().split('T')[0] }
              : t
          ),
          books: state.books.map(b => 
            b.id === transaction.bookId
              ? { 
                  ...b, 
                  availableCopies: b.availableCopies - 1,
                  availabilityStatus: b.availableCopies - 1 === 0 ? 'issued' : 'available'
                }
              : b
          ),
        }));
      },
      
      // Digital Resource Actions
      addDigitalResource: (resource) => {
        const newResource: DigitalResource = {
          ...resource,
          id: Date.now().toString(),
          createdAt: new Date().toISOString().split('T')[0],
          downloads: 0,
        };
        set(state => ({ digitalResources: [...state.digitalResources, newResource] }));
      },
      
      updateDigitalResource: (id, updates) => {
        set(state => ({
          digitalResources: state.digitalResources.map(r => r.id === id ? { ...r, ...updates } : r),
        }));
      },
      
      deleteDigitalResource: (id) => {
        set(state => ({
          digitalResources: state.digitalResources.filter(r => r.id !== id),
        }));
      },
      
      incrementDownload: (id) => {
        set(state => ({
          digitalResources: state.digitalResources.map(r => 
            r.id === id ? { ...r, downloads: r.downloads + 1 } : r
          ),
        }));
      },
      
      // Notification Actions
      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        };
        set(state => ({ notifications: [...state.notifications, newNotification] }));
      },
      
      markNotificationRead: (id) => {
        set(state => ({
          notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n),
        }));
      },
      
      // Activity Log Actions
      addActivityLog: (log) => {
        const newLog: ActivityLog = {
          ...log,
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
        };
        set(state => ({ activityLogs: [newLog, ...state.activityLogs] }));
      },
      
      // UI Actions
      toggleTheme: () => {
        set(state => ({ theme: state.theme === 'light' ? 'dark' : 'light' }));
      },
      
      toggleSidebar: () => {
        set(state => ({ sidebarOpen: !state.sidebarOpen }));
      },
    }),
    {
      name: 'library-storage',
      partialize: (state) => ({
        users: state.users,
        books: state.books,
        transactions: state.transactions,
        digitalResources: state.digitalResources,
        activityLogs: state.activityLogs,
        theme: state.theme,
      }),
    }
  )
);
