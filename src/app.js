import express from 'express'
import servicesRouter from './routes/services.router.js'
import bookingsRouter from './routes/bookings.router.js'
import viewsRouter from './routes/views.router.js';
import { engine } from 'express-handlebars';
import { createServer } from 'node:http'
import { Server } from 'socket.io'
import { servicesService } from './dependencies/services.dependency.js';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express()
export const server = createServer(app)
const io = new Server(server);




app.use(express.json())
app.use(express.static('public'))

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

// Logger middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
})

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to the Turnos Reservas API'
  })
})

//routes
app.use('/api/services', servicesRouter)
app.use('/api/bookings', bookingsRouter)
app.use('/views', viewsRouter);

app.use(notFound);
app.use(errorHandler);

//websockets
io.on('connection', (socket) => {

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });

    socket.on('toggle-available', async(id) => {
        const updatedService = await servicesService.toggleAvailability(id)
        if(!updatedService) return
        io.emit('available-changed', updatedService)
    });

});
