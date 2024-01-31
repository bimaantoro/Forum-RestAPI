const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should throw error when thread not found', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      content: 'dummy content',
      owner: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.isThreadExist = jest.fn().mockImplementation(() => Promise.resolve(false));

    const useCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action & Assert
    await expect(useCase.execute(useCasePayload)).rejects.toThrowError('ADD_COMMENT_USE_CASE.THREAD_NOT_FOUND');
    expect(mockThreadRepository.isThreadExist).toBeCalledWith(useCasePayload.threadId);
  });

  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      content: 'dummy content',
      owner: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    const mockReturnAddedComment = new AddedComment({
      id: 'comment-123',
      content: 'dummy content',
      owner: 'user-123',
    });

    mockThreadRepository.isThreadExist = jest.fn().mockImplementation(() => Promise.resolve(true));
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockReturnAddedComment));

    const expectedAddedComment = new AddedComment({
      id: 'comment-123',
      content: 'dummy content',
      owner: 'user-123',
    });

    const useCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedComment = await useCase.execute(useCasePayload);

    // Assert
    expect(addedComment).toStrictEqual(expectedAddedComment);
    expect(mockThreadRepository.isThreadExist).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.addComment).toBeCalledWith(useCasePayload);
  });
});
