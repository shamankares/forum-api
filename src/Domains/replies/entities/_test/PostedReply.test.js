const PostedReply = require('../PostedReply');

describe('a PostedReply entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payloadWithoutId = {
      username: 'johndoe',
      date: new Date().toISOString(),
      content: 'Sebuah balasan.',
      isDeleted: false,
    };
    const payloadWithoutUsername = {
      id: 'reply-123',
      date: new Date().toISOString(),
      content: 'Sebuah balasan.',
      isDeleted: false,
    };
    const payloadWithoutDate = {
      id: 'reply-123',
      username: 'johndoe',
      content: 'Sebuah balasan.',
      isDeleted: false,
    };
    const payloadWithoutContent = {
      id: 'reply-123',
      username: 'johndoe',
      date: new Date().toISOString(),
      isDeleted: false,
    };

    expect(() => new PostedReply(payloadWithoutId)).toThrowError('POSTED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new PostedReply(payloadWithoutUsername)).toThrowError('POSTED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new PostedReply(payloadWithoutDate)).toThrowError('POSTED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new PostedReply(payloadWithoutContent)).toThrowError('POSTED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
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
      id: 'reply-123',
      username: 'johndoe',
      date: '24 nopember',
      content: 'Sebuah balasan.',
      isDeleted: false,
    };

    expect(() => new PostedReply(payload)).toThrowError('POSTED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new PostedReply(payloadInvalidDate)).toThrowError('POSTED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create postedReply object correctly', () => {
    const payload = {
      id: 'reply-123',
      username: 'johndoe',
      date: new Date().toISOString(),
      content: 'Sebuah balasan.',
      isDeleted: false,
    };

    const postedReply = new PostedReply(payload);

    expect(postedReply.id).toStrictEqual(payload.id);
    expect(postedReply.content).toStrictEqual(payload.content);
    expect(postedReply.owner).toStrictEqual(payload.owner);
  });

  it('should create postedReply object correctly', () => {
    const payload = {
      id: 'reply-123',
      username: 'johndoe',
      date: new Date().toISOString(),
      content: 'Sebuah balasan.',
      isDeleted: false,
    };

    const postedReply = new PostedReply(payload);

    expect(postedReply.id).toStrictEqual(payload.id);
    expect(postedReply.content).toStrictEqual(payload.content);
    expect(postedReply.owner).toStrictEqual(payload.owner);
  });

  it('should create postedReply object with deleted reply correctly', () => {
    const payload = {
      id: 'reply-123',
      username: 'johndoe',
      date: new Date().toISOString(),
      content: 'Sebuah balasan.',
      isDeleted: true,
    };

    const postedReply = new PostedReply(payload);

    expect(postedReply.id).toStrictEqual(payload.id);
    expect(postedReply.content).toStrictEqual('**balasan telah dihapus**');
    expect(postedReply.owner).toStrictEqual(payload.owner);
  });
});
