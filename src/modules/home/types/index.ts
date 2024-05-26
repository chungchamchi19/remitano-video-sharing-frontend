export type Movie = {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  youtube_id: string;
};

export type MovieSession = Omit<Movie, "id">