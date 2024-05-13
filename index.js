import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import initApp from "./src/index.routes.js";
import { sendMessage } from "./src/utils/rabbitMqSend.js";
import { receivedMessage } from "./src/utils/rabbitMqReceived.js";
const app = express();
dotenv.config();

app.use(cors());

initApp(app, express);

// const msg={"doctorId":"2","patientId":"3","Operation":"msa mne leko"};
// await sendMessage("doctor-queue",msg)
const messages = await receivedMessage("mohamed.edris7688@gmail.com");
console.log(messages);
const port = +process.env.PORT;
app.listen(port, () => console.log(`App listening on port:${port}!`));
