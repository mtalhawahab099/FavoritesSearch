import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../store/moviesSlice';
import { RootState } from '../store/store';
import { Movie } from '../types/movie';

interface Props {
  item: Movie;
  navigation: any;
}

export function MovieGridItem({ item, navigation }: Props) {
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.movies.favorites);
  const isFavorite = favorites.includes(item.trackId);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate('MovieDetail', { movie: item })}
    >
      {/* Movie Image */}
      <Image
        source={{ uri: item.artworkUrl100 }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Movie Details */}
      <View style={styles.details}>
        <Text style={styles.title} numberOfLines={1}>{item.trackName}</Text>
        <Text style={styles.genre}>{item.primaryGenreName}</Text>
        <Text style={styles.price}>{`${item.formattedPrice}`}</Text>

        {/* Favorite Button */}
        <TouchableOpacity onPress={() => dispatch(toggleFavorite(item.trackId))}>
          <Text style={[styles.favoriteIcon, { color: isFavorite ? 'gold' : 'gray' }]}>
            {isFavorite ? '★' : '☆'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width:'46%',
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 200,
  },
  details: {
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  genre: {
    color: 'gray',
    marginBottom: 5,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  favoriteIcon: {
    fontSize: 24,
    alignSelf: 'flex-end',
    marginTop: 10,
  },
});
