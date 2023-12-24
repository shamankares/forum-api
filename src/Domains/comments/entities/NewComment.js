class NewComment {
  constructor(userId, threadId, payload) {
    const { content } = payload;
    this._verifyPayload(userId, threadId, content);

    this.threadId = threadId;
    this.content = content;
    this.owner = userId;
  }

  _verifyPayload(userId, threadId, content) {
    if (!userId || !threadId || !content) {
      throw new Error('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof userId !== 'string' || typeof threadId !== 'string' || typeof content !== 'string') {
      throw new Error('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewComment;
