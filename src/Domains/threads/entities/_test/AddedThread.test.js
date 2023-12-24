const AddedThread = require('../AddedThread');

describe('a AddedThread entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payloadWithoutId = {
      title: 'Judul Thread',
      owner: 'user-123',
    };
    const payloadWithoutTitle = {
      id: 'thread-456',
      owner: 'user-123',
    };
    const payloadWithoutOwner = {
      id: 'thread-456',
      title: 'Judul Thread',
    };

    expect(() => new AddedThread(payloadWithoutId)).toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new AddedThread(payloadWithoutTitle)).toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new AddedThread(payloadWithoutOwner)).toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 8912,
      title: true,
      owner: ['user-123'],
    };

    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addedThread object correctly', () => {
    const payload = {
      id: 'thread-456',
      title: 'Judul Thread',
      owner: 'user-123',
    };

    const addedThread = new AddedThread(payload);

    expect(addedThread.id).toStrictEqual(payload.id);
    expect(addedThread.title).toStrictEqual(payload.title);
    expect(addedThread.owner).toStrictEqual(payload.owner);
  });
});