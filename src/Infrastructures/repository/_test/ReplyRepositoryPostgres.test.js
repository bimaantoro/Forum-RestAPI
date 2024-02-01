const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply', () => {
    it('should persist new Reply and return added reply correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComent({ id: 'comment-123', owner: 'user-123' });

      const newReply = new NewReply({
        commentId: 'comment-123',
        content: 'sebuah balasan',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const repository = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const { id, content, owner } = await repository.addReply(newReply);

      // Assert
      expect(id).toEqual('reply-123');
      expect(content).toEqual(newReply.content);
      expect(owner).toEqual(newReply.owner);

      const foundReply = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(foundReply).toBeDefined();
      expect(foundReply.id).toEqual('reply-123');
      expect(foundReply.content).toEqual(newReply.content);
      expect(foundReply.owner).toEqual(newReply.owner);
      expect(foundReply.comment_id).toEqual(newReply.commentId);
      expect(foundReply.is_delete).toEqual(false);
      expect(foundReply.date).toBeDefined();
    });
  });

  describe('isReplyExist', () => {
    it('should return true if reply exists', async () => {
      // Arrange
      const owner = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';

      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner });
      await CommentsTableTestHelper.addComent({ id: commentId, threadId, owner });
      await RepliesTableTestHelper.addReply({ id: replyId, commentId, owner });

      const repository = new ReplyRepositoryPostgres(pool, {});

      // Action
      const isReplyExist = await repository.isReplyExist(replyId);

      // Assert
      expect(isReplyExist).toEqual(true);
    });

    it('should returh false if reply not exists', async () => {
      // Arrange
      const repository = new ReplyRepositoryPostgres(pool, {});

      // Action
      const isReplyExist = await repository.isReplyExist('reply-123');

      // Action & Assert
      await expect(isReplyExist).toEqual(false);
    });
  });

  describe('isReplyOwner', () => {
    it('should return true if user reply owner', async () => {
      // Arrange
      const owner = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';

      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner });
      await CommentsTableTestHelper.addComent({ id: commentId, threadId, owner });
      await RepliesTableTestHelper.addReply({ id: replyId, commentId, owner });

      const repository = new ReplyRepositoryPostgres(pool, {});

      // Action
      const isReplyOwner = await repository.isReplyOwner(replyId, owner);

      // Assert
      expect(isReplyOwner).toEqual(true);
    });

    it('should returh false if user is not reply owner', async () => {
      // Arrange
      const owner = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';

      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner });
      await CommentsTableTestHelper.addComent({ id: commentId, threadId, owner });
      await RepliesTableTestHelper.addReply({ id: replyId, commentId, owner });

      const repository = new ReplyRepositoryPostgres(pool, {});

      // Action
      const isReplyOwner = await repository.isReplyOwner(replyId, 'user-456');

      // Assert
      expect(isReplyOwner).toEqual(false);
    });
  });

  describe('deleteReply', () => {
    it('should update is_delete to true', async () => {
      // Arrange
      const owner = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';

      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner });
      await CommentsTableTestHelper.addComent({ id: commentId, threadId, owner });
      await RepliesTableTestHelper.addReply({ id: replyId, commentId, owner });

      const repository = new ReplyRepositoryPostgres(pool, {});

      // Action
      await repository.deleteReply(replyId);

      // Assert
      const foundReply = await RepliesTableTestHelper.findReplyById(replyId);
      expect(foundReply.is_delete).toEqual(true);
    });
  });

  describe('getRepliesByCommentId', () => {
    it('should return replies correctly', async () => {
      // Arrange
      const owner = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';
      const anotherReplyId = 'reply-456';

      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner });
      await CommentsTableTestHelper.addComent({ id: commentId, threadId, owner });
      await RepliesTableTestHelper.addReply({ id: replyId, commentId, owner });
      await RepliesTableTestHelper.addReply({ id: anotherReplyId, commentId, owner });

      const repository = new ReplyRepositoryPostgres(pool, {});

      // Action
      const replies = await repository.getRepliesByCommentId('comment-123');
      const [firstReply, secondReply] = replies;

      // Assert
      expect(replies).toHaveLength(2);
      expect(firstReply.id).toEqual(replyId);
      expect(secondReply.id).toEqual(anotherReplyId);
    });
  });
});
