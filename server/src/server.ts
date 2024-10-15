import dotenv from 'dotenv';
import express from 'express';
dotenv.config();


import routes from './routes/index.js';

// Create an instance of express
const app = express();

// Set PORT
const PORT = process.env.PORT || 3001;

app.use(express.static('../client/dist'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(routes);

app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));