/* eslint-disable camelcase */
const mapSongsDBToModel = ({ song_id, title, performer }) => ({
  id: song_id, title, performer,
});

module.exports = { mapSongsDBToModel };
