const pool = require('../../database/postgres/pool');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');

const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

const NewComment = require('../../../Domains/comments/entities/NewComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const PostedComment = require('../../../Domains/comments/entities/PostedComment');

const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('CommentRepositoryProgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });
  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist new comment', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';

      await UsersTableTestHelper.addUser({ username: userId });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });

      const newComment = new NewComment(userId, threadId, {
        content: 'Sebuah komentar.',
      });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addComment(newComment);

      // Assert
      const result = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(result).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';

      await UsersTableTestHelper.addUser({ username: userId });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });

      const newComment = new NewComment(userId, threadId, {
        content: 'Sebuah komentar.',
      });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const result = await commentRepositoryPostgres.addComment(newComment);

      // Assert
      expect(result).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: 'Sebuah komentar.',
        owner: 'user-123',
      }));
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw NotFoundError when the comment not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      
      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('invalid-comment', 'user-123'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should throw AuthorizationError when the user is not the comment owner', async () => {
      // Arrange
      const user1 = {
        id: 'user-123',
        username: 'user1',
      };
      const user2 = {
        id: 'user-456',
        username: 'user2',
      };
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      await UsersTableTestHelper.addUser({ ...user1 });
      await UsersTableTestHelper.addUser({ ...user2 });

      await ThreadsTableTestHelper.addThread({ id: threadId, owner: user1.id });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: user1.id });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      
      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner(commentId, user2.id))
        .rejects
        .toThrowError(AuthorizationError);
    });

    it('should NOT throw NotFoundError when the comment found', async () => {
      // Arrange
      const threadId = 'thread-123';
      const userId = 'user-123';
      const commentId = 'comment-123';

      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        threadId,
        content: 'Sebuah komentar',
        owner: userId,
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      
      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner(commentId, userId))
        .resolves
        .not.toThrowError(NotFoundError);
    });

    it('should NOT throw AuthorizationError when the user is the comment owner', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      await UsersTableTestHelper.addUser({ id: userId });

      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: userId });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      
      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner(commentId, userId))
        .resolves
        .not.toThrowError(AuthorizationError);
    });
  });

  describe('deleteComment', () => {
    it('should soft delete and preserve the deleted comment', async () => {
      // Arrange
      const threadId = 'thread-123';
      const userId = 'user-123';
      const commentId = 'comment-123';

      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        threadId,
        content: 'Sebuah komentar',
        owner: userId,
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      
      // Action
      await commentRepositoryPostgres.deleteComment(commentId);
      
      // Assert
      const result = await CommentsTableTestHelper.findCommentById(commentId);
      expect(result).not.toHaveLength(0);
      expect(result[0]['is_deleted']).toEqual(true);
    });
  });

  describe('getCommentsByThreadId', () => {
    it('should return an array of PostedComments', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';
      await UsersTableTestHelper.addUser({ id: userId });

      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: 'comment-456', threadId, owner: userId });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const result = await commentRepositoryPostgres.getCommentsByThreadId(threadId);

      expect(result).toBeInstanceOf(Array);
      result.forEach((element) => {
        expect(element).toBeInstanceOf(PostedComment);
      });
    });

    it('should return an empty array if there is no comment', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';
      await UsersTableTestHelper.addUser({ id: userId });

      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const result = await commentRepositoryPostgres.getCommentsByThreadId(threadId);

      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('getCommentById', () => {
    it('should throw error when the comment not found', async () => {
      // Arrange
      const commentRepository = new CommentRepositoryPostgres(pool);
      const commentId = 'invalidID';

      // Action & Assert
      await expect(commentRepository.getCommentById(commentId))
        .rejects.toThrow(NotFoundError);
    });

    it('should NOT throw error when the comment is found', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      await UsersTableTestHelper.addUser({ username: userId });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: userId });

      const commentRepository = new CommentRepositoryPostgres(pool);

      // Action & Assert
      await expect(commentRepository.getCommentById(commentId))
        .resolves.not.toThrow(NotFoundError);
    });

    it('should return a PostedComment if found the comment', async () => {
      // Arrange
      const userId = 'user-123';
      const username = 'dicoding';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const content = 'Sebuah komentar.';
      await UsersTableTestHelper.addUser({ id: userId, username });

      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: userId, content });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const result = await commentRepositoryPostgres.getCommentById(commentId);

      expect(result).toBeInstanceOf(PostedComment);
      expect(result.id).toStrictEqual(commentId);
      expect(result.username).toStrictEqual(username);
      expect(result.content).toStrictEqual(content);
    });
  });
});
