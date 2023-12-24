const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const AddedThread = require('../../Domains/threads/entities/AddedThread');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(newThread) {
    const { title, body, owner } = newThread;
    const id = `thread-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, owner',
      values: [id, title, body, owner],
    };

    const result = await this._pool.query(query);

    return new AddedThread({ ...result.rows[0] });
  }

  async getThreadById(threadId) {
    const query = {
      text: `SELECT threads.*, users.username
             FROM threads
             LEFT JOIN users ON users.id=threads.owner
             WHERE threads.id=$1`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread ID tidak valid');
    }

    const { id, username, title, body, date } = result.rows[0];
    return { id, username, title, body, date };
  }
}

module.exports = ThreadRepositoryPostgres;