import styles from '../styles/List.module.css'
import LikedIcon from './icons/Liked'
import DislikedIcon from './icons/Disliked'
import UpdateIcon from './icons/Update'
import DeleteIcon from './icons/Delete'

export default function List({heading, albums}) {
	return (
		<div className={styles.container}>
			<h2>{ heading }</h2>
			<ul className={styles.grid}>
				<li className={styles.head}>
					<p></p>
					<p>Artwork</p>
					<p>Artist</p>
					<p>Album</p>
					<p></p>
				</li>
				{albums.map((album, index) => {
					return (
						<li className={styles.item} key={index}>
							<p>Artwork</p>
							<h2>{album.name}</h2>
							<p>{album.album}</p>
							<p>
								<LikedIcon />
								<DislikedIcon />
								<UpdateIcon />
								<DeleteIcon />
							</p>
						</li>
					);
				})}
			</ul>
		</div>
	)
}