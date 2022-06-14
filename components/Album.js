import Image from "next/image";

import placeholder from "../public/placeholder.png";
import LikedIcon from "./icons/Liked";
import DislikedIcon from "./icons/Disliked";
import UpdateIcon from "./icons/Update";
import DeleteIcon from "./icons/Delete";
import styles from "../styles/List.module.css";

const Album = ({ album, onChange }) => {
  const updateStatus = async (status) => {
    const response = await fetch("/api/update/", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: album._id,
        status,
      }),
    });

    if (response.ok) {
      onChange();
    }
  };

  return (
    <li className={styles.item}>
      <div className="img-container">
        <Image
          width={150}
          height={150}
          src={album.image && album.image !== "" ? album.image : placeholder}
          alt=""
        />
      </div>

      <h2>{album.name}</h2>
      <p>{album.album}</p>
      <p className={styles.modify}>
        <button className={styles.button} onClick={() => updateStatus("liked")}>
          <LikedIcon />
        </button>
        <button
          className={styles.button}
          onClick={() => updateStatus("disliked")}
        >
          <DislikedIcon />
        </button>
        <UpdateIcon />
        <DeleteIcon />
      </p>
    </li>
  );
};

export default Album;
