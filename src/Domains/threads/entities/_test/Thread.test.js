const Comment = require('../../../comments/entities/Comment');
const Thread = require('../Thread');

describe('Thread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'dummy title',
      body: 'dummy body',
    };

    // Action and Assert
    expect(() => new Thread(payload)).toThrowError('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      title: {},
      body: [],
      date: 123,
      username: 123,
    };

    // Action and Assert
    expect(() => new Thread(payload)).toThrowError('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Thread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'dummy title',
      body: 'dummy body',
      date: '2021-08-08T07:19:09.775Z',
      username: 'bimantoro',
    };

    // Action
    const {
      id, title, body, date, username, comments,
    } = new Thread(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
    expect(comments).toEqual([]);
  });

  it('should throw error when comments not contain array', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'dummy title',
      body: 'dummy body',
      date: '2021-08-08T07:19:09.775Z',
      username: 'bimantoro',
    };

    const thread = new Thread(payload);

    // Action & Assert
    expect(() => thread.setComments(
      {},
    )).toThrowError('THREAD.COMMENTS_NOT_ARRAY');
  });

  it('should throw error when comments not contain Comment object', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'dummy title',
      body: 'dummy body',
      date: '2021-08-08T07:19:09.775Z',
      username: 'bimantoro',
    };

    const thread = new Thread(payload);

    // Action & Assert
    expect(() => thread.setComments([
      {},
    ])).toThrowError('THREAD.COMMENTS_CONTAINS_INVALID_MEMBER');
  });

  it('should set comments correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'dummy title',
      body: 'dummy body',
      date: '2021-08-08T07:19:09.775Z',
      username: 'bimantoro',
    };

    const thread = new Thread(payload);
    const comments = [
      new Comment({
        id: 'comment-123',
        username: 'bimantoro',
        date: '2021-08-08T07:19:09.775Z',
        content: 'dummy content',
        isDelete: false,
      }),
    ];

    // Action
    thread.setComments(comments);

    // Assert
    expect(thread.comments).toEqual(comments);
    expect(thread.id).toEqual('thread-123');
    expect(thread.title).toEqual('dummy title');
    expect(thread.body).toEqual('dummy body');
    expect(thread.date).toBeDefined();
    expect(thread.username).toEqual('bimantoro');
  });
});
