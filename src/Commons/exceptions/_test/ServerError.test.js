import ServerError from '../ServerError';

describe('ServerError', () => {
  it('should create error correctly', () => {
    // Arrange
    const serverError = new ServerError('Internal Server Error!');

    // Action & Assert
    expect(serverError.message).toEqual('Internal Server Error!');
    expect(serverError.statusCode).toEqual(500);
    expect(serverError.name).toEqual('ServerError');
  });
});
