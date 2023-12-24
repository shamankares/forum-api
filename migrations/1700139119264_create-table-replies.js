/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('replies', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    comment_id: {
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
    'replies',
    'fk_(replies.comment_id)_(comments.id)',
    'FOREIGN KEY(comment_id) REFERENCES comments(id)'
  );
  pgm.addConstraint(
    'replies',
    'fk_(replies.owner)_(users.id)',
    'FOREIGN KEY(owner) REFERENCES users(id)'
  );
};

exports.down = (pgm) => {
  pgm.dropTable('replies');
};
