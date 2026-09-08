import authenticateToken from '../authenticateToken.js';
import container from '../../container.js';
import AuthenticationTokenManager from '../../../Applications/security/AuthenticationTokenManager.js';
import AuthenticationError from '../../../Commons/exceptions/AuthenticationError.js';
import { jest } from '@jest/globals';

describe('authenticateToken middleware', () => {
  it('should throw AuthenticationError when authorization header is missing', async () => {
    // Arrange
    const req = {
      headers: {},
    };
    const res = {};
    const next = jest.fn();

    // Action
    await authenticateToken(req, res, next);

    // Assert
    expect(next).toHaveBeenCalledWith(expect.any(AuthenticationError));
    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Missing authentication',
      statusCode: 401,
    }));
  });

  it('should throw AuthenticationError when token is invalid', async () => {
    // Arrange
    const req = {
      headers: {
        authorization: 'Bearer invalid_token',
      },
    };
    const res = {};
    const next = jest.fn();

    const mockAuthenticationTokenManager = new AuthenticationTokenManager();
    mockAuthenticationTokenManager.verifyAccessToken = jest.fn()
      .mockImplementation(() => { throw new Error(); });

    const spyGetInstance = jest.spyOn(container, 'getInstance')
      .mockImplementation(() => mockAuthenticationTokenManager);

    // Action
    await authenticateToken(req, res, next);

    // Assert
    expect(next).toHaveBeenCalledWith(expect.any(AuthenticationError));
    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      message: 'access token tidak valid',
      statusCode: 401,
    }));
    expect(spyGetInstance).toHaveBeenCalledWith(AuthenticationTokenManager.name);
    expect(mockAuthenticationTokenManager.verifyAccessToken).toHaveBeenCalledWith('invalid_token');

    spyGetInstance.mockRestore();
  });

  it('should set req.credentials and call next when token is valid', async () => {
    // Arrange
    const req = {
      headers: {
        authorization: 'Bearer valid_token',
      },
    };
    const res = {};
    const next = jest.fn();

    const decodedPayload = { id: 'user-123', username: 'dicoding' };
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();
    mockAuthenticationTokenManager.verifyAccessToken = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockAuthenticationTokenManager.decodePayload = jest.fn()
      .mockImplementation(() => Promise.resolve(decodedPayload));

    const spyGetInstance = jest.spyOn(container, 'getInstance')
      .mockImplementation(() => mockAuthenticationTokenManager);

    // Action
    await authenticateToken(req, res, next);

    // Assert
    expect(req.credentials).toEqual(decodedPayload);
    expect(next).toHaveBeenCalledWith();
    expect(spyGetInstance).toHaveBeenCalledWith(AuthenticationTokenManager.name);
    expect(mockAuthenticationTokenManager.verifyAccessToken).toHaveBeenCalledWith('valid_token');
    expect(mockAuthenticationTokenManager.decodePayload).toHaveBeenCalledWith('valid_token');

    spyGetInstance.mockRestore();
  });
});
