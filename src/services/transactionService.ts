import { supabase } from '../supabaseClient';
import type { Transaction } from '../types';

/**
 * Transaction Service - Handle all transaction-related database operations
 */

// Fetch all transactions
export async function fetchTransactions(): Promise<{ data: Transaction[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('issue_date', { ascending: false });

    if (error) {
      console.error('Error fetching transactions:', error);
      return { data: null, error: error.message };
    }

    const transactions: Transaction[] = (data || []).map((t: any) => ({
      id: t.id,
      userId: t.user_id,
      bookId: t.book_id,
      issueDate: t.issue_date,
      dueDate: t.due_date,
      returnDate: t.return_date,
      status: t.status,
      fine: t.fine,
    }));

    return { data: transactions, error: null };
  } catch (error) {
    console.error('Exception fetching transactions:', error);
    return { data: null, error: 'Failed to fetch transactions' };
  }
}

// Fetch transactions for a user
export async function fetchUserTransactions(userId: string): Promise<{ data: Transaction[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('issue_date', { ascending: false });

    if (error) {
      console.error('Error fetching user transactions:', error);
      return { data: null, error: error.message };
    }

    const transactions: Transaction[] = (data || []).map((t: any) => ({
      id: t.id,
      userId: t.user_id,
      bookId: t.book_id,
      issueDate: t.issue_date,
      dueDate: t.due_date,
      returnDate: t.return_date,
      status: t.status,
      fine: t.fine,
    }));

    return { data: transactions, error: null };
  } catch (error) {
    console.error('Exception fetching user transactions:', error);
    return { data: null, error: 'Failed to fetch user transactions' };
  }
}

// Fetch transactions for a book
export async function fetchBookTransactions(bookId: string): Promise<{ data: Transaction[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('book_id', bookId)
      .order('issue_date', { ascending: false });

    if (error) {
      console.error('Error fetching book transactions:', error);
      return { data: null, error: error.message };
    }

    const transactions: Transaction[] = (data || []).map((t: any) => ({
      id: t.id,
      userId: t.user_id,
      bookId: t.book_id,
      issueDate: t.issue_date,
      dueDate: t.due_date,
      returnDate: t.return_date,
      status: t.status,
      fine: t.fine,
    }));

    return { data: transactions, error: null };
  } catch (error) {
    console.error('Exception fetching book transactions:', error);
    return { data: null, error: 'Failed to fetch book transactions' };
  }
}

// Issue a book
export async function issueBook(userId: string, bookId: string): Promise<{ data: Transaction | null; error: string | null }> {
  try {
    // Calculate due date (14 days from now)
    const issueDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        book_id: bookId,
        issue_date: issueDate.toISOString().split('T')[0],
        due_date: dueDate.toISOString().split('T')[0],
        status: 'issued',
      })
      .select()
      .single();

    if (error) {
      console.error('Error issuing book:', error);
      return { data: null, error: error.message };
    }

    // Update book available copies
    const { data: book } = await supabase
      .from('books')
      .select('available_copies')
      .eq('id', bookId)
      .single();

    if (book) {
      const newAvailableCopies = Math.max(0, book.available_copies - 1);
      await supabase
        .from('books')
        .update({
          available_copies: newAvailableCopies,
          availability_status: newAvailableCopies === 0 ? 'issued' : 'available',
        })
        .eq('id', bookId);
    }

    const transaction: Transaction = {
      id: data.id,
      userId: data.user_id,
      bookId: data.book_id,
      issueDate: data.issue_date,
      dueDate: data.due_date,
      returnDate: data.return_date,
      status: data.status,
      fine: data.fine,
    };

    return { data: transaction, error: null };
  } catch (error) {
    console.error('Exception issuing book:', error);
    return { data: null, error: 'Failed to issue book' };
  }
}

// Return a book
export async function returnBook(transactionId: string): Promise<{ data: Transaction | null; error: string | null }> {
  try {
    // Get the transaction
    const { data: transaction, error: fetchError } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', transactionId)
      .single();

    if (fetchError || !transaction) {
      return { data: null, error: 'Transaction not found' };
    }

    // Update transaction
    const returnDate = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('transactions')
      .update({
        return_date: returnDate,
        status: 'returned',
      })
      .eq('id', transactionId)
      .select()
      .single();

    if (error) {
      console.error('Error returning book:', error);
      return { data: null, error: error.message };
    }

    // Update book available copies
    const { data: book } = await supabase
      .from('books')
      .select('available_copies, total_copies')
      .eq('id', transaction.book_id)
      .single();

    if (book) {
      const newAvailableCopies = Math.min(book.total_copies, book.available_copies + 1);
      await supabase
        .from('books')
        .update({
          available_copies: newAvailableCopies,
          availability_status: newAvailableCopies > 0 ? 'available' : 'issued',
        })
        .eq('id', transaction.book_id);
    }

    const updatedTransaction: Transaction = {
      id: data.id,
      userId: data.user_id,
      bookId: data.book_id,
      issueDate: data.issue_date,
      dueDate: data.due_date,
      returnDate: data.return_date,
      status: data.status,
      fine: data.fine,
    };

    return { data: updatedTransaction, error: null };
  } catch (error) {
    console.error('Exception returning book:', error);
    return { data: null, error: 'Failed to return book' };
  }
}

// Request a book (change status to requested)
export async function requestBook(userId: string, bookId: string): Promise<{ data: Transaction | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        book_id: bookId,
        issue_date: new Date().toISOString().split('T')[0],
        due_date: new Date().toISOString().split('T')[0],
        status: 'requested',
      })
      .select()
      .single();

    if (error) {
      console.error('Error requesting book:', error);
      return { data: null, error: error.message };
    }

    const transaction: Transaction = {
      id: data.id,
      userId: data.user_id,
      bookId: data.book_id,
      issueDate: data.issue_date,
      dueDate: data.due_date,
      returnDate: data.return_date,
      status: data.status,
      fine: data.fine,
    };

    return { data: transaction, error: null };
  } catch (error) {
    console.error('Exception requesting book:', error);
    return { data: null, error: 'Failed to request book' };
  }
}