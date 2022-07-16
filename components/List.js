import Album from './Album';

export default function List({
  id, heading, albums, onAlbumUpdate,
}) {
  return (
    <div id={ id }>
      <h2>{heading}</h2>
      <ul className="">
        {albums.map((album, index) => (
          <Album key={index} album={album} onAlbumUpdate={onAlbumUpdate} />
        ))}
      </ul>
    </div>
  );
}
