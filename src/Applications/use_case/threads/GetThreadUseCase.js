const PostedThread = require('../../../Domains/threads/entities/PostedThread');

class GetThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);
    comments.sort((a, b) => new Date(a.date) - new Date(b.date));
    const getThread = new PostedThread(thread, comments);
    return getThread;
  }
}

module.exports = GetThreadUseCase;