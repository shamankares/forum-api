const AddReplyUseCase = require('../../../../Applications/use_case/replies/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/replies/DeleteReplyUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    const { threadId, commentId } = request.params;
    const { id: userId } = request.auth.credentials;
    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
    const addedReply = await addReplyUseCase.execute(userId, threadId, commentId, request.payload);

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyHandler(request, h) {
    const { threadId, commentId, replyId } = request.params;
    const { id: userId } = request.auth.credentials;
    const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name);
    await deleteReplyUseCase.execute(userId, threadId, commentId, replyId);

    const response = h.response({
      status: 'success',
      message: 'balasan berhasil dihapus',
    });
    response.code(200);
    return response;
  }
}

module.exports = RepliesHandler;
