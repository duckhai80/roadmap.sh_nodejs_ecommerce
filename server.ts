import { app } from "@/app";

const PORT = 3055;

const server = app.listen(PORT, () => {
  console.log(`Web server is running on port ${PORT}`);
});

process.on("SIGINT", () => {
  server.close(() => {
    console.log("Exit web server");
  });
});
