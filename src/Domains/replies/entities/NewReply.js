class NewReply {
  constructor(userId, commentId, payload) {
    const { content } = payload;
    this._verifyPayload(userId, commentId, content);

    this.owner = userId;
    this.commentId = commentId;
    this.content = content;
  }

  _verifyPayload(userId, commentId, content) {
    if (!userId || !commentId || !content) {
      throw new Error('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof userId !== 'string' ||
      typeof commentId !== 'string' ||
      typeof content !== 'string') {
      throw new Error('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewReply;
