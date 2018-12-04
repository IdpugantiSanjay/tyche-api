import * as Hapi from "hapi";

import { recordRoutes } from "./routes/records.route";

import mongoose from "mongoose";
import { connectionString } from "./config";

mongoose
  .connect(
    connectionString,
    { useNewUrlParser: true }
  )
  .catch(err => console.log(err));

const server = new Hapi.Server({ port: 3000 || process.env.port });

server.route(recordRoutes);

// start the server
const init = async () => {
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

init();
