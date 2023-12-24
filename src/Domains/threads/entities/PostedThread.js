class PostedThread {
  constructor(payload, comments) {
    const { id, username, title, body, date } = payload;
    this._verifyPayload(id, username, title, body, date, comments);
    this.id = id;
    this.title = title;
    this.body = body;
    this.date = new Date(date).toISOString();
    this.username = username;
    this.comments = comments;
  }

  _verifyPayload(id, username, title, body, date, comments) {
    if (!id || !username || !title || !body || !date || !comments) {
      throw new Error('POSTED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (typeof id !== 'string'
      || typeof username !== 'string'
      || typeof title !== 'string'
      || typeof body !== 'string'
      || !Array.isArray(comments)) {
      throw new Error('POSTED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    try {
      new Date(date).toISOString();
    } catch (error) {
      error.message = 'POSTED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION';
      throw error;
    }
  }
}

module.exports = PostedThread;
