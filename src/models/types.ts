export type Album = {
  _id: string;
  album: string;
  image: string;
  name: string;
  status: string;
};
export type Status = 'liked' | 'disliked' | 'delete';