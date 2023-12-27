const NewReply = require('../NewReply');

describe('a NewReply entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {};
    const userId = 'user-123';
    const commentId = 'comment-123';

    expect(() => new NewReply(userId, commentId, payload)).toThrowError('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const userId = 123;
    const commentId = 345;
    const payload = {
      content: 231,
    };

    expect(() => new NewReply(userId, commentId, payload)).toThrowError('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create newReply object correctly', () => {
    const userId = 'user-123';
    const commentId = 'comment-123';
    const payload = {
      content: 'Sebuah balasan.',
    };

    const newReply = new NewReply(userId, commentId, payload);

    expect(newReply.commentId).toStrictEqual(commentId);
    expect(newReply.content).toStrictEqual(payload.content);
    expect(newReply.owner).toStrictEqual(userId);
  });
});
