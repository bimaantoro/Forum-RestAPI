const CommentRepository = require('../../../Domains/comments/CommentRepository');
const Comment = require('../../../Domains/comments/entities/Comment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const Thread = require('../../../Domains/threads/entities/Thread');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetThreadUseCase', () => {
  it('should throw error when thread is not found', async () => {
    // Arrange
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.getThreadById = jest.fn().mockImplementation(() => Promise.resolve(null));

    const useCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // action & assert
    await expect(useCase.execute('thread-123')).rejects.toThrowError('GET_THREAD_USE_CASE.THREAD_NOT_FOUND');
  });

  it('should orchestrating the get thread action correctly', async () => {
    // Arrange
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    const mockReturnThread = new Thread({
      id: 'thread-123',
      title: 'dummy title',
      body: 'dummy body',
      date: new Date().toISOString(),
      username: 'bimantoro',
    });

    const mockReturnComments = [
      new Comment({
        id: 'comment-123',
        username: 'bimantoro',
        date: new Date().toISOString(),
        content: 'dummy content',
        isDelete: false,
      }),
    ];

    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockReturnThread));
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockReturnComments));

    const getThreaduseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const {
      id, title, body, date, username, comments,
    } = await getThreaduseCase.execute('thread-123');

    // Assert
    expect(id).toEqual('thread-123');
    expect(title).toEqual('dummy title');
    expect(body).toEqual('dummy body');
    expect(date).toBeDefined();
    expect(username).toEqual('bimantoro');
    expect(comments).toHaveLength(1);
    expect(comments[0].id).toEqual('comment-123');
    expect(comments[0].username).toEqual('bimantoro');
    expect(comments[0].content).toEqual('dummy content');

    // validate mock
    expect(mockThreadRepository.getThreadById).toBeCalledWith('thread-123');
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith('thread-123');
  });
});
