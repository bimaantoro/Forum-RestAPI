const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment', () => {
    it('should persist new comment and return added comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      const newComment = {
        threadId: 'thread-123',
        content: 'this is new comment',
        owner: 'user-123',
      };

      const fakeIdGenerator = () => '123';
      const repository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const { id, content, owner } = await repository.addComment(newComment);

      // Assert
      expect(id).toEqual('comment-123');
      expect(content).toEqual(newComment.content);
      expect(owner).toEqual(newComment.owner);

      const foundComment = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(foundComment).toBeDefined();
      expect(foundComment.id).toEqual('comment-123');
      expect(foundComment.content).toEqual(newComment.content);
      expect(foundComment.owner).toEqual(newComment.owner);
      expect(foundComment.thread_id).toEqual(newComment.threadId);
      expect(foundComment.is_delete).toEqual(false);
      expect(foundComment.date).toBeDefined();
    });
  });

  describe('isCommentExist', () => {
    it('should return true if comment exists', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComent({ id: 'comment-123' });

      const repository = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(repository.isCommentExist('comment-123')).resolves.toBe(true);
    });

    it('should returh false if comment not exists', async () => {
      // Arrange
      const repository = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(repository.isCommentExist('comment-123')).resolves.toBe(false);
    });
  });

  describe('isCommentOwner', () => {
    it('should return true if user comment owner', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComent({ id: 'comment-123', owner: 'user-123' });

      const repository = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(repository.isCommentOwner('comment-123', 'user-123')).resolves.toBe(true);
    });

    it('should returh false if user is not comment owner', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComent({ id: 'comment-123', owner: 'user-123' });
      const repository = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(repository.isCommentOwner('comment-123', 'user-456')).resolves.toBe(false);
    });
  });

  describe('deleteComment', () => {
    it('should update is_delete to true', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComent({ id: 'comment-123' });

      const repository = new CommentRepositoryPostgres(pool, {});

      // Action
      await repository.deleteComment('comment-123');

      // Assert
      const foundComment = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(foundComment.is_delete).toEqual(true);
    });
  });

  describe('getCommentsById', () => {
    it('should return comments correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComent({ id: 'comment-123', threadId: 'thread-123' });
      await CommentsTableTestHelper.addComent({ id: 'comment-456', threadId: 'thread-123' });
      const repository = new CommentRepositoryPostgres(pool, {});

      // Action
      const comments = await repository.getCommentsByThreadId('thread-123');
      const [firstComment, secondComment] = comments;

      // Assert
      expect(comments).toHaveLength(2);
      expect(firstComment.id).toEqual('comment-123');
      expect(secondComment.id).toEqual('comment-456');
    });
  });
});
