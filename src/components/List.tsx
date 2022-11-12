/**
 * Internal dependencies.
 */
import AlbumComponent from './Album';

/**
 * Types
 */
import { Album } from '../models/types';

type ListProps = {
  id: 'listening' | 'liked-albums' | 'disliked-albums';
  heading: string;
  albums: Album[];
  onAlbumUpdate: () => Promise<void>;
}

export default function List({
  id, heading, albums, onAlbumUpdate,
}: ListProps) {
  return (
    <div id={ id }>
      <h2>{heading}</h2>
      <ul className="">
        {albums.map((album, index) => (
          <AlbumComponent key={index} album={album} onAlbumUpdate={onAlbumUpdate} />
        ))}
      </ul>
    </div>
  );
}
