const Comment = require('../Comment');

describe('Comment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'bimantoro',
      date: '2021-08-08T07:22:33.555Z',
      content: 'dummy content',
    };

    // Action and Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      username: {},
      content: {},
      date: [],
      isDelete: 'false',
    };

    // Action and Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Comment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'bimantoro',
      date: '2021-08-08T07:22:33.555Z',
      content: 'dummy content',
      isDelete: false,
    };

    // Action
    const {
      id, username, date, content,
    } = new Comment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(content).toEqual(payload.content);
  });

  it('should create deleted comment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'bimantoro',
      date: '2021-08-08T07:22:33.555Z',
      content: 'dummy content',
      isDelete: true,
    };

    // Action
    const {
      id, username, date, content,
    } = new Comment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(content).toEqual('**komentar telah dihapus**');
  });
});
