import { supabase } from '../supabaseClient';
import type { ActivityLog } from '../types';

/**
 * Activity Log Service - Handle activity logging
 */

// Fetch all activity logs
export async function fetchActivityLogs(): Promise<{ data: ActivityLog[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching activity logs:', error);
      return { data: null, error: error.message };
    }

    const logs: ActivityLog[] = (data || []).map((log: any) => ({
      id: log.id,
      userId: log.user_id,
      action: log.action,
      details: log.details,
      timestamp: log.timestamp,
    }));

    return { data: logs, error: null };
  } catch (error) {
    console.error('Exception fetching activity logs:', error);
    return { data: null, error: 'Failed to fetch activity logs' };
  }
}

// Fetch activity logs for a specific user
export async function fetchUserActivityLogs(userId: string): Promise<{ data: ActivityLog[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching user activity logs:', error);
      return { data: null, error: error.message };
    }

    const logs: ActivityLog[] = (data || []).map((log: any) => ({
      id: log.id,
      userId: log.user_id,
      action: log.action,
      details: log.details,
      timestamp: log.timestamp,
    }));

    return { data: logs, error: null };
  } catch (error) {
    console.error('Exception fetching user activity logs:', error);
    return { data: null, error: 'Failed to fetch user activity logs' };
  }
}

// Add activity log
export async function addActivityLog(
  userId: string,
  action: string,
  details: string
): Promise<{ data: ActivityLog | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .insert({
        user_id: userId,
        action,
        details,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding activity log:', error);
      return { data: null, error: error.message };
    }

    const log: ActivityLog = {
      id: data.id,
      userId: data.user_id,
      action: data.action,
      details: data.details,
      timestamp: data.timestamp,
    };

    return { data: log, error: null };
  } catch (error) {
    console.error('Exception adding activity log:', error);
    return { data: null, error: 'Failed to add activity log' };
  }
}

// Fetch activity logs by action
export async function fetchActivityLogsByAction(action: string): Promise<{ data: ActivityLog[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('action', action)
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching activity logs by action:', error);
      return { data: null, error: error.message };
    }

    const logs: ActivityLog[] = (data || []).map((log: any) => ({
      id: log.id,
      userId: log.user_id,
      action: log.action,
      details: log.details,
      timestamp: log.timestamp,
    }));

    return { data: logs, error: null };
  } catch (error) {
    console.error('Exception fetching activity logs by action:', error);
    return { data: null, error: 'Failed to fetch activity logs' };
  }
}