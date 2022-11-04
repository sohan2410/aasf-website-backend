// eslint-disable-next-line no-unused-vars, no-shadow
export default function errorHandler(err, _, res, __) {
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong, please try again.',
  });
}
