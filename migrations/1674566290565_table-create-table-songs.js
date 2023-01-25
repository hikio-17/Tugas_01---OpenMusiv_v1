exports.up = (pgm) => {
  pgm.createTable('songs', {
    song_id: {
      type: 'VARCHAR(30)',
      primaryKey: true,
    },
    title: {
      type: 'TEXT',
      notNull: true,
    },
    year: {
      type: 'INT',
      notNull: true,
    },
    genre: {
      type: 'TEXT',
      notNull: true,
    },
    performer: {
      type: 'TEXT',
      notNull: true,
    },
    duration: {
      type: 'INT',
    },
    album_id: {
      type: 'VARCHAR(50)',
      references: 'albums',
      onDelete: 'cascade',
      onUpdate: 'cascade',
    },
  });

  pgm.createIndex('songs', 'album_id');
};

exports.down = (pgm) => {
  pgm.dropTable('songs');
};
