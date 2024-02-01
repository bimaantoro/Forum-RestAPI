const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should orchestrating the delete reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'reply-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.isThreadExist = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockCommentRepository.isCommentExist = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockReplyRepository.isReplyExist = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockReplyRepository.isReplyOwner = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockReplyRepository.deleteReply = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const useCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await useCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.isThreadExist).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.isCommentExist).toBeCalledWith(useCasePayload.commentId);
    expect(mockReplyRepository.isReplyExist).toBeCalledWith(useCasePayload.id);
    expect(mockReplyRepository.isReplyOwner)
      .toBeCalledWith(useCasePayload.id, useCasePayload.owner);
    expect(mockReplyRepository.deleteReply).toBeCalledWith(useCasePayload.id);
  });
});
