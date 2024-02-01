const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;
  }

  async postReplyHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { content } = request.payload;
    const { threadId, commentId } = request.params;

    const useCase = this._container.getInstance(AddReplyUseCase.name);

    const addedReply = await useCase.execute({
      threadId, commentId, content, owner,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyHandler(request) {
    const { id: owner } = request.auth.credentials;
    const { threadId, commentId, replyId: id } = request.params;

    const useCase = this._container.getInstance(DeleteReplyUseCase.name);
    await useCase.execute({
      id, owner, threadId, commentId,
    });

    return {
      status: 'success',
      message: 'Balasan komentar berhasil dihapus',
    };
  }
}

module.exports = RepliesHandler;
