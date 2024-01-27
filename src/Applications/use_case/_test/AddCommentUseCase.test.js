const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCasse', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    const mockReturnAddedComment = new AddedComment({
      id: 'comment-123',
      content: 'dummy content',
      owner: 'user-123',
    });

    mockThreadRepository.isThreadExist = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockReturnAddedComment));

    const useCase = new AddCommentUseCase({
      commentRepositroy: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const useCasePayload = {
      threadId: 'thread-123',
      content: 'dummy content',
      owner: 'user-123',
    };

    const expectedAddedComment = new AddedComment({
      id: 'comment-123',
      content: 'dummy content',
      owner: 'user-123',
    });

    // Action
    const addedComment = await useCase.execute(useCasePayload);

    // Assert
    expect(addedComment).toStrictEqual(expectedAddedComment);
    expect(mockThreadRepository.isThreadExist).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.addComment).toBeCalledWith(new NewComment({
      threadId: useCasePayload.threadId,
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    }));
  });
});
