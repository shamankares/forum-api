const AddedComment = require('../AddedComment');

describe('a AddedComment entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payloadWithoutId = {
      content: 'Sebuah komentar.',
      owner: 'user-123',
    };
    const payloadWithoutContent = {
      id: 'comment-123',
      owner: 'user-123',
    };
    const payloadWithoutOwner = {
      id: 'comment-123',
      content: 'Sebuah komentar.',
    };

    expect(() => new AddedComment(payloadWithoutId)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new AddedComment(payloadWithoutContent)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new AddedComment(payloadWithoutOwner)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 123,
      content: true,
      owner: 'user-123',
    };

    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addedComment object correctly', () => {
    const payload = {
      id: 'comment-123',
      content: 'Sebuah komentar.',
      owner: 'user-123',
    };

    const addedComment = new AddedComment(payload);

    expect(addedComment.id).toStrictEqual(payload.id);
    expect(addedComment.content).toStrictEqual(payload.content);
    expect(addedComment.owner).toStrictEqual(payload.owner);
  });
});
