import DomainErrorTranslator from "../../Commons/exceptions/DomainErrorTranslator.js";
import ClientError from "../../Commons/exceptions/ClientError.js";

// eslint-disable-next-line no-unused-vars
export default function errorHandler (error, req, res, next) {
  if (error.isJoi) {
    const details = error.details || [];

    const hasRequiredUserPassError = details.some((d) =>
      ['username', 'password'].includes(d.path?.[0]) && d.type === 'any.required'
    );

    if (hasRequiredUserPassError) {
      return res.status(400).json({
        status: 'fail',
        message: 'harus mengirimkan username dan password',
      });
    }

    const hasTypeUserPassError = details.some((d) =>
      ['username', 'password'].includes(d.path?.[0]) && d.type === 'string.base'
    );

    if (hasTypeUserPassError) {
      return res.status(400).json({
        status: 'fail',
        message: 'username dan password harus string',
      });
    }

    const hasRequiredRefreshTokenError = details.some((d) =>
      d.path?.[0] === 'refreshToken' && d.type === 'any.required'
    );

    if (hasRequiredRefreshTokenError) {
      return res.status(400).json({
        status: 'fail',
        message: 'harus mengirimkan token refresh',
      });
    }

    const hasTypeRefreshTokenError = details.some((d) =>
      d.path?.[0] === 'refreshToken' && d.type === 'string.base'
    );

    if (hasTypeRefreshTokenError) {
      return res.status(400).json({
        status: 'fail',
        message: 'refresh token harus string',
      });
    }

    return res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }

  // translate domain error
  const translatedError = DomainErrorTranslator.translate(error);

  // internal error
  if (translatedError instanceof ClientError) {
    return res.status(translatedError.statusCode).json({
      status: 'fail',
      message: translatedError.message,
    });
  }

  // Add a check for PostgreSQL UUID syntax errors
  if (error.code === '22P02') {
    return res.status(404).json({
      status: 'fail',
      message: 'id tidak valid atau tidak ditemukan',
    });
  }

  return res.status(500).json({
    status: 'error',
    message: 'terjadi kegagalan pada server kami',
  });
}