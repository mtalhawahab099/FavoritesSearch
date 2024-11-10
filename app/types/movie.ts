export interface Movie {
  trackId: number;
  trackName: string;
  artworkUrl100: string;
  formattedPrice: number;
  primaryGenreName: string;
  description: string;
  isFavorite?: boolean;
}