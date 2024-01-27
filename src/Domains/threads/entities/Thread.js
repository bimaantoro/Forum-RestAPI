const Comment = require('../../comments/entities/Comment');

class Thread {
  constructor(payload) {
    this._verifyPayload(payload);
  }

  _verifyPayload({
    id, title, body, date, username,
  }) {
    if (!id || !title || !body || !date || !username) {
      throw new Error('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof title !== 'string' || typeof body !== 'string' || typeof date !== 'string' || typeof username !== 'string') {
      throw new Error('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  setComments(comments) {
    const isCommentArray = Array.isArray(comments);

    if (!isCommentArray) {
      throw new Error('THREAD.COMMENTS_NOT_ARRAY');
    }

    const isAnyInvalidComment = comments.some((comment) => !(comment instanceof Comment));

    if (isAnyInvalidComment) {
      throw new Error('THREAD.COMMENTS_CONTAINS_INVALID_MEMBER');
    }

    this.comment = comments;
  }
}

module.exports = Thread;
