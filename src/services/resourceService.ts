import { supabase } from '../supabaseClient';
import type { DigitalResource } from '../types';

/**
 * Digital Resource Service - Handle all digital resource database operations
 */

// Fetch all digital resources
export async function fetchDigitalResources(): Promise<{ data: DigitalResource[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('digital_resources')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching digital resources:', error);
      return { data: null, error: error.message };
    }

    const resources: DigitalResource[] = (data || []).map((r: any) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      fileUrl: r.file_url,
      fileType: r.file_type,
      fileSize: r.file_size,
      category: r.category,
      uploadedBy: r.uploaded_by,
      createdAt: r.created_at,
      downloads: r.downloads,
    }));

    return { data: resources, error: null };
  } catch (error) {
    console.error('Exception fetching digital resources:', error);
    return { data: null, error: 'Failed to fetch digital resources' };
  }
}

// Fetch resources by category
export async function fetchResourcesByCategory(category: string): Promise<{ data: DigitalResource[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('digital_resources')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching resources by category:', error);
      return { data: null, error: error.message };
    }

    const resources: DigitalResource[] = (data || []).map((r: any) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      fileUrl: r.file_url,
      fileType: r.file_type,
      fileSize: r.file_size,
      category: r.category,
      uploadedBy: r.uploaded_by,
      createdAt: r.created_at,
      downloads: r.downloads,
    }));

    return { data: resources, error: null };
  } catch (error) {
    console.error('Exception fetching resources by category:', error);
    return { data: null, error: 'Failed to fetch resources' };
  }
}

// Create new digital resource
export async function createDigitalResource(
  resource: Omit<DigitalResource, 'id' | 'createdAt' | 'downloads'>
): Promise<{ data: DigitalResource | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('digital_resources')
      .insert({
        title: resource.title,
        description: resource.description,
        file_url: resource.fileUrl,
        file_type: resource.fileType,
        file_size: resource.fileSize,
        category: resource.category,
        uploaded_by: resource.uploadedBy,
        downloads: 0,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating digital resource:', error);
      return { data: null, error: error.message };
    }

    const newResource: DigitalResource = {
      id: data.id,
      title: data.title,
      description: data.description,
      fileUrl: data.file_url,
      fileType: data.file_type,
      fileSize: data.file_size,
      category: data.category,
      uploadedBy: data.uploaded_by,
      createdAt: data.created_at,
      downloads: data.downloads,
    };

    return { data: newResource, error: null };
  } catch (error) {
    console.error('Exception creating digital resource:', error);
    return { data: null, error: 'Failed to create digital resource' };
  }
}

// Update digital resource
export async function updateDigitalResource(
  id: string,
  updates: Partial<Omit<DigitalResource, 'id' | 'createdAt' | 'downloads'>>
): Promise<{ data: DigitalResource | null; error: string | null }> {
  try {
    const updateData: any = {};
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.fileUrl !== undefined) updateData.file_url = updates.fileUrl;
    if (updates.fileType !== undefined) updateData.file_type = updates.fileType;
    if (updates.fileSize !== undefined) updateData.file_size = updates.fileSize;
    if (updates.category !== undefined) updateData.category = updates.category;

    const { data, error } = await supabase
      .from('digital_resources')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating digital resource:', error);
      return { data: null, error: error.message };
    }

    const updatedResource: DigitalResource = {
      id: data.id,
      title: data.title,
      description: data.description,
      fileUrl: data.file_url,
      fileType: data.file_type,
      fileSize: data.file_size,
      category: data.category,
      uploadedBy: data.uploaded_by,
      createdAt: data.created_at,
      downloads: data.downloads,
    };

    return { data: updatedResource, error: null };
  } catch (error) {
    console.error('Exception updating digital resource:', error);
    return { data: null, error: 'Failed to update digital resource' };
  }
}

// Delete digital resource
export async function deleteDigitalResource(id: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase.from('digital_resources').delete().eq('id', id);

    if (error) {
      console.error('Error deleting digital resource:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Exception deleting digital resource:', error);
    return { success: false, error: 'Failed to delete digital resource' };
  }
}

// Increment downloads
export async function incrementDownload(id: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const { data: resource } = await supabase
      .from('digital_resources')
      .select('downloads')
      .eq('id', id)
      .single();

    if (!resource) {
      return { success: false, error: 'Resource not found' };
    }

    const { error } = await supabase
      .from('digital_resources')
      .update({ downloads: resource.downloads + 1 })
      .eq('id', id);

    if (error) {
      console.error('Error incrementing downloads:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Exception incrementing downloads:', error);
    return { success: false, error: 'Failed to increment downloads' };
  }
}

// Search resources
export async function searchResources(query: string): Promise<{ data: DigitalResource[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('digital_resources')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching resources:', error);
      return { data: null, error: error.message };
    }

    const resources: DigitalResource[] = (data || []).map((r: any) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      fileUrl: r.file_url,
      fileType: r.file_type,
      fileSize: r.file_size,
      category: r.category,
      uploadedBy: r.uploaded_by,
      createdAt: r.created_at,
      downloads: r.downloads,
    }));

    return { data: resources, error: null };
  } catch (error) {
    console.error('Exception searching resources:', error);
    return { data: null, error: 'Failed to search resources' };
  }
}