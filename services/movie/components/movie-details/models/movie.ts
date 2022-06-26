import mongoose, { Schema, Document } from 'mongoose';

export interface Movie extends Pick<Document, '_id'> {
  Title?: string;
  Director?: string;
  Genre?: string;
  Released?: Date;
}

const MovieSchema: Schema<Movie> = new Schema(
  {
    Title: {
      type: String,
      required: true,
    },
    Director: {
      type: String,
      required: true,
    },
    Genre: {
      type: String,
      required: true,
    },
    Released: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

const MovieModel = mongoose.model('Movie', MovieSchema, 'movie');

export default MovieModel;
