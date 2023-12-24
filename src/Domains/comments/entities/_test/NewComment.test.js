const NewComment = require('../NewComment');

describe('a NewComment entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {};
    const userId = 'user-123';
    const threadId = 'thread-123';

    expect(() => new NewComment(userId, threadId, payload)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const userId = 123;
    const threadId = 345;
    const payload = {
      content: 231,
    };

    expect(() => new NewComment(userId, threadId, payload)).toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create newComment object correctly', () => {
    const userId = 'user-123';
    const threadId = 'thread-123';
    const payload = {
      content: 'Sebuah komentar.',
    };

    const newComment = new NewComment(userId, threadId, payload);

    expect(newComment.threadId).toStrictEqual(threadId);
    expect(newComment.content).toStrictEqual(payload.content);
    expect(newComment.owner).toStrictEqual(userId);
  });
});