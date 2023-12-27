const pool = require('../../database/postgres/pool');

const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');

const container = require('../../container');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments/{commentId}/replies endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });
  
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 201 and persisted reply', async () => {
      // Arrange
      // Test Preparation
      const server = await createServer(container);

      // create a dummy user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // get token for authentication
      const tokenResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const { accessToken } = JSON.parse(tokenResponse.payload).data;

      // add a new thread
      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'Judul Thread',
          body: 'Sebuah utasan.',
        },
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const { id: threadId } = JSON.parse(threadResponse.payload).data.addedThread;

      // add a new comment
      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'Sebuah komentar.',
        },
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const { id: commentId } = JSON.parse(commentResponse.payload).data.addedComment;

      // Action
      const requestPayload = {
        content: 'Sebuah balasan.',
      };
      
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      // Test Preparation
      const server = await createServer(container);

      // create a dummy user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // get token for authentication
      const tokenResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const { accessToken } = JSON.parse(tokenResponse.payload).data;

      // add a new thread
      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'Judul Thread',
          body: 'Sebuah utasan.',
        },
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const { id: threadId } = JSON.parse(threadResponse.payload).data.addedThread;

      // add a new comment
      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'Sebuah komentar.',
        },
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const { id: commentId } = JSON.parse(commentResponse.payload).data.addedComment;

      // Action
      const requestPayload = {};
      
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat balasan baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      // Test Preparation
      const server = await createServer(container);

      // create a dummy user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // get token for authentication
      const tokenResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const { accessToken } = JSON.parse(tokenResponse.payload).data;

      // add a new thread
      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'Judul Thread',
          body: 'Sebuah utasan.',
        },
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const { id: threadId } = JSON.parse(threadResponse.payload).data.addedThread;

      // add a new comment
      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'Sebuah komentar.',
        },
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const { id: commentId } = JSON.parse(commentResponse.payload).data.addedComment;

      // Action
      const requestPayload = {
        content: 6456456546,
      };
      
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat balasan baru karena tipe data tidak sesuai');
    });

    it('should response 404 when the thread ID is not valid or not found', async () => {
      // Arrange
      // Test Preparation
      const server = await createServer(container);

      // create a dummy user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // get token for authentication
      const tokenResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const { accessToken } = JSON.parse(tokenResponse.payload).data;

      // Action
      const requestPayload = {
        content: 'Sebuah balasan',
      };
      
      const response = await server.inject({
        method: 'POST',
        url: '/threads/invalidId/comments/comment-dummy/replies',
        payload: requestPayload,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread ID tidak valid');
    });

    it('should response 404 when the comment ID is not valid or not found', async () => {
      // Arrange
      // Test Preparation
      const server = await createServer(container);

      // create a dummy user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // get token for authentication
      const tokenResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const { accessToken } = JSON.parse(tokenResponse.payload).data;

      // add a new thread
      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'Judul Thread',
          body: 'Sebuah utasan.',
        },
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const { id: threadId } = JSON.parse(threadResponse.payload).data.addedThread;

      // Action
      const requestPayload = {
        content: 'Sebuah balasan',
      };
      
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/invalidId/replies`,
        payload: requestPayload,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('comment ID tidak valid');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should respose 200 when successfully deleted the reply', async () => {
      // Arrange
      // Test Preparation
      const server = await createServer(container);

      // create a dummy user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // get token for authentication
      const tokenResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const { accessToken } = JSON.parse(tokenResponse.payload).data;

      // add a new thread
      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'Judul Thread',
          body: 'Sebuah utasan.',
        },
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const { id: threadId } = JSON.parse(threadResponse.payload).data.addedThread;

      // add comment
      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: { content: 'Sebuah komentar.' },
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const { id: commentId } = JSON.parse(commentResponse.payload).data.addedComment;

      // add reply
      const replyResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: { content: 'Sebuah balasan.' },
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const { id: replyId } = JSON.parse(replyResponse.payload).data.addedReply;

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies${replyId}`,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.message).toEqual('balasan berhasil dihapus');
    });

    it('should response 403 when the user is not owner of the reply ID', async () => {
      // Arrange
      // Test Preparation
      const server = await createServer(container);

      // create dummy user 1
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'user1',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // get token for user 1 authentication
      const tokenUser1Response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'user1',
          password: 'secret',
        },
      });
      const { accessToken: accessTokenUser1 } = JSON.parse(tokenUser1Response.payload).data;

      // add a new thread
      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'Judul Thread',
          body: 'Sebuah utasan.',
        },
        headers: {
          'Authorization': `Bearer ${accessTokenUser1}`,
        },
      });
      const { id: threadId } = JSON.parse(threadResponse.payload).data.addedThread;

      // add comment as user 1
      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: { content: 'Sebuah komentar.' },
        headers: {
          'Authorization': `Bearer ${accessTokenUser1}`,
        },
      });
      const { id: commentId } = JSON.parse(commentResponse.payload).data.addedComment;

      // add reply as user 1
      const replyResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: { content: 'Sebuah balasan.' },
        headers: {
          'Authorization': `Bearer ${accessTokenUser1}`,
        },
      });
      const { id: replyId } = JSON.parse(replyResponse.payload).data.addedReply;

      // create dummy user 2
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'user2',
          password: 'supersecret',
          fullname: 'John Doe',
        },
      });

      // get token for user 1 authentication
      const tokenUser2Response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'user2',
          password: 'supersecret',
        },
      });
      const { accessToken: accessTokenUser2 } = JSON.parse(tokenUser2Response.payload).data;

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          'Authorization': `Bearer ${accessTokenUser2}`,
        },
      });
      
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('bukan pemilik balasan');
    });

    it('should response 404 when the thread ID is not valid or not found', async () => {
      // Arrange
      // Test Preparation
      const server = await createServer(container);

      // create a dummy user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // get token for authentication
      const tokenResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const { accessToken } = JSON.parse(tokenResponse.payload).data;

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/invalidId/comments/comment-dummy/replies/reply-dummy',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread ID tidak valid');
    });

    it('should response 404 when the comment ID is not valid or not found', async () => {
      // Arrange
      // Test Preparation
      const server = await createServer(container);

      // create a dummy user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // get token for authentication
      const tokenResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const { accessToken } = JSON.parse(tokenResponse.payload).data;

      // add a new thread
      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'Judul Thread',
          body: 'Sebuah utasan.',
        },
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const { id: threadId } = JSON.parse(threadResponse.payload).data.addedThread;

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/invalidId/replies/reply-dummy`,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('comment ID tidak valid');
    });

    it('should response 404 when the reply ID is not valid or not found', async () => {
      // Arrange
      // Test Preparation
      const server = await createServer(container);

      // create a dummy user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // get token for authentication
      const tokenResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const { accessToken } = JSON.parse(tokenResponse.payload).data;

      // add a new thread
      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'Judul Thread',
          body: 'Sebuah utasan.',
        },
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const { id: threadId } = JSON.parse(threadResponse.payload).data.addedThread;

      // add a new comment
      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'Sebuah komentar.',
        },
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const { id: commentId } = JSON.parse(commentResponse.payload).data.addedComment;

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/invalidId`,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('reply ID tidak valid');
    });
  });
});
