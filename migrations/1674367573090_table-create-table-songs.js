exports.up = pgm => {
   pgm.createTable('songs', {
      id: {
         type: 'VARCHAR(30)',
         primaryKey: true,
      },
      title: {
         type: 'TEXT',
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
         notNull: true,
      },
      albumId: {
         type: 'TEXT',
         notNull: true,
         foreignKey: '"albums(album_id)"',
         references: '"albums"'
      }
   })
};

exports.down = pgm => {
   pgm.dropTable('songs1')
};
