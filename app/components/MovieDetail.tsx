import React from 'react';
import { View, ScrollView, Image, Text, TouchableOpacity, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../store/moviesSlice';
import { RootState } from '../store/store';
import { Movie } from '../types/movie';

interface MovieDetailProps {
  route: any;
}

export function MovieDetail({ route }: MovieDetailProps) {
  const dispatch = useDispatch();
  const movie: Movie = route.params.movie;
  const favorites = useSelector((state: RootState) => state.movies.favorites);
  const isFavorite = favorites.includes(movie.trackId);

  return (
    <ScrollView contentContainerStyle={{ padding: 15 }}>
      <Image
        source={{ uri: movie.artworkUrl100 }}
        style={{ width: '100%', height: 300, resizeMode: 'cover', borderRadius: 10 }}
      />

      <View style={{ padding: 15 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', flexShrink: 1 }}>
            {movie.trackName}
          </Text>
          <TouchableOpacity onPress={() => dispatch(toggleFavorite(movie.trackId))}>
            <Text style={{ fontSize: 30, color: isFavorite ? 'gold' : 'gray' }}>
              {isFavorite ? '★' : '☆'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={{ color: 'gray', marginVertical: 5 }}>{movie.primaryGenreName}</Text>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{`${movie.formattedPrice}`}</Text>
        <Text style={{ marginTop: 15 }}>{movie.description}</Text>
      </View>
    </ScrollView>
  );
}
