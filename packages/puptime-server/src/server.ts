import app from "./app";
const PORT = 3001;

const server = app.listen(PORT, () => {
  console.log("Express server listening on port " + PORT);
});

const shutDown = () => {
  server.close(() => {
    console.log("Closed out remaining connections");
    process.exit(0);
  });
};
process.on("SIGTERM", shutDown);
process.on("SIGINT", shutDown);
