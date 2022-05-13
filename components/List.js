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
				{albums.map((album, index) => {
					return (
						<li className={styles.item} key={index}>
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