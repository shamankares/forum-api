const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../../Domains/replies/ReplyRepository');

const PostedThread = require('../../../../Domains/threads/entities/PostedThread');
const PostedComment = require('../../../../Domains/comments/entities/PostedComment');
const PostedReply = require('../../../../Domains/replies/entities/PostedReply');

const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetThreadUseCase', () => {
  it('should orchestrating get thread details action correctly', async () => {
    // Arrange
    const threadId = 'thread-123';
    const dateThread = new Date('2023-11-20').toISOString();
    const dateComment1 = new Date('2023-11-25').toISOString();
    const dateReply1 = new Date('2023-12-05').toISOString();

    const mockThread = {
      id: threadId,
      title: 'Judul Thread',
      body: 'Sebuah utasan',
      date: dateThread,
      username: 'user1',
    };
    const mockPostedComments = [
      new PostedComment({
        id: 'comment-123',
        date: dateComment1,
        username: 'user2',
        content: 'Sebuah komentar.',
        isDeleted: false,
      }),
    ];
    const mockPostedReplies = [
      new PostedReply({
        id: 'reply-456',
        date: dateReply1,
        username: 'user2',
        content: 'Sebuah balasan.',
        isDeleted: false,
      }),
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThread));
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockPostedComments));
    mockReplyRepository.getRepliesByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockPostedReplies));
    
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const getThread = await getThreadUseCase.execute(threadId);

    // Assert
    expect(getThread).toEqual(new PostedThread(mockThread, [
      {
        id: 'comment-123',
        date: dateComment1,
        username: 'user2',
        content: 'Sebuah komentar.',
        replies: [
          new PostedReply({
            id: 'reply-456',
            date: dateReply1,
            username: 'user2',
            content: 'Sebuah balasan.',
            isDeleted: false,
          }),
        ],
      },
    ]));
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(threadId);
    expect(mockReplyRepository.getRepliesByCommentId).toBeCalledWith(mockPostedComments[0].id);
  });
});
