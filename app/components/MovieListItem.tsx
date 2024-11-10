import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../store/moviesSlice';
import { RootState } from '../store/store';
import { Movie } from '../types/movie';
// import Placeholder from '../assets/Placeholder.jpg'

interface Props {
  item: Movie;
  navigation: any;
}

export function MovieListItem({ item, navigation }: Props) {
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.movies.favorites);
  const isFavorite = favorites.includes(item.trackId);

  const imageUri = item.artworkUrl100 ? item.artworkUrl100 : require('../assets/Placeholder.jpg');

  const handleFavoriteToggle = () => {
    dispatch(toggleFavorite(item.trackId));
  };

  const handleNavigation = () => {
    navigation.navigate('MovieDetail', { movie: item });
  };

  return (
    <View style={styles.container}>
      {/* Movie Details and Navigation */}
      <TouchableOpacity style={styles.detailsTouchable} onPress={handleNavigation}>
        {/* Movie Image */}
        <Image  source={typeof imageUri === 'string' ? { uri: imageUri } : imageUri} style={styles.movieImage} />

        {/* Movie Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.movieName}>{item.trackName}</Text>
          <Text style={styles.genre}>{item.primaryGenreName}</Text>
          <Text style={styles.price}>
            {`${item.formattedPrice}`}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Favorite Button */}
      <TouchableOpacity style={styles.favoriteButton} onPress={handleFavoriteToggle}>
        <Text style={[styles.favoriteText, isFavorite ? styles.favorite : styles.notFavorite]}>
          {isFavorite ? '★' : '☆'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'white',
    marginBottom: 10,
    borderRadius: 5,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  detailsTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  movieImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
  },
  detailsContainer: {
    marginLeft: 10,
    flex: 1,
  },
  movieName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  genre: {
    color: '#666',
    fontSize: 14,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
  },
  favoriteButton: {
    padding: 10,
  },
  favoriteText: {
    fontSize: 24,
  },
  favorite: {
    color: 'gold',
  },
  notFavorite: {
    color: '#ccc',
  },
});

export default MovieListItem;
