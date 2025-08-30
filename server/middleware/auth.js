import { verifyHttpToken } from "../utils/jwt.js";

const requireAuth = (req, res, next) => {
  try {
    const payload = verifyHttpToken(req);
    req.user = { id: payload.id, email: payload.email };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

export { requireAuth };
