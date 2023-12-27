const PostedThread = require('../../../Domains/threads/entities/PostedThread');

class GetThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);
    if (comments.length > 0) {
      comments.sort((a, b) => new Date(a.date) - new Date(b.date));
      for (const comment of comments) {
        comment.replies = await this._replyRepository.getRepliesByCommentId(comment.id);
        comment.replies.sort((a, b) => new Date(a.date) - new Date(b.date));
      }
    }
    const getThread = new PostedThread(thread, comments);
    return getThread;
  }
}

module.exports = GetThreadUseCase;