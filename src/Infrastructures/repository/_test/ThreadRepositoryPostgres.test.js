const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');

const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');

const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryProgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });
  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist new thread', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'user-123' });
      const newThread = new NewThread('user-123', {
        title: 'Judul Thread',
        body: 'Sebuah utasan',
      });
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread(newThread);

      // Assert
      const result = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(result).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'user-123' });
      const newThread = new NewThread('user-123', {
        title: 'Judul Thread',
        body: 'Sebuah utasan',
      });
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const result = await threadRepositoryPostgres.addThread(newThread);

      // Assert
      expect(result).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: 'Judul Thread',
        owner: 'user-123',
      }));
    });
  });

  describe('getThreadById function', () => {
    it('should throw NotFoundError when the thread ID is not found', async () => {
      // Arrange
      const threadRepository = new ThreadRepositoryPostgres(pool);
      const threadId = 'invalidID';

      // Action & Assert
      await expect(threadRepository.getThreadById(threadId))
        .rejects.toThrow(NotFoundError);
    });

    it('should NOT throw NotFoundError when the thread ID is found', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';
      await UsersTableTestHelper.addUser({ username: userId });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });

      const threadRepository = new ThreadRepositoryPostgres(pool);

      // Action & Assert
      await expect(threadRepository.getThreadById(threadId))
        .resolves.not.toThrow(NotFoundError);
    });

    it('should return the thread properties', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';
      await UsersTableTestHelper.addUser({ username: userId });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });

      const threadRepository = new ThreadRepositoryPostgres(pool);

      // Action
      const result = await threadRepository.getThreadById(threadId);

      // Assert
      expect(Object.keys(result)).toEqual(expect.arrayContaining(['id', 'username', 'title', 'body', 'date']));
    });
  });
});
