import dotenv from 'dotenv';
dotenv.config();


if(!process.env.PORT) {
  console.error('Falta puerto')
  process.exit(1);
}

if(!process.env.NODE_ENV) {
  console.error('Falta NODE_ENV')
  process.exit(1);
}

const config = {
  port: Number(process.env.PORT),
  nodeEnv: process.env.NODE_ENV,
}

export default config;
