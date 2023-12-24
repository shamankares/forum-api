const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });
  
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
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
      const requestPayload = {
        title: 'Judul Thread',
        body: 'Sebuah utasan.',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
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
      const requestPayload = {
        title: 'Judul Thread',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada');
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
      const requestPayload = {
        title: 123,
        body: 'Sebuah utasan.',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai');
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('should response 200 and return thread', async () => {
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

      // add dummy comments
      await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: { content: 'Sebuah komentar.' },
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: { content: 'A comment.' },
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
    });

    it('should response 404 when thread not found', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/invalid-id',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread ID tidak valid');
    });
  });
});
