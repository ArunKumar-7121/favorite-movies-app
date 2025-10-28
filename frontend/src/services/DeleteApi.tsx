import axios from 'axios';
import API_BASE_URL from '../config';

export const deleteEntry = async (id: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}api/entries/${id}`);
    const payload = response.data;
    const message = payload?.message;
    return { message };
  } catch {
    throw new Error('Failed to delete entry');
  }
};
