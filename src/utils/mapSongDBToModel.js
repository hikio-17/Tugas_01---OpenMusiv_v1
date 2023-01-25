/* eslint-disable camelcase */
const mapSongDBToModel = ({
  song_id, title, year, genre, performer, duration, album_id,
}) => ({
  id: song_id, title, year, genre, performer, duration, albumId: album_id,
});

module.exports = { mapSongDBToModel };
