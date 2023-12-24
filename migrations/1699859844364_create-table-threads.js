/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('threads', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    title: {
      type: 'TEXT',
      notNull: true,
    },
    body: {
      type: 'TEXT',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    date: {
      type: 'TIMESTAMP',
      default: pgm.func('CURRENT_TIMESTAMP'),
    },
  });

  pgm.addConstraint(
    'threads',
    'fk_(threads.owner)_(users.id)',
    'FOREIGN KEY(owner) REFERENCES users(id)'
  );
};

exports.down = (pgm) => {
  pgm.dropTable('threads');
};
