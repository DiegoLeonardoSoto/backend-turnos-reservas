export function validateBody(schema) {

    return (req, res, next) => {
        const parsed = schema.safeParse(req.body)
        if (!parsed.success) {
            return res.status(400).json({
                status: 'error',
                message: parsed.error.issues.map((i)=> i.message).join(", ")
            })
        }
        req.body = parsed.data
        next()
    }

}

export function validateParams(schema) {

    return (req, res, next) => {
        const parsed = schema.safeParse(req.params)
        if (!parsed.success) {
            return res.status(400).json({
                status: 'error',
                message: parsed.error.issues.map((i)=> i.message).join(", ")
            })
        }
        req.params = parsed.data
        next()
    }

}


export function validateQuery(schema) {

    return (req, res, next) => {
        const parsed = schema.safeParse(req.query)
        if (!parsed.success) {
            return res.status(400).json({
                status: 'error',
                message: parsed.error.issues.map((i)=> i.message).join(", ")
            })
        }
        req.query = parsed.data
        next()
    }

}
