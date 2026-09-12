import AuthenticationTokenManager from "../../Applications/security/AuthenticationTokenManager.js";
import AuthenticationError from "../../Commons/exceptions/AuthenticationError.js";
import container from "../container.js";

export default async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if(!token) {
    const authenticationError = new AuthenticationError("Missing authentication");

    return next(authenticationError);
  }

  try {
    await container.getInstance(AuthenticationTokenManager.name).verifyAccessToken(token);
  } catch (err) {
    void err;
    const authenticationError = new AuthenticationError('access token tidak valid');
    return next(authenticationError);
  }

  req.credentials = await container.getInstance(AuthenticationTokenManager.name).decodePayload(token);

  next();
}