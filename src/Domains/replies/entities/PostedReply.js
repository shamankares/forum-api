class PostedReply {
  constructor(payload) {
    const { id, username, date, content, isDeleted } = payload;
    this._verifyPayload(id, username, date, content, isDeleted);
    this.id = id;
    this.username = username;
    this.date = new Date(date).toISOString();
    this.content = isDeleted ? '**balasan telah dihapus**' : content;
  }

  _verifyPayload(id, username, date, content, isDeleted) {
    if (!id || !username || !date || !content || isDeleted === 'undefined') {
      throw new Error('POSTED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (typeof id !== 'string' || typeof username !== 'string' || typeof content !== 'string' || typeof isDeleted !== 'boolean') {
      throw new Error('POSTED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    try {
      new Date(date).toISOString();
    } catch (error) {
      error.message = 'POSTED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION';
      throw error;
    }
  }
}

module.exports = PostedReply;
