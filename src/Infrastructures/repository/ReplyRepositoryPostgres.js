const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const Reply = require('../../Domains/replies/entities/Reply');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(newReply) {
    const { content, owner, commentId } = newReply;
    const id = `reply-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, content, owner, commentId, false, new Date().toISOString()],
    };

    const { rows } = await this._pool.query(query);

    return new AddedReply({ ...rows[0] });
  }

  async isReplyExist(replyId) {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1',
      values: [replyId],
    };

    const { rowCount } = await this._pool.query(query);

    return rowCount > 0;
  }

  async isReplyOwner(replyId, owner) {
    const query = {
      text: 'SELECT owner FROM replies WHERE id = $1',
      values: [replyId],
    };

    const { rows } = await this._pool.query(query);

    return rows[0].owner === owner;
  }

  async deleteReply(replyId) {
    const query = {
      text: 'UPDATE replies SET is_delete = true WHERE id = $1',
      values: [replyId],
    };

    await this._pool.query(query);
  }

  async getRepliesByCommentId(commentId) {
    const query = {
      text: `SELECT
        replies.id,
        replies.content,
        replies.date,
        replies.is_delete,
        users.username
        FROM replies INNER JOIN users ON replies.owner = users.id
        WHERE replies.comment_id = $1 ORDER BY replies.date ASC`,
      values: [commentId],
    };

    const { rows } = await this._pool.query(query);

    return rows.map((row) => new Reply({
      ...row,
      isDelete: row.is_delete,
    }));
  }
}

module.exports = ReplyRepositoryPostgres;
