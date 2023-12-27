const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');

const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

const NewReply = require('../../../Domains/replies/entities/NewReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const PostedReply = require('../../../Domains/replies/entities/PostedReply');

const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('ReplyRepositoryProgres', () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });
  afterAll(async () => {
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist new reply', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';

      await UsersTableTestHelper.addUser({ username: userId });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: userId });

      const newReply = new NewReply(userId, commentId, {
        content: 'Sebuah balasan.',
      });
      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await replyRepositoryPostgres.addReply(newReply);

      // Assert
      const result = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(result).toHaveLength(1);
    });

    it('should return added reply correctly', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';

      await UsersTableTestHelper.addUser({ username: userId });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: userId });

      const newReply = new NewReply(userId, commentId, {
        content: 'Sebuah balasan.',
      });
      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const result = await replyRepositoryPostgres.addReply(newReply);

      // Assert
      expect(result).toStrictEqual(new AddedReply({
        id: 'reply-123',
        content: 'Sebuah balasan.',
        owner: 'user-123',
      }));
    });
  });

  describe('verifyReplyOwner function', () => {
    it('should throw NotFoundError when the reply not found', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      
      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyOwner('invalid-reply', 'user-123'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should throw AuthorizationError when the user is not the reply owner', async () => {
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
      const replyId = 'reply-123';
      await UsersTableTestHelper.addUser({ ...user1 });
      await UsersTableTestHelper.addUser({ ...user2 });

      await ThreadsTableTestHelper.addThread({ id: threadId, owner: user1.id });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: user1.id });
      await RepliesTableTestHelper.addReply({ id: replyId, commentId, owner: user1.id });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      
      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyOwner(replyId, user2.id))
        .rejects
        .toThrowError(AuthorizationError);
    });

    it('should NOT throw NotFoundError when the comment found', async () => {
      // Arrange
      const threadId = 'thread-123';
      const userId = 'user-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';

      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: userId });
      await RepliesTableTestHelper.addReply({
        id: replyId,
        commentId,
        content: 'Sebuah balasan',
        owner: userId,
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      
      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyOwner(replyId, userId))
        .resolves
        .not.toThrowError(NotFoundError);
    });

    it('should NOT throw AuthorizationError when the user is the comment owner', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';
      await UsersTableTestHelper.addUser({ id: userId });

      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: userId });
      await RepliesTableTestHelper.addReply({ id: replyId, commentId, threadId, owner: userId });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      
      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyOwner(replyId, userId))
        .resolves
        .not.toThrowError(AuthorizationError);
    });
  });

  describe('deleteReply', () => {
    it('should soft delete and preserve the deleted comment', async () => {
      // Arrange
      const threadId = 'thread-123';
      const userId = 'user-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';

      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: userId });
      await RepliesTableTestHelper.addReply({
        id: replyId,
        threadId,
        content: 'Sebuah balasan',
        owner: userId,
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      
      // Action
      await replyRepositoryPostgres.deleteReply(replyId);
      
      // Assert
      const result = await RepliesTableTestHelper.findReplyById(replyId);
      expect(result).not.toHaveLength(0);
      expect(result[0]['is_deleted']).toEqual(true);
    });
  });

  describe('getRepliesByCommentId', () => {
    it('should return an array of PostedReply(-ies)', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      await UsersTableTestHelper.addUser({ id: userId });

      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: userId });
      await RepliesTableTestHelper.addReply({ id: 'reply-123', commentId, threadId, owner: userId });
      await RepliesTableTestHelper.addReply({ id: 'reply-456', commentId, threadId, owner: userId });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      const result = await replyRepositoryPostgres.getRepliesByCommentId(commentId);

      expect(result).toBeInstanceOf(Array);
      result.forEach((element) => {
        expect(element).toBeInstanceOf(PostedReply);
      });
    });
  });
});
