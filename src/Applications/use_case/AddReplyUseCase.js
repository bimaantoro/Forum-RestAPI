const NewReply = require('../../Domains/replies/entities/NewReply');

class AddReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, useCaseParam) {
    const {threadId, commentId} = useCaseParam;
    const newReply = new NewReply(useCasePayload);

    const isThreadExist = await this._threadRepository.isThreadExist(threadId);
    if (!isThreadExist) {
      throw new Error('ADD_REPLY_USE_CASE.THREAD_NOT_FOUND');
    }

    const isCommentExist = await this._commentRepository
      .isCommentExist(commentId, threadId);
    if (!isCommentExist) {
      throw new Error('ADD_REPLY_USE_CASE.COMMENT_NOT_FOUND');
    }

    return this._replyRepository.addReply(newReply);
  }
}

module.exports = AddReplyUseCase;
