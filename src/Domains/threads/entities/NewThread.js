class NewThread {
  constructor(userId, payload) {
    const { title, body } = payload;
    this._verifyPayload(userId, title, body);
    this.title = title;
    this.body = body;
    this.owner = userId;
  }

  _verifyPayload(userId, title, body) {
    if (!title || !body) {
      throw new Error('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (typeof userId !== 'string' || typeof title !== 'string' || typeof body !== 'string') {
      throw new Error('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewThread;
