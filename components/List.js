import Image from 'next/image'

import placeholder from '../public/placeholder.png'
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
							<div className="img-container">
							<Image
								width={150}
								height={150}
								src={
									album.image && '' !== album.image ?
									album.image :
									placeholder
								}
								alt=''
							/>
							</div>
							
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