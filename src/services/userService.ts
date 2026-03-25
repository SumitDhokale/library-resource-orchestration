import { supabase } from '../supabaseClient';
import type { User } from '../types';

/**
 * User Service - Handle all user-related database operations
 */

// Fetch all users (admin only)
export async function fetchAllUsers(): Promise<{ data: User[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      return { data: null, error: error.message };
    }

    const users: User[] = (data || []).map((u: any) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.created_at,
      avatar: u.avatar,
    }));

    return { data: users, error: null };
  } catch (error) {
    console.error('Exception fetching users:', error);
    return { data: null, error: 'Failed to fetch users' };
  }
}

// Fetch single user by ID
export async function fetchUserById(id: string): Promise<{ data: User | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      return { data: null, error: error.message };
    }

    const user: User = {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
      createdAt: data.created_at,
      avatar: data.avatar,
    };

    return { data: user, error: null };
  } catch (error) {
    console.error('Exception fetching user:', error);
    return { data: null, error: 'Failed to fetch user' };
  }
}

// Fetch users by role
export async function fetchUsersByRole(role: string): Promise<{ data: User[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('role', role)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users by role:', error);
      return { data: null, error: error.message };
    }

    const users: User[] = (data || []).map((u: any) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.created_at,
      avatar: u.avatar,
    }));

    return { data: users, error: null };
  } catch (error) {
    console.error('Exception fetching users by role:', error);
    return { data: null, error: 'Failed to fetch users' };
  }
}

// Update user profile
export async function updateUserProfile(
  id: string,
  updates: Partial<Omit<User, 'id' | 'createdAt' | 'email'>>
): Promise<{ data: User | null; error: string | null }> {
  try {
    const updateData: any = {};
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.role !== undefined) updateData.role = updates.role;
    if (updates.avatar !== undefined) updateData.avatar = updates.avatar;

    const { data, error } = await supabase
      .from('user_profiles')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating user profile:', error);
      return { data: null, error: error.message };
    }

    const updatedUser: User = {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
      createdAt: data.created_at,
      avatar: data.avatar,
    };

    return { data: updatedUser, error: null };
  } catch (error) {
    console.error('Exception updating user profile:', error);
    return { data: null, error: 'Failed to update user profile' };
  }
}

// Delete user (admin only)
export async function deleteUser(id: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase.from('user_profiles').delete().eq('id', id);

    if (error) {
      console.error('Error deleting user:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Exception deleting user:', error);
    return { success: false, error: 'Failed to delete user' };
  }
}

// Change user role
export async function changeUserRole(id: string, newRole: string): Promise<{ data: User | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({ role: newRole })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error changing user role:', error);
      return { data: null, error: error.message };
    }

    const updatedUser: User = {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
      createdAt: data.created_at,
      avatar: data.avatar,
    };

    return { data: updatedUser, error: null };
  } catch (error) {
    console.error('Exception changing user role:', error);
    return { data: null, error: 'Failed to change user role' };
  }
}

// Search users
export async function searchUsers(query: string): Promise<{ data: User[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching users:', error);
      return { data: null, error: error.message };
    }

    const users: User[] = (data || []).map((u: any) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.created_at,
      avatar: u.avatar,
    }));

    return { data: users, error: null };
  } catch (error) {
    console.error('Exception searching users:', error);
    return { data: null, error: 'Failed to search users' };
  }
}