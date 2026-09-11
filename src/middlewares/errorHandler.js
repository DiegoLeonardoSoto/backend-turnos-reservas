export function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode ?? 500
  const message = statusCode === 500 ? 'Error interno del servidor' : err.message

  if (statusCode === 500) console.error(err)

  if (req.accepts('html')) {
    return res.status(statusCode).render('error', { statusCode, message })
  }

  return res.status(statusCode).json({ status: 'error', message })
}
