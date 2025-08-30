import jwt from 'jsonwebtoken';

export const signToken = (user) => {
  return jwt.sign(
    { id: user._id.toString(), name: user.name,email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const verifyHttpToken = (req) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null;

  if (!token) throw new Error('No token provided');

  return jwt.verify(token, process.env.JWT_SECRET);
};

export const verifySocketToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
