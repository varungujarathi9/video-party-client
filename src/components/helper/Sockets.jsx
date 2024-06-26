import io from "socket.io-client";
import configs from "../../configs.json";

// uncomment this while running in gcp
const serverSocket = io.connect(`${configs.SERVER}`, {
  transports: ["websocket"],
  upgrade: false,
  reconnect: true,
});

export { serverSocket };
