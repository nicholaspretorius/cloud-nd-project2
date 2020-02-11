import app from "./app";

// Set the network port
const port = process.env.PORT || 8082;
// Start the Server
const server = app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
});

export default server;