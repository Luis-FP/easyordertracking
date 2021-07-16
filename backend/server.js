import express from "express";
import secure from "express-force-https";
import path from "path";
import config from "./config";
import mongoose from "mongoose";
import bodyParser from "body-parser"
import userRoute from "./routes/userRoute";
import uploadRoute from './routes/uploadRoute';

import sendEmailRoute from './routes/sendEmailRoute';
import secureRoute from './routes/secureRoute';
import reportesRoute from "./routes/reportesRoute";

const mongodbUrl = config.MONGODB_URL;
mongoose
  .connect(mongodbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .catch((error) => console.log(error.reason));


const app = express();
//produccion.
const pathDominio = process.env.BUILD;
if (pathDominio === "build") {
  app.use(secure);
}


app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json({ limit: "3mb" }));
// cronograma de envio de emails de eficiencia

app.use("/api/uploads", uploadRoute);
app.use("/api/users", userRoute);
app.use("/api/email", sendEmailRoute);
app.use("/api/secure", secureRoute);
app.use("/api/reportes", reportesRoute);
app.use(express.static(path.join(__dirname, "/../frontend/" + pathDominio)));
app.get("*", (req, res) => {
  res.sendFile(path.join(`${__dirname}/../frontend/${pathDominio}/index.html`));
});

// app.use("/uploads", express.static(path.join(__dirname, "/../uploads")));

app.listen(config.PORT, () => {
  console.log("Server started at https://localhost:5000");
});

