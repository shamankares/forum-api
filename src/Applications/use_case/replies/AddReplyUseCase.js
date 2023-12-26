const NewReply = require('../../../Domains/replies/entities/NewReply');

class AddReplyUseCase {
  constructor({ replyRepository, commentRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
  }

  async execute(userId, replyId, payload) {
    await this._commentRepository.getCommentById(replyId);
    const newReply = new NewReply(userId, replyId, payload);
    const addedReply = await this._replyRepository.addReply(newReply);
    return addedReply;
  }
}

module.exports = AddReplyUseCase;
