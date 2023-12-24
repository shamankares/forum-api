const NewThread = require('../NewThread');

describe('a NewThread entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payloadWithoutBody = {
      title: 'Judul Thread',
    };
    const payloadWithoutTitle = {
      body: 'Isi utasan.',
    };
    const id = 'user-123';

    expect(() => new NewThread(id, payloadWithoutBody)).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new NewThread(id, payloadWithoutTitle)).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const id = 123;
    const payload = {
      title: 231,
      body: [12321, 'Isi utasan.'],
    };

    expect(() => new NewThread(id, payload)).toThrowError('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create newThread object correctly', () => {
    const id = 'user-123';
    const payload = {
      title: 'Judul Thread',
      body: 'Isi sebuah utasan',
    };

    const newThread = new NewThread(id, payload);

    expect(newThread.title).toStrictEqual(payload.title);
    expect(newThread.body).toStrictEqual(payload.body);
    expect(newThread.owner).toStrictEqual(id);
  });
});