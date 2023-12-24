const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');

const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating delete comment action correctly', async () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'thread-123';

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    
    mockCommentRepository.verifyCommentOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await deleteCommentUseCase.execute(userId, threadId, commentId);

    // Assert
    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(commentId, userId);
    expect(mockCommentRepository.deleteComment).toBeCalledWith(commentId);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
  });
});
