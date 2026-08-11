export function sendError(res, error, fallbackMessage) {
    const statusCode = error.statusCode ?? 500
    if(statusCode === 500) console.error(error)
    return res.status(statusCode).json(
        {
          status: 'error',
          message: statusCode === 500 ? fallbackMessage : error.message
        }
    )}
