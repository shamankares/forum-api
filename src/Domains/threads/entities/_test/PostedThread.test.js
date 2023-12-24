const PostedThread = require('../PostedThread');

describe('a PostedThread entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payloadWithoutId = {
      title: 'Judul Thread',
      body: 'Sebuah utasan',
      username: 'johndoe',
      date: new Date().toISOString(),
    };
    const payloadWithoutTitle = {
      id: 'thread-456',
      body: 'Sebuah utasan',
      username: 'johndoe',
      date: new Date().toISOString(),
    };
    const payloadWithoutUsername = {
      id: 'thread-456',
      title: 'Judul Thread',
      body: 'Sebuah utasan',
      date: new Date().toISOString(),
    };
    const payloadWithoutDate = {
      id: 'thread-456',
      title: 'Judul Thread',
      body: 'Sebuah utasan',
    };

    expect(() => new PostedThread(payloadWithoutId, [])).toThrowError('POSTED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new PostedThread(payloadWithoutTitle, [])).toThrowError('POSTED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new PostedThread(payloadWithoutUsername, [])).toThrowError('POSTED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new PostedThread(payloadWithoutDate, [])).toThrowError('POSTED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 8912,
      title: true,
      body: 'Sebuah utasan',
      username: ['johndoe'],
      date: '24 nopember',
    };
    const payloadInvalidDate = {
      id: 'thread-456',
      title: 'Judul Thread',
      body: 'Sebuah utasan',
      username: 'johndoe',
      date: '20-11',
    };

    expect(() => new PostedThread(payload, [])).toThrowError('POSTED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new PostedThread(payloadInvalidDate, [])).toThrowError('POSTED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create postedThread object correctly', () => {
    const payload = {
      id: 'thread-456',
      title: 'Judul Thread',
      body: 'Sebuah utasan',
      username: 'johndoe',
      date: new Date().toISOString(),
    };
    const comments = [];

    const postedThread = new PostedThread(payload, comments);

    expect(postedThread.id).toStrictEqual(payload.id);
    expect(postedThread.title).toStrictEqual(payload.title);
    expect(postedThread.body).toStrictEqual(payload.body);
    expect(postedThread.username).toStrictEqual(payload.username);
    expect(postedThread.date).toStrictEqual(payload.date);
    expect(postedThread.comments).toStrictEqual(comments);
  });
});