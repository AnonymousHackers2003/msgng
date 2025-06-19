const fs = require("fs");
const path = require("path");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed." };
  }

  const body = JSON.parse(event.body || "{}");
  const { username, message } = body;

  if (!username || !message) {
    return { statusCode: 400, body: "Bad request" };
  }

  const filePath = path.join(__dirname, "../../data/messages.json");
  const messages = JSON.parse(fs.readFileSync(filePath));

  const newMessage = {
    id: Date.now(),
    username,
    message,
    time: new Date().toISOString()
  };

  messages.push(newMessage);
  fs.writeFileSync(filePath, JSON.stringify(messages, null, 2));

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true, message: "Message sent" })
  };
};
