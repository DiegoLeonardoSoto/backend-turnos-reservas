
import config from './config/env.config.js'
import { server } from './app.js'
import { connectDB } from './config/database.config.js'




const startServer = async () => {
    try {
        await connectDB()
        server.listen(config.port, () => {
            console.log(`La app esta corriendo en http://localhost:${config.port}`)
        })
    } catch (error) {
        console.error('No se pudo iniciar la aplicacion', error.message)
        process.exit(1)
  }
}

startServer()
