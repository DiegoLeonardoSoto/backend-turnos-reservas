import mongoose from "mongoose";
import config from "./env.config.js";

export const connectDB = async () => {
    if (!config.mongoUri) {
      throw new Error('Falta configurar MONGO_URI como variable de entorno')
    }

    await mongoose.connect(config.mongoUri)
    console.log('Conectado a MongoDB')
}
