import axios from 'axios';
import { type MediaEntry } from '../pages/HomeScreen/HomeScreen';
import API_BASE_URL from '../config';

export const createEntry = async (entry: Omit<MediaEntry, 'id'>): Promise<{ item: MediaEntry; message?: string }> => {
  try {
    const response = await axios.post(`${API_BASE_URL}api/entries`, {
      ...entry,
      type: entry.type.replace(' ', '_').toUpperCase(),
      budget: entry.budget.toString(),
      year: entry.year.toString(),
    });

    const payload = response.data;
    const data = payload?.data ?? payload;
    const item = data.item ?? data;

    const transformed: MediaEntry = {
      id: typeof item.id === 'string' ? parseInt(item.id) : item.id,
      title: item.title ?? '',
      type: item.type,
      director: item.director ?? '',
      budget: item.budget != null ? item.budget.toString() : '',
      location: item.location ?? '',
      duration: item.duration ?? '',
      year: item.year != null ? item.year.toString() : '',
      posterUrl: item.posterUrl ?? undefined,
      notes: item.notes ?? undefined,
    };

    return { item: transformed, message: payload?.message };
  } catch {
    throw new Error('Failed to create entry');
  }
};
