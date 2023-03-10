const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapdDBToModel } = require('../../utils');

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = nanoid(16);

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING album_id',
      values: [id, name, year],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].album_id) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].album_id;
  }

  async getAlbumById(id) {
    const query = {
      text: 'SELECT * FROM albums NATURAL JOIN songs WHERE songs.album_id = $1 ',
      values: [id],
    };

    const query1 = {
      text: 'SELECT * FROM albums WHERE album_id = $1',
      values: [id],
    };

    const albumWithSongs = await this._pool.query(query);

    const albumById = await this._pool.query(query1);

    const listSongs = [];

    const album = albumById.rows.map(mapdDBToModel)[0];

    albumWithSongs.rows.map((s) => listSongs.push({
      id: s.song_id,
      title: s.title,
      performer: s.performer,
    }));

    const data = {
      ...album,
      songs: listSongs,
    };

    if (!data.songs.length && albumById.rows.length) {
      return albumById.rows.map(mapdDBToModel)[0];
    }

    if (!data.songs.length && !albumById.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    return data;
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: 'UPDATE albums set name = $1, year = $2 WHERE album_id = $3 RETURNING album_id',
      values: [name, year, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE album_id = $1 RETURNING album_id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = AlbumsService;
