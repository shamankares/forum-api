const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const NewThread = require('../../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../../Domains/threads/entities/AddedThread');

const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'Judul Thread',
      body: 'Sebuah thread',
    };
    const id = 'user-123';

    const mockAddedThread = new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: id,
    });

    const mockThreadRepository = new ThreadRepository();
    
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedThread));
    
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await addThreadUseCase.execute(id, useCasePayload);

    // Assert
    expect(addedThread).toEqual(new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: id,
    }));
    expect(mockThreadRepository.addThread).toBeCalledWith(new NewThread(id, useCasePayload));
  });
});
