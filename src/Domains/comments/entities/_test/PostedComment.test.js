const PostedComment = require('../PostedComment');

describe('a PostedComment entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payloadWithoutId = {
      username: 'johndoe',
      date: new Date().toISOString(),
      content: 'Sebuah komentar.',
      isDeleted: false,
    };
    const payloadWithoutUsername = {
      id: 'comment-123',
      date: new Date().toISOString(),
      content: 'Sebuah komentar.',
      isDeleted: false,
    };
    const payloadWithoutDate = {
      id: 'comment-123',
      username: 'johndoe',
      content: 'Sebuah komentar.',
      isDeleted: false,
    };
    const payloadWithoutContent = {
      id: 'comment-123',
      username: 'johndoe',
      date: new Date().toISOString(),
      isDeleted: false,
    };

    expect(() => new PostedComment(payloadWithoutId)).toThrowError('POSTED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new PostedComment(payloadWithoutUsername)).toThrowError('POSTED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new PostedComment(payloadWithoutDate)).toThrowError('POSTED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new PostedComment(payloadWithoutContent)).toThrowError('POSTED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 123,
      username: 'johndoe',
      date: '2019-05-14',
      content: 55555,
      isDeleted: false,
    };
    const payloadInvalidDate = {
      id: 'comment-123',
      username: 'johndoe',
      date: '24 nopember',
      content: 'Sebuah komentar.',
      isDeleted: false,
    };

    expect(() => new PostedComment(payload)).toThrowError('POSTED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new PostedComment(payloadInvalidDate)).toThrowError('POSTED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create postedComment object correctly', () => {
    const payload = {
      id: 'comment-123',
      username: 'johndoe',
      date: new Date().toISOString(),
      content: 'Sebuah komentar.',
      isDeleted: false,
    };

    const postedComment = new PostedComment(payload);

    expect(postedComment.id).toStrictEqual(payload.id);
    expect(postedComment.content).toStrictEqual(payload.content);
    expect(postedComment.owner).toStrictEqual(payload.owner);
  });

  it('should create postedComment object correctly', () => {
    const payload = {
      id: 'comment-123',
      username: 'johndoe',
      date: new Date().toISOString(),
      content: 'Sebuah komentar.',
      isDeleted: false,
    };

    const postedComment = new PostedComment(payload);

    expect(postedComment.id).toStrictEqual(payload.id);
    expect(postedComment.content).toStrictEqual(payload.content);
    expect(postedComment.owner).toStrictEqual(payload.owner);
  });

  it('should create postedComment object with deleted comment correctly', () => {
    const payload = {
      id: 'comment-123',
      username: 'johndoe',
      date: new Date().toISOString(),
      content: 'Sebuah komentar.',
      isDeleted: true,
    };

    const postedComment = new PostedComment(payload);

    expect(postedComment.id).toStrictEqual(payload.id);
    expect(postedComment.content).toStrictEqual('**komentar telah dihapus**');
    expect(postedComment.owner).toStrictEqual(payload.owner);
  });
});
