class DeleteReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(userId, threadId, commentId, replyId) {
    await this._threadRepository.getThreadById(threadId);
    await this._commentRepository.getCommentById(commentId);
    await this._replyRepository.verifyReplyOwner(replyId, userId);
    await this._replyRepository.deleteReply(replyId);
  }
}

module.exports = DeleteReplyUseCase;
