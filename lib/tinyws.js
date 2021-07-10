let ws = require("ws");

const tinyws =
  (wsOptions, wss = new ws.Server({ ...wsOptions, noServer: true })) =>
  async (req, _, next) => {
    const upgradeHeader = (req.headers.upgrade || "")
      .split(",")
      .map((s) => s.trim());

    // When upgrade header contains "websocket" it's index is 0
    if (upgradeHeader.indexOf("websocket") === 0) {
      req.ws = () =>
        new Promise((resolve) => {
          wss.handleUpgrade(req, req.socket, Buffer.alloc(0), (ws) => {
            wss.emit("connection", ws, req);
            resolve(ws);
          });
        });
    }

    await next();
  };

module.exports = tinyws;
