const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');

const PostedThread = require('../../../../Domains/threads/entities/PostedThread');
const PostedComment = require('../../../../Domains/comments/entities/PostedComment');

const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetThreadUseCase', () => {
  it('should orchestrating get thread details action correctly', async () => {
    // Arrange
    const threadId = 'thread-123';
    const dateThread = new Date('2023-11-20').toISOString();
    const dateComment1 = new Date('2023-11-23').toISOString();
    const dateComment2 = new Date('2023-11-25').toISOString();

    const mockThread = {
      id: threadId,
      title: 'Judul Thread',
      body: 'Sebuah utasan',
      date: dateThread,
      username: 'user1',
    };
    const mockPostedComments = [
      new PostedComment({
        id: 'comment-456',
        date: dateComment2,
        username: 'user2',
        content: 'Sebuah komentar.',
        isDeleted: false,
      }),
      new PostedComment({
        id: 'comment-123',
        date: dateComment1,
        username: 'user2',
        content: 'Sebuah komentar.',
        isDeleted: false,
      }),
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThread));
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockPostedComments));
    
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const getThread = await getThreadUseCase.execute(threadId);

    // Assert
    expect(getThread).toEqual(new PostedThread(mockThread, [
      new PostedComment({
        id: 'comment-123',
        date: dateComment1,
        username: 'user2',
        content: 'Sebuah komentar.',
        isDeleted: false,
      }),
      new PostedComment({
        id: 'comment-456',
        date: dateComment2,
        username: 'user2',
        content: 'Sebuah komentar.',
        isDeleted: false,
      }),
    ]));
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(threadId);
  });
});
