import Album from './Album';

export default function List({
  heading, albums, onAlbumUpdate,
}) {
  return (
    <div className="">
      <h2 className="container">{heading}</h2>
      <ul className="">
        {albums.map((album, index) => (
          <Album key={index} album={album} onAlbumUpdate={onAlbumUpdate} />
        ))}
      </ul>
    </div>
  );
}
