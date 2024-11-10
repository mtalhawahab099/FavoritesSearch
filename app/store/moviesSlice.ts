import { createSlice, createAsyncThunk, PayloadAction, ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { Movie } from '../types/movie';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the initial state type
interface MoviesState {
  items: Movie[];
  favoritesData: Movie[];
  favorites: number[];
  loading: boolean;
  error: string | null;
  viewMode: 'list' | 'grid';
  lastVisited: string;
}

const initialState: MoviesState = {
  items: [],
  favoritesData: [],
  favorites: [],
  loading: false,
  error: null,
  viewMode: 'list',
  lastVisited: new Date().toISOString(),
};

// AsyncStorage utility functions
const getStorageData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Error getting data from AsyncStorage:', error);
    return null;
  }
};

const setStorageData = async (key: string, value: any) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error setting data to AsyncStorage:', error);
  }
};

// Thunks
export const initializeState = createAsyncThunk(
  'movies/initializeState',
  async () => {
    const favorites = await getStorageData('favorites');
    const favoritesData = await getStorageData('favoritesData');
    const lastVisited = await getStorageData('lastVisited');
    return {
      favoritesData: favoritesData || [],
      favorites: favorites || [],
      lastVisited: lastVisited || new Date().toISOString(),
    };
  }
);

export const fetchMovies = createAsyncThunk(
  'movies/fetchMovies',
  async (searchTerm: string = 'a') => {
    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}&media=software&entity=software`

    );
    const data = await response.json();
    return data.results as Movie[];
  }
);

// Slice
const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    toggleFavorite: (state: MoviesState, action: PayloadAction<number>) => {
      const trackId = action.payload;
      const index = state.favorites.indexOf(trackId);
      const index1 = state.favoritesData.findIndex(favorite => favorite.trackId === trackId);
      if (index === -1) {
        const movieToAdd = state.items.find(item => item.trackId === trackId);
        if (movieToAdd) {
          state.favoritesData.push(movieToAdd); // Only push if movieToAdd is not undefined
        }
        state.favorites.push(action.payload);
      } else {
        state.favorites.splice(index, 1);
        state.favoritesData.splice(index1, 1);
      }
      setStorageData('favorites', state.favorites); // Save to AsyncStorage
      setStorageData('favoritesData', state.favoritesData); // Save to AsyncStorage
      
    },
    toggleViewMode: (state: MoviesState) => {
      state.viewMode = state.viewMode === 'list' ? 'grid' : 'list';
    },
    updateLastVisited: (state: MoviesState) => {
      state.lastVisited = new Date().toISOString();
      setStorageData('lastVisited', state.lastVisited); // Save to AsyncStorage
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<MoviesState>) => {
    builder
      .addCase(initializeState.fulfilled, (state: MoviesState, action) => {
        state.favorites = action.payload.favorites;
        state.lastVisited = action.payload.lastVisited;
        state.favoritesData = action.payload.favoritesData;
      })
      .addCase(fetchMovies.pending, (state: MoviesState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state: MoviesState, action: PayloadAction<Movie[]>) => {
        state.loading = false;
        state.items = action.payload.map(movie => ({
          ...movie,
          isFavorite: state.favorites.includes(movie.trackId),
        }));
      })
      .addCase(fetchMovies.rejected, (state: MoviesState, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch movies';
      });
  },
});

export const { toggleFavorite, toggleViewMode, updateLastVisited } = moviesSlice.actions;
export default moviesSlice.reducer;
