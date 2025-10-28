import { useState, useEffect, useRef } from "react";
import { useToast } from "../../components/Toast";
import { createEntry } from "../../services/CreateApi";
import { getEntries } from "../../services/GetApi";
import { updateEntry } from "../../services/UpdateApi";
import { deleteEntry } from "../../services/DeleteApi";

export interface MediaEntry {
  id: number;
  title: string;
  type: "MOVIE" | "TV_SHOW";
  director: string;
  budget: string;
  location: string;
  duration: string;
  year: string;
  posterUrl?: string;
  notes?: string;
}

// API response type
interface ApiEntry {
  id: number;
  title: string;
  type: "MOVIE" | "TV_SHOW";
  director: string;
  budget: string | number;
  location: string;
  duration: string;
  year: string | number;
  posterUrl?: string;
  notes?: string;
}

interface GetEntriesResponse {
  items: ApiEntry[];
  total: number;
  page: number;
  limit: number;
  message?: string;
  hasMore?: boolean;
}

const HomeScreen: React.FC = () => {
  const { show } = useToast();
  const [entries, setEntries] = useState<MediaEntry[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<MediaEntry | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  // Form state
  const [formData, setFormData] = useState<Omit<MediaEntry, "id">>({
    title: "",
    type: "MOVIE",
    director: "",
    budget: "",
    location: "",
    duration: "",
    year: "",
    posterUrl: "",
    notes: "",
  });

  // Pagination state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const initialLoadRef = useRef(true);

  // Fetch entries from API
  useEffect(() => {
    const fetchEntries = async () => {
      setLoading(true);
      try {
        const response: GetEntriesResponse = await getEntries(page);

        if (response.message && initialLoadRef.current) {
          show(response.message, "success");
          initialLoadRef.current = false;
        }

        const processedItems: MediaEntry[] = response.items.map(
          (item: ApiEntry) => ({
            ...item,
            id: item.id,
            budget:
              typeof item.budget === "number"
                ? item.budget.toString()
                : item.budget,
            year:
              typeof item.year === "number" ? item.year.toString() : item.year,
          })
        );

        if (page === 1) {
          setEntries(processedItems);
        } else {
          setEntries((prev) => [...prev, ...processedItems]);
        }
        setHasMore(
          response.hasMore ?? processedItems.length === response.limit
        );
      } catch (error) {
        console.error("Failed to fetch entries:", error);
        show("Failed to fetch entries. Please try again.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [page, show]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await createEntry(formData);
      const newEntry = res.item;
      setEntries((prev) => [newEntry, ...prev]);
      if (res.message) show(res.message, "success");
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error("Failed to add entry:", error);
      show("Failed to add entry. Please try again.", "error");
    }
  };

  const handleEditEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEntry) return;

    try {
      const res = await updateEntry(editingEntry.id.toString(), formData);
      const updatedEntry = res.item;
      setEntries((prev) =>
        prev.map((entry) =>
          entry.id === editingEntry.id ? updatedEntry : entry
        )
      );
      if (res.message) show(res.message, "success");
      setShowEditModal(false);
      setEditingEntry(null);
      resetForm();
    } catch (error) {
      console.error("Failed to update entry:", error);
      show("Failed to update entry. Please try again.", "error");
    }
  };

  const handleDeleteEntry = async (id: number) => {
    try {
      const res = await deleteEntry(id.toString());
      setEntries((prev) => prev.filter((entry) => entry.id !== id));
      setDeleteConfirm(null);
      if (res?.message) show(res.message, "success");
    } catch (error) {
      console.error("Failed to delete entry:", error);
      show("Failed to delete entry. Please try again.", "error");
    }
  };

  const openEditModal = (entry: MediaEntry) => {
    setEditingEntry(entry);
    setFormData({
      title: entry.title,
      type: entry.type,
      director: entry.director,
      budget: entry.budget,
      location: entry.location,
      duration: entry.duration,
      year: entry.year,
      posterUrl: entry.posterUrl || "",
      notes: entry.notes || "",
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      type: "MOVIE",
      director: "",
      budget: "",
      location: "",
      duration: "",
      year: "",
      posterUrl: "",
      notes: "",
    });
  };

  const formatBudget = (budget: string | number): string => {
    const budgetStr = typeof budget === "number" ? budget.toString() : budget;

    if (budgetStr.includes("$")) return budgetStr;

    const num = parseInt(budgetStr.replace(/[^0-9]/g, ""));
    if (!isNaN(num)) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(num);
    }

    return budgetStr;
  };

  const formatType = (type: string): string => {
    return type === "MOVIE" ? "Movie" : "TV Show";
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 1.5 && hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">CineCollection</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Your Personal Media Library</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
          >
            <span className="mr-2 text-lg">+</span>
            Add New Entry
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Entries Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden" onScroll={handleScroll}>
          <div className="overflow-x-auto max-h-[calc(100vh-12rem)]">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Director</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Budget</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Location</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Duration</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Year/Time</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {entries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <strong className="text-gray-900 dark:text-white">{entry.title}</strong>
                        {entry.notes && (
                          <span className="ml-2 relative group">
                            <span className="cursor-help">ℹ️</span>
                            <div className="hidden group-hover:block absolute left-0 top-full mt-1 w-64 p-2 bg-gray-900 text-white text-sm rounded-md shadow-lg z-10">
                              {entry.notes}
                            </div>
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full
                        ${entry.type === 'MOVIE' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                          : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                        }`}
                      >
                        {formatType(entry.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-900 dark:text-gray-300">{entry.director}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-gray-300">{formatBudget(entry.budget)}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-gray-300">{entry.location}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-gray-300">{entry.duration}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-gray-300">{entry.year}</td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditModal(entry)}
                          className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(entry.id)}
                          className="text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {loading && (
              <div className="flex flex-col items-center justify-center p-8 text-gray-500 dark:text-gray-400">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <p>Loading more entries...</p>
              </div>
            )}

            {entries.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="text-6xl mb-4">🎬</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No entries yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Start building your collection by adding your first movie or
                  TV show!
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
                >
                  Add Your First Entry
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add Entry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Add New Entry</h2>
              <button
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 text-2xl font-light"
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddEntry} className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 dark:bg-gray-700 dark:text-white px-3 py-2"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type *</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 dark:bg-gray-700 dark:text-white px-3 py-2"
                  >
                    <option value="MOVIE">Movie</option>
                    <option value="TV_SHOW">TV Show</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Director *</label>
                  <input
                    type="text"
                    name="director"
                    value={formData.director}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 dark:bg-gray-700 dark:text-white px-3 py-2"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Budget *</label>
                  <input
                    type="text"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    placeholder="e.g., $160M, $3M/ep"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 dark:bg-gray-700 dark:text-white px-3 py-2"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., LA, Paris, Albuquerque"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 dark:bg-gray-700 dark:text-white px-3 py-2"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Duration *</label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="e.g., 148 min, 49 min/ep"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 dark:bg-gray-700 dark:text-white px-3 py-2"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Year/Time *</label>
                  <input
                    type="text"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    placeholder="e.g., 2010, 2008-2013"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 dark:bg-gray-700 dark:text-white px-3 py-2"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Poster URL</label>
                  <input
                    type="url"
                    name="posterUrl"
                    value={formData.posterUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/poster.jpg"
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 dark:bg-gray-700 dark:text-white px-3 py-2"
                  />
                </div>
              </div>
              <div className="mt-4 space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Additional notes about the movie/TV show..."
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 dark:bg-gray-700 dark:text-white px-3 py-2"
                />
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Add Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Entry Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Entry</h2>
              <button
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 text-2xl font-light"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingEntry(null);
                  resetForm();
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleEditEntry} className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 dark:bg-gray-700 dark:text-white px-3 py-2"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type *</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 dark:bg-gray-700 dark:text-white px-3 py-2"
                  >
                    <option value="MOVIE">Movie</option>
                    <option value="TV_SHOW">TV Show</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Director *</label>
                  <input
                    type="text"
                    name="director"
                    value={formData.director}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 dark:bg-gray-700 dark:text-white px-3 py-2"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Budget *</label>
                  <input
                    type="text"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    placeholder="e.g., $160M, $3M/ep"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 dark:bg-gray-700 dark:text-white px-3 py-2"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., LA, Paris, Albuquerque"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 dark:bg-gray-700 dark:text-white px-3 py-2"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Duration *</label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="e.g., 148 min, 49 min/ep"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 dark:bg-gray-700 dark:text-white px-3 py-2"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Year/Time *</label>
                  <input
                    type="text"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    placeholder="e.g., 2010, 2008-2013"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 dark:bg-gray-700 dark:text-white px-3 py-2"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Poster URL</label>
                  <input
                    type="url"
                    name="posterUrl"
                    value={formData.posterUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/poster.jpg"
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 dark:bg-gray-700 dark:text-white px-3 py-2"
                  />
                </div>
              </div>
              <div className="mt-4 space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Additional notes about the movie/TV show..."
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 dark:bg-gray-700 dark:text-white px-3 py-2"
                />
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingEntry(null);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Update Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-4 border-b dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Confirm Deletion</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700 dark:text-gray-300">
                Are you sure you want to delete this entry? This action cannot
                be undone.
              </p>
            </div>
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 flex justify-end space-x-3 rounded-b-lg">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300 dark:hover:bg-gray-500"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={() => handleDeleteEntry(deleteConfirm)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;