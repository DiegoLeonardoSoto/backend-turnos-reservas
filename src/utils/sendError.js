export function sendError(res, error, fallbackMessage) {
    const statusCode = error.statusCode ?? 500
    const message = statusCode === 500 ? fallbackMessage : error.message
    if (statusCode === 500) console.error(error)

    if (res.headersSent) return

    if (res.req?.accepts('html')) {
        return res.status(statusCode).render('error', { statusCode, message })
    }
    return res.status(statusCode).json({ status: 'error', message })
}
