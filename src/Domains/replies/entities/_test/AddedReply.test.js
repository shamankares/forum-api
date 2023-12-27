const AddedReply = require('../AddedReply');

describe('a AddedReply entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payloadWithoutId = {
      content: 'Sebuah balasan.',
      owner: 'user-123',
    };
    const payloadWithoutContent = {
      id: 'reply-123',
      owner: 'user-123',
    };
    const payloadWithoutOwner = {
      id: 'reply-123',
      content: 'Sebuah balasan.',
    };

    expect(() => new AddedReply(payloadWithoutId)).toThrowError('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new AddedReply(payloadWithoutContent)).toThrowError('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new AddedReply(payloadWithoutOwner)).toThrowError('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 123,
      content: true,
      owner: 'user-123',
    };

    expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addedReply object correctly', () => {
    const payload = {
      id: 'reply-123',
      content: 'Sebuah balasan.',
      owner: 'user-123',
    };

    const addedReply = new AddedReply(payload);

    expect(addedReply.id).toStrictEqual(payload.id);
    expect(addedReply.content).toStrictEqual(payload.content);
    expect(addedReply.owner).toStrictEqual(payload.owner);
  });
});
