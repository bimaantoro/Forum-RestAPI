const NewComment = require('../../Domains/comments/entities/NewComment');

class AddCommentUseCase {
  constructor({ commentRepositroy, threadRepository }) {
    this._commentRepository = commentRepositroy;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const newComment = new NewComment(useCasePayload);
    const isThreadExist = await this._threadRepository.isThreadExist(newComment.threadId);

    if (!isThreadExist) {
      throw new Error('ADD_COMMENT_USE_CASE.THREAD_NOT_FOUND');
    }

    return this._commentRepository.addComment(newComment);
  }
}

module.exports = AddCommentUseCase;
