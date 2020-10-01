// eslint-disable-next-line no-unused-vars, no-shadow
export default function errorHandler(err, req, res, next) {
  res.status(err.status || 500).json({
    message: err.message || "Something went wrong, please try again.",
  });
}
