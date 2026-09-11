export function notFound(req, res) {
  const statusCode = 404
  const message = 'Página no encontrada'

  if (req.accepts('html')) {
    return res.status(statusCode).render('error', { statusCode, message })
  }

  return res.status(statusCode).json({ status: 'error', message })
}
