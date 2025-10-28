import axios from 'axios';
import type { MediaEntry } from '../pages/HomeScreen/HomeScreen';
import API_BASE_URL from '../config';

interface RawMediaEntry {
  id: string | number;
  title: string;
  type: 'MOVIE' | 'TV_SHOW';
  director: string;
  budget: number | string;
  location: string;
  duration: string;
  year: number | string;
  posterUrl?: string | null;
  notes?: string | null;
}

interface GetEntriesResponse {
  items: MediaEntry[];
  total: number;
  page: number;
  limit: number;
  message?: string;
  hasMore?: boolean;
}

export const getEntries = async (page: number = 1, limit: number = 10): Promise<GetEntriesResponse> => {
  try {
    const response = await axios.get(`${API_BASE_URL}api/entries`, {
      params: { page, limit }
    });

    const payload = response.data;
    const data = payload?.data ?? payload;

    const transformedItems = ((data.items || []) as RawMediaEntry[]).map((item) => ({
      id: typeof item.id === 'string' ? parseInt(item.id) : item.id,
      title: item.title || '',
      type: item.type,
      director: item.director || '',
      budget: item.budget != null ? item.budget.toString() : '',
      location: item.location || '',
      duration: item.duration || '',
      year: item.year != null ? item.year.toString() : '',
      posterUrl: item.posterUrl ?? undefined,
      notes: item.notes ?? undefined,
    }));

    return {
      items: transformedItems,
      total: data.total ?? 0,
      page: data.page ?? page,
      limit: data.limit ?? limit,
      message: payload?.message,
      hasMore: data.hasMore ?? (transformedItems.length === (data.limit ?? limit)),
    };
  } catch {
    throw new Error('Failed to fetch entries');
  }
};
