import express from 'express' 
import cors from "cors"
import bodyParser from "body-parser";
import connectDB from './db/database.js';

import usersRouter from "./router/usersRouter.js"
import linksRouter from "./router/linksRouter.js"
import linksController from "./controllers/linksController.js";

connectDB();

const app = express();
console.log('PORT:', process.env.PORT);
console.log('DB_URI:', process.env.DB_URI);
const port = process.env.PORT

app.use(cors());
app.use(bodyParser.json());
app.get('/:id', linksController.redirectToOriginalUrl);


app.use("/users",usersRouter)
app.use("/links",linksRouter)

app.listen(port, () => {
    console.log(`listening on http://localhost:${port}`)
  })