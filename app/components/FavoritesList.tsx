import React from 'react';
import { View, ScrollView, Image, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Movie } from '../types/movie';

interface FavoritesListProps {
  navigation: any;
}

export function FavoritesList({ navigation }: FavoritesListProps) {
  const favoritesData  = useSelector((state: RootState) => state.movies.favoritesData);

  if (favoritesData.length === 0) {
    return null;
  }

  return (
    <ScrollView horizontal style={{ height: 120 }} showsHorizontalScrollIndicator={false}>
      <View style={{ flexDirection: 'row' }}>
        {favoritesData.map( (movie: Movie) => (
          <TouchableOpacity
            key={movie.trackId}
            style={{ width: 70, marginHorizontal: 5, alignItems: 'center' }}
            onPress={() => navigation.navigate('MovieDetail', { movie })}
          >
            <Image
              source={{ uri: movie.artworkUrl100 }}
              style={{ width: 50, height: 50, borderRadius: 25 }}
            />
            <Text style={{ fontSize: 12, marginTop: 5, textAlign: 'center' }} numberOfLines={1}>
              {movie.trackName}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
