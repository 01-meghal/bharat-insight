import { create } from 'zustand';
import { Department } from '@/lib/data';

interface AppState {
  department: Department;
  setDepartment: (dept: Department) => void;
  // Filters
  filterState: string;
  setFilterState: (state: string) => void;
  filterYear: string;
  setFilterYear: (year: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  department: 'Health',
  setDepartment: (dept) => set({ department: dept, filterState: 'All', filterYear: 'All', searchQuery: '' }),
  
  filterState: 'All',
  setFilterState: (state) => set({ filterState: state }),
  
  filterYear: 'All',
  setFilterYear: (year) => set({ filterYear: year }),
  
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  resetFilters: () => set({ filterState: 'All', filterYear: 'All', searchQuery: '' }),
}));
