import styles from '../styles/List.module.css';
import Album from './Album';

export default function List({
  heading, albums, onChange,
}) {
  return (
    <div className={styles.container}>
      <h2 className="container">{heading}</h2>
      <ul className={styles.grid}>
        <li className={styles.head}>
          <p></p>
          <p>Artwork</p>
          <p>Artist</p>
          <p>Album</p>
          <p></p>
        </li>
        {albums.map((album, index) => (
          <Album key={index} album={album} onChange={onChange} />
        ))}
      </ul>
    </div>
  );
}
