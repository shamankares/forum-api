const NewThread = require('../../../Domains/threads/entities/NewThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(userId, payload) {
    const newThread = new NewThread(userId, payload);
    const addedThread = await this._threadRepository.addThread(newThread);
    return addedThread;
  }
}

module.exports = AddThreadUseCase;