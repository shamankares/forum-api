const Mapper = require('../Mapper');

describe('Mapper', () => {
  describe('mapComment function', () => {
    it('should map comments correctly', () => {
      const rawComment = {
        id: 'comment-123',
        username: 'johndoe',
        date: new Date().toISOString(),
        content: 'Sebuah komentar.',
        is_deleted: false,
      };
      const mockComment = {
        id: rawComment.id,
        username: rawComment.username,
        date: rawComment.date,
        content: rawComment.content,
        isDeleted: rawComment.is_deleted,
      };

      const mapped = Mapper.mapComment(rawComment);
      expect(mapped).toStrictEqual(mockComment);
    });
  });
});