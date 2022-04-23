/**
 * External Dependencies.
 */
import dateFns from 'date-fns';

/**
 * Authentication Check.
 */
export function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/read-only');
}

export function checkDbAccess(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized access. Please log in.' });
}

/**
 * Not Authentication Check.
 */
export function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  return next();
}

/**
 * Get all albums on current lists.
 */
export async function getCurrentListData(db) {
  const current = await db.find(
    {
      status: { $in: ['none', null] },
      is_archive: { $exists: false },
    },
  )
    .toArray();
  const liked = await db.find(
    {
      status: 'liked',
      is_archive: { $exists: false },
    },
  )
    .toArray();
  const disliked = await db.find(
    {
      status: 'disliked',
      is_archive: { $exists: false },
    },
  )
    .toArray();

  const archive = await db.find(
    {
      archive_date: { $exists: true },
    },
    {
      projection: { _id: 0, archive_date: 1 },
    },
  )
    .toArray();
  const archiveDates = {};
  archive.map((album) => {
    archiveDates[album.archive_date] = dateFns.format(album.archive_date, 'MMMM do, y');
    return album;
  });
  return {
    current,
    liked,
    disliked,
    archive,
  };
}
