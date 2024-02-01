const Reply = require('../Reply');

describe('Reply entities', () => {
  it('shold throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      username: 'bimantoro',
      date: '2021-08-08T07:59:48.766Z',
      content: 'sebuah balasan',
    };

    // Action and Assert
    expect(() => new Reply(payload)).toThrowError('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('shold throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      username: {},
      content: {},
      date: '2021-08-08T07:59:48.766Z',
      isDelete: 'false',
    };

    // Action and Assert
    expect(() => new Reply(payload)).toThrowError('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Reply object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      username: 'bimantoro',
      date: '2021-08-08T07:59:48.766Z',
      content: 'sebuah balasan',
      isDelete: false,
    };

    // Action
    const {
      id, username, date, content,
    } = new Reply(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(content).toEqual(payload.content);
  });

  it('should create deleted reply object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      username: 'bimantoro',
      date: '2021-08-08T07:59:48.766Z',
      content: 'sebuah balasan',
      isDelete: true,
    };

    // Action
    const {
      id, username, date, content,
    } = new Reply(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(content).toEqual('**balasan telah dihapus**');
  });
});
