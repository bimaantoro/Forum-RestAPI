class DeleteReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, owner, commentId,
    } = payload;

    this.id = id;
    this.owner = owner;
    this.commentId = commentId;
  }

  _verifyPayload({
    id, commentId, owner,
  }) {
    if (!id || !commentId || !owner) {
      throw new Error('DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof commentId !== 'string' || typeof owner !== 'string') {
      throw new Error('DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteReply;
