/**
 * External dependencies.
 */
import Image from 'next/image';
import { useUser } from '@auth0/nextjs-auth0';

/**
 * Internal dependencies.
 */
import placeholder from '../../public/placeholder.png';
import LikedIcon from './icons/Liked';
import DislikedIcon from './icons/Disliked';
import DeleteIcon from './icons/Delete';

/**
 * Types
 */
import { Album, Status } from '../models/types';

export type AlbumProps = {
  album: Album;
  onAlbumUpdate: () => Promise<void>;
};

const Album = ({
  album, onAlbumUpdate,
}: AlbumProps) => {
  // Get user information.
  const {
    user, isLoading,
  } = useUser();

  const isLoggedIn = user && !isLoading;

  const updateStatus = async (status: Status): Promise<void> => {
    const endpoint = status === 'delete' ? 'delete' : 'update';
    const response = await fetch(`/api/${endpoint}/`,
      {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: album._id,
          status: status === album.status ? 'none' : status,
        }),
      });

    if (response.ok) {
      onAlbumUpdate();
    }
  };

  return (
    <li className="album-card">
      <div className="img-container">
        <Image
          className="album-cover"
          width={500}
          height={500}
          src={album.image && album.image !== '' ? album.image : placeholder}
          alt=""
        />
      </div>

      <h3 className="album-name">{album.album}</h3>
      <p className="artist-name">{album.name}</p>
      { isLoggedIn && (
      <p className="album-status">
        <button
          className="svg like"
          onClick={() => updateStatus('liked')}
        >
          <LikedIcon />
        </button>
        <button
          className="svg dislike"
          onClick={() => updateStatus('disliked')}
        >
          <DislikedIcon />
        </button>
        <button
          className="svg delete"
          onClick={() => updateStatus('delete')}
        >
          <DeleteIcon />
        </button>
      </p>
      )}
    </li>
  );
};

export default Album;
