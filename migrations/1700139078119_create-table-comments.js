/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('comments', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    thread_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    content: {
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
    is_deleted: {
      type: 'BOOLEAN',
      default: false,
    },
  });

  pgm.addConstraint(
    'comments',
    'fk_(comments.thread_id)_(threads.id)',
    'FOREIGN KEY(thread_id) REFERENCES threads(id)',
  );
  pgm.addConstraint(
    'comments',
    'fk_(comments.owner)_(users.id)',
    'FOREIGN KEY(owner) REFERENCES users(id)',
  );
};

exports.down = (pgm) => {
  pgm.dropTable('comments');
};
