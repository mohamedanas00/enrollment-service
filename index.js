import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import initApp from "./src/index.routes.js";
const app = express();
dotenv.config();

app.use(cors());

initApp(app, express);


const port = +process.env.PORT;
app.listen(port, () => console.log(`App listening on port:${port}!`));
