const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const NewComment = require('../../../../Domains/comments/entities/NewComment');
const AddedComment = require('../../../../Domains/comments/entities/AddedComment');

const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should orchestrating add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'Sebuah komentar.',
    };
    const userId = 'user-123';
    const threadId = 'thread-123';

    const mockAddedComment = new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: userId,
    });

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment));
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    
    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedComment = await addCommentUseCase.execute(userId, threadId, useCasePayload);

    // Assert
    expect(addedComment).toEqual(new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: userId,
    }));
    expect(mockCommentRepository.addComment).toBeCalledWith(new NewComment(userId, threadId, useCasePayload));
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
  });
});
