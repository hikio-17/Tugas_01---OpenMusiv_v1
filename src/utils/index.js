/* eslint-disable camelcase */
const mapdDBToModel = ({ album_id, name, year }) => ({
  id: album_id, name, year, songs: [],
});

module.exports = { mapdDBToModel };
