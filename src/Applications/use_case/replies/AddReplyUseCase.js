const NewReply = require('../../../Domains/replies/entities/NewReply');

class AddReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(userId, threadId, commentId, payload) {
    await this._threadRepository.getThreadById(threadId);
    await this._commentRepository.getCommentById(commentId);
    const newReply = new NewReply(userId, commentId, payload);
    const addedReply = await this._replyRepository.addReply(newReply);
    return addedReply;
  }
}

module.exports = AddReplyUseCase;
