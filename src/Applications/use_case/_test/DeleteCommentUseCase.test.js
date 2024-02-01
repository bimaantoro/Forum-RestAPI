const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should throw error when thread is not exists', async () => {
    // Arrange
    const useCasePayload = {
      id: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.isThreadExist = jest.fn(() => Promise.resolve(false));

    const useCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const expectedError = new Error('DELETE_COMMENT_USE_CASE.THREAD_NOT_FOUND');

    // Action & Assert
    await expect(useCase.execute(useCasePayload)).rejects.toThrowError(expectedError);
    expect(mockThreadRepository.isThreadExist).toBeCalledWith(useCasePayload.threadId);
  });

  it('should throw error when comment is not exists', async () => {
    // Arrange
    const useCasePayload = {
      id: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.isThreadExist = jest.fn(() => Promise.resolve(true));
    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.isCommentExist = jest.fn(() => Promise.resolve(false));

    const useCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const expectedError = new Error('DELETE_COMMENT_USE_CASE.COMMENT_NOT_FOUND');

    // Action & Assert
    await expect(useCase.execute(useCasePayload)).rejects.toThrowError(expectedError);
    expect(mockThreadRepository.isThreadExist).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.isCommentExist).toBeCalledWith(useCasePayload.id);
  });

  it('should throw error when user is not comment owner', async () => {
    // Arrange
    const useCasePayload = {
      id: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.isThreadExist = jest.fn(() => Promise.resolve(true));
    mockCommentRepository.isCommentExist = jest.fn(() => Promise.resolve(true));
    mockCommentRepository.isCommentOwner = jest.fn(() => Promise.resolve(false));

    const useCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const expectedError = new Error('DELETE_COMMENT_USE_CASE.COMMENT_NOT_OWNED');

    // Action & Assert
    await expect(useCase.execute(useCasePayload)).rejects.toThrowError(expectedError);
    expect(mockThreadRepository.isThreadExist).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.isCommentExist).toBeCalledWith(useCasePayload.id);
    expect(mockCommentRepository.isCommentOwner)
      .toBeCalledWith(useCasePayload.id, useCasePayload.owner);
  });

  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.isThreadExist = jest.fn(() => Promise.resolve(true));
    mockCommentRepository.isCommentExist = jest.fn(() => Promise.resolve(true));
    mockCommentRepository.isCommentOwner = jest.fn(() => Promise.resolve(true));
    mockCommentRepository.deleteComment = jest.fn(() => Promise.resolve());

    const useCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await useCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.isThreadExist).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.isCommentExist).toBeCalledWith(useCasePayload.id);
    expect(mockCommentRepository.isCommentOwner)
      .toBeCalledWith(useCasePayload.id, useCasePayload.owner);
    expect(mockCommentRepository.deleteComment)
      .toBeCalledWith(useCasePayload.id);
  });
});
