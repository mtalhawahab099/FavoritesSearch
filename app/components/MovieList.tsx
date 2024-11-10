import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import {
  fetchMovies,
  toggleViewMode,
  updateLastVisited,
  initializeState,
} from '../store/moviesSlice';
import { MovieListItem } from './MovieListItem';
import { MovieGridItem } from './MovieGridItem';
import { FavoritesList } from './FavoritesList';

interface MovieListProps {
  navigation: any;
}

export function MovieList({ navigation }: MovieListProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error, viewMode, lastVisited } = useSelector(
    (state: RootState) => state.movies
  );
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(initializeState());
    dispatch(updateLastVisited());
    dispatch(fetchMovies('a'));
  }, [dispatch]);

  // Fetch movies whenever the search query changes
  useEffect(() => {
    if (searchQuery) {
      dispatch(fetchMovies(searchQuery));
    } else {
      dispatch(fetchMovies('a'));
    }
  }, [dispatch, searchQuery]);

  const renderMovieItem = ({ item }: any) => {
    return viewMode === 'list' ? (
      <MovieListItem item={item} navigation={navigation} />
    ) : (
      <MovieGridItem item={item} navigation={navigation} />
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchBar}
            placeholder="Search softwares..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
            // onSubmitEditing={onSearchSubmit}
          />
        </View>

        {/* Favorites List */}
        <FavoritesList navigation={navigation} />

        {/* Toggle View Button */}
        <Button
          title={`Toggle ${viewMode === 'list' ? 'Grid' : 'List'} View`}
          onPress={() => dispatch(toggleViewMode())}
        />

        {/* Last Visited Info */}
        <Text style={styles.lastVisited}>
          Last visited: {new Date(lastVisited).toLocaleDateString()}
        </Text>

        {/* Conditional Rendering for Loading, Error, and Movie List */}
        {loading ? (
          <ActivityIndicator size="large" color="#007bff" />
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : items.length === 0 ? (
          <Text style={styles.noMovies}>No movies found</Text>
        ) : (
          <FlatList
            data={items}
            key={viewMode}
            keyExtractor={(item) => item.trackId.toString()}
            renderItem={renderMovieItem}
            numColumns={viewMode === 'grid' ? 2 : 1}
            contentContainerStyle={styles.flatListContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  searchBar: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  searchButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginLeft: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  lastVisited: {
    marginVertical: 10,
    color: '#666',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
  noMovies: {
    textAlign: 'center',
    marginVertical: 20,
  },
  flatListContent: {
    paddingBottom: 20,
  },
});

export default MovieList;
