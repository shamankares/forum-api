const ReplyRepository = require('../../../../Domains/replies/ReplyRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const NewReply = require('../../../../Domains/replies/entities/NewReply');
const AddedReply = require('../../../../Domains/replies/entities/AddedReply');

const AddReplyUseCase = require('../AddReplyUseCase');

describe('AddReplyUseCase', () => {
  it('should orchestrating add reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'Sebuah balasan.',
    };
    const userId = 'user-123';
    const commentId = 'comment-123';
    const threadId = 'thread-123';

    const mockAddedReply = new AddedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: userId,
    });

    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    
    mockReplyRepository.addReply = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedReply));
    mockCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    
    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedReply = await addReplyUseCase.execute(userId, threadId, commentId, useCasePayload);

    // Assert
    expect(addedReply).toEqual(new AddedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: userId,
    }));
    expect(mockReplyRepository.addReply).toBeCalledWith(new NewReply(userId, commentId, useCasePayload));
    expect(mockCommentRepository.getCommentById).toBeCalledWith(commentId);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
  });
});
