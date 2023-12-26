const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const Mapper = require('../../Commons/utilities/Mapper');

const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const PostedComment = require('../../Domains/comments/entities/PostedComment');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment) {
    const { threadId, content, owner } = newComment;
    const id = `comment-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, threadId, content, owner],
    };

    const result = await this._pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }

  async verifyCommentOwner(commentId, userId) {
    const query = {
      text: 'SELECT * FROM comments WHERE id=$1',
      values: [commentId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('comment ID tidak valid');
    }

    const { owner } = result.rows[0];
    if (owner !== userId) {
      throw new AuthorizationError('bukan pemilik komentar');
    }
  }

  async getCommentById(commentId) {
    const query = {
      text: `SELECT comments.*, users.username
             FROM comments
             LEFT JOIN users ON users.id=comments.owner
             WHERE comments.id=$1`,
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('comment ID tidak valid');
    }

    return new PostedComment(Mapper.mapComment({ ...result.rows[0] }));
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `SELECT comments.*, users.username
             FROM comments
             LEFT JOIN users ON users.id=comments.owner
             WHERE comments.thread_id=$1`,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return result.rows.map((comment) => {
      return new PostedComment(Mapper.mapComment(comment));
    });
  }

  async deleteComment(commentId) {
    const query = {
      text: 'UPDATE comments SET is_deleted=TRUE WHERE id=$1',
      values: [commentId],
    };

    await this._pool.query(query);
  }
}

module.exports = CommentRepositoryPostgres;