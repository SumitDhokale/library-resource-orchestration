export type UserRole = 'admin' | 'librarian' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  avatar?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  isbn: string;
  description: string;
  coverImage?: string;
  availabilityStatus: 'available' | 'issued' | 'reserved';
  totalCopies: number;
  availableCopies: number;
  addedBy: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  bookId: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'issued' | 'returned' | 'overdue' | 'requested';
  fine?: number;
}

export interface DigitalResource {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  fileType: string;
  fileSize: string;
  category: string;
  uploadedBy: string;
  createdAt: string;
  downloads: number;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: string;
}
