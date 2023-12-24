const NewComment = require('../../../Domains/comments/entities/NewComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(userId, threadId, payload) {
    await this._threadRepository.getThreadById(threadId);
    const newComment = new NewComment(userId, threadId, payload);
    const addedComment = await this._commentRepository.addComment(newComment);
    return addedComment;
  }
}

module.exports = AddCommentUseCase;
