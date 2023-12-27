const Mapper = {
  mapComment: ({
    id,
    username,
    content,
    date,
    is_deleted,
  }) => ({
    id,
    username,
    content,
    date,
    isDeleted: is_deleted,
  }),

  mapReply: ({
    id,
    username,
    content,
    date,
    is_deleted,
  }) => ({
    id,
    username,
    content,
    date,
    isDeleted: is_deleted,
  }),
};

module.exports = Mapper;
