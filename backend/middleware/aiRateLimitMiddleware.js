const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 10;

const requestStore = new Map();

const aiRateLimitMiddleware = (req, res, next) => {
  const identifier = req.user?._id?.toString() || req.ip;
  const now = Date.now();

  const current = requestStore.get(identifier) || {
    count: 0,
    resetAt: now + WINDOW_MS
  };

  if (now > current.resetAt) {
    current.count = 0;
    current.resetAt = now + WINDOW_MS;
  }

  current.count += 1;
  requestStore.set(identifier, current);

  if (current.count > MAX_REQUESTS) {
    const retryAfter = Math.ceil((current.resetAt - now) / 1000);
    return res.status(429).json({
      message: "Too many AI generation requests. Please try again later.",
      retryAfter
    });
  }

  next();
};

export default aiRateLimitMiddleware;
