const ReplyRepository = require('../../../../Domains/replies/ReplyRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');

const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should orchestrating delete comment action correctly', async () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const replyId = 'reply-123';

    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    
    mockReplyRepository.verifyReplyOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReply = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    
    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await deleteReplyUseCase.execute(userId, threadId, commentId, replyId);

    // Assert
    expect(mockReplyRepository.verifyReplyOwner).toBeCalledWith(replyId, userId);
    expect(mockReplyRepository.deleteReply).toBeCalledWith(replyId);
    expect(mockCommentRepository.getCommentById).toBeCalledWith(commentId);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
  });
});
