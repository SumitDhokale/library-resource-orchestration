import { supabase } from '../supabaseClient';
import type { Book } from '../types';

/**
 * Book Service - Handle all book-related database operations
 */

// Fetch all books
export async function fetchBooks(): Promise<{ data: Book[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching books:', error);
      return { data: null, error: error.message };
    }

    // Map database columns to type
    const books: Book[] = (data || []).map((book: any) => ({
      id: book.id,
      title: book.title,
      author: book.author,
      category: book.category,
      isbn: book.isbn,
      description: book.description,
      coverImage: book.cover_image,
      availabilityStatus: book.availability_status,
      totalCopies: book.total_copies,
      availableCopies: book.available_copies,
      addedBy: book.added_by,
      createdAt: book.created_at,
    }));

    return { data: books, error: null };
  } catch (error) {
    console.error('Exception fetching books:', error);
    return { data: null, error: 'Failed to fetch books' };
  }
}

// Fetch single book by ID
export async function fetchBookById(id: string): Promise<{ data: Book | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching book:', error);
      return { data: null, error: error.message };
    }

    const book: Book = {
      id: data.id,
      title: data.title,
      author: data.author,
      category: data.category,
      isbn: data.isbn,
      description: data.description,
      coverImage: data.cover_image,
      availabilityStatus: data.availability_status,
      totalCopies: data.total_copies,
      availableCopies: data.available_copies,
      addedBy: data.added_by,
      createdAt: data.created_at,
    };

    return { data: book, error: null };
  } catch (error) {
    console.error('Exception fetching book:', error);
    return { data: null, error: 'Failed to fetch book' };
  }
}

// Fetch books by category
export async function fetchBooksByCategory(category: string): Promise<{ data: Book[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching books by category:', error);
      return { data: null, error: error.message };
    }

    const books: Book[] = (data || []).map((book: any) => ({
      id: book.id,
      title: book.title,
      author: book.author,
      category: book.category,
      isbn: book.isbn,
      description: book.description,
      coverImage: book.cover_image,
      availabilityStatus: book.availability_status,
      totalCopies: book.total_copies,
      availableCopies: book.available_copies,
      addedBy: book.added_by,
      createdAt: book.created_at,
    }));

    return { data: books, error: null };
  } catch (error) {
    console.error('Exception fetching books by category:', error);
    return { data: null, error: 'Failed to fetch books' };
  }
}

// Create new book
export async function createBook(
  book: Omit<Book, 'id' | 'createdAt'>
): Promise<{ data: Book | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('books')
      .insert({
        title: book.title,
        author: book.author,
        category: book.category,
        isbn: book.isbn,
        description: book.description,
        cover_image: book.coverImage,
        availability_status: book.availabilityStatus,
        total_copies: book.totalCopies,
        available_copies: book.availableCopies,
        added_by: book.addedBy,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating book:', error);
      return { data: null, error: error.message };
    }

    const newBook: Book = {
      id: data.id,
      title: data.title,
      author: data.author,
      category: data.category,
      isbn: data.isbn,
      description: data.description,
      coverImage: data.cover_image,
      availabilityStatus: data.availability_status,
      totalCopies: data.total_copies,
      availableCopies: data.available_copies,
      addedBy: data.added_by,
      createdAt: data.created_at,
    };

    return { data: newBook, error: null };
  } catch (error) {
    console.error('Exception creating book:', error);
    return { data: null, error: 'Failed to create book' };
  }
}

// Update book
export async function updateBook(
  id: string,
  updates: Partial<Omit<Book, 'id' | 'createdAt'>>
): Promise<{ data: Book | null; error: string | null }> {
  try {
    const updateData: any = {};
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.author !== undefined) updateData.author = updates.author;
    if (updates.category !== undefined) updateData.category = updates.category;
    if (updates.isbn !== undefined) updateData.isbn = updates.isbn;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.coverImage !== undefined) updateData.cover_image = updates.coverImage;
    if (updates.availabilityStatus !== undefined) updateData.availability_status = updates.availabilityStatus;
    if (updates.totalCopies !== undefined) updateData.total_copies = updates.totalCopies;
    if (updates.availableCopies !== undefined) updateData.available_copies = updates.availableCopies;

    const { data, error } = await supabase
      .from('books')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating book:', error);
      return { data: null, error: error.message };
    }

    const updatedBook: Book = {
      id: data.id,
      title: data.title,
      author: data.author,
      category: data.category,
      isbn: data.isbn,
      description: data.description,
      coverImage: data.cover_image,
      availabilityStatus: data.availability_status,
      totalCopies: data.total_copies,
      availableCopies: data.available_copies,
      addedBy: data.added_by,
      createdAt: data.created_at,
    };

    return { data: updatedBook, error: null };
  } catch (error) {
    console.error('Exception updating book:', error);
    return { data: null, error: 'Failed to update book' };
  }
}

// Delete book
export async function deleteBook(id: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase.from('books').delete().eq('id', id);

    if (error) {
      console.error('Error deleting book:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Exception deleting book:', error);
    return { success: false, error: 'Failed to delete book' };
  }
}

// Search books
export async function searchBooks(query: string): Promise<{ data: Book[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .or(`title.ilike.%${query}%,author.ilike.%${query}%,isbn.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching books:', error);
      return { data: null, error: error.message };
    }

    const books: Book[] = (data || []).map((book: any) => ({
      id: book.id,
      title: book.title,
      author: book.author,
      category: book.category,
      isbn: book.isbn,
      description: book.description,
      coverImage: book.cover_image,
      availabilityStatus: book.availability_status,
      totalCopies: book.total_copies,
      availableCopies: book.available_copies,
      addedBy: book.added_by,
      createdAt: book.created_at,
    }));

    return { data: books, error: null };
  } catch (error) {
    console.error('Exception searching books:', error);
    return { data: null, error: 'Failed to search books' };
  }
}