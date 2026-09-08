import errorHandler from '../errorHandler.js';
import { jest } from "@jest/globals";

describe('errorHandler middleware', () => {
  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  it('should return Joi original message for unmapped Joi error (cover line 52)', () => {
    const error = {
      isJoi: true,
      message: '"title" is not allowed to be empty',
      details: [
        {
          path: ['title'],
          type: 'string.empty', // not mapped in your custom checks
        },
      ],
    };

    const req = {};
    const res = mockRes();
    const next = jest.fn();

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: 'fail',
      message: '"title" is not allowed to be empty',
    });
  });

  it('should return 404 for PostgreSQL invalid uuid error code 22P02 (cover line 71)', () => {
    const error = {
      code: '22P02',
      message: 'invalid input syntax for type uuid',
    };

    const req = {};
    const res = mockRes();
    const next = jest.fn();

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'id tidak valid atau tidak ditemukan',
    });
  });

  it("should use empty details when error.details null or undefined", async () => {
    const error = {
      isJoi: true,
      message: "validation error without details"
    }

    const req = {};
    const res = mockRes();
    const next = jest.fn();

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'validation error without details',
    });
  });
});