const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddReplyUseCase = require('../AddReplyUseCase');

describe('AddReplyUseCase', () => {
  it('should throw error when thread not found', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      content: 'sebuah balasan',
      owner: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.isThreadExist = jest.fn().mockImplementation(() => Promise.resolve(false));

    const useCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const expectedError = new Error('ADD_REPLY_USE_CASE.THREAD_NOT_FOUND');

    // Action & Assert
    await expect(useCase.execute(useCasePayload)).rejects.toThrowError(expectedError);
    expect(mockThreadRepository.isThreadExist)
      .toBeCalledWith(useCasePayload.threadId);
  });

  it('should throw error when comment not found', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      content: 'sebuah balasan',
      owner: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.isThreadExist = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockCommentRepository.isCommentExist = jest.fn()
      .mockImplementation(() => Promise.resolve(false));

    const useCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const expectedError = new Error('ADD_REPLY_USE_CASE.COMMENT_NOT_FOUND');

    // Action & Assert
    await expect(useCase.execute(useCasePayload)).rejects.toThrowError(expectedError);
    expect(mockThreadRepository.isThreadExist)
      .toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.isCommentExist)
      .toBeCalledWith(useCasePayload.commentId, useCasePayload.threadId);
  });

  it('should orchestrating the add reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      content: 'sebuah balasan',
      owner: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    const mockReturnAddedReply = new AddedReply({
      id: 'reply-123',
      content: 'sebuah balasan',
      owner: 'user-123',
    });

    mockThreadRepository.isThreadExist = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockCommentRepository.isCommentExist = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockReplyRepository.addReply = jest.fn()
      .mockImplementation(() => Promise.resolve(mockReturnAddedReply));

    const expectedAddedReply = new AddedReply({
      id: 'reply-123',
      content: 'sebuah balasan',
      owner: 'user-123',
    });

    const useCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedReply = await useCase.execute(useCasePayload);

    // Assert
    expect(addedReply).toStrictEqual(expectedAddedReply);
    expect(mockThreadRepository.isThreadExist)
    .toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.isCommentExist)
    .toBeCalledWith(useCasePayload.commentId, useCasePayload.threadId);
    expect(mockReplyRepository.addReply).toBeCalledWith(new NewReply({
      content: useCasePayload.content,
      commentId: useCasePayload.commentId,
      threadId: useCasePayload.threadId,
      owner: useCasePayload.owner,
    }));
  });
});
