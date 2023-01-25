/* eslint-disable max-len */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapSongsDBToModel } = require('../../utils/mapSongsDBToModel');
const { mapSongDBToModel } = require('../../utils/mapSongDBToModel');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({
    title, year, genre, performer, duration, albumId,
  }) {
    const id = nanoid(16);

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING song_id',
      values: [id, title, year, genre, performer, duration, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].song_id) {
      throw new InvariantError('Song gagal ditambahkan');
    }

    return result.rows[0].song_id;
  }

  async getSongs({ title, performer }) {
    const result = await this._pool.query('SELECT song_id, title, performer FROM songs');

    const songs = result.rows;

    if (title !== undefined && performer !== undefined) {
      const songsFilter = songs.filter((song) => song.title.toLowerCase().includes(title.toLowerCase()) && song.performer.toLowerCase().includes(performer.toLowerCase()));

      return songsFilter.map(mapSongsDBToModel);
    }

    if (title !== undefined) {
      const songsByTitle = songs.filter((song) => song.title.toLowerCase().includes(title.toLowerCase()));

      return songsByTitle.map(mapSongsDBToModel);
    }

    if (performer !== undefined) {
      const songsByPerformer = songs.filter((song) => song.performer.toLowerCase().includes(performer.toLowerCase()));

      return songsByPerformer.map(mapSongsDBToModel);
    }

    return songs.map(mapSongsDBToModel);
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE song_id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Song tidak ditemukan');
    }
    return result.rows.map(mapSongDBToModel)[0];
  }

  async editSongById(id, {
    title, year, genre, performer, duration, albumId,
  }) {
    const query = {
      text: 'UPDATE songs set title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6 WHERE song_id = $7 RETURNING song_id',
      values: [title, year, genre, performer, duration, albumId, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui song, Id tidak ditemukan');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE song_id = $1 RETURNING song_id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus song, Id tidak ditemukan');
    }
  }
}

module.exports = SongsService;
