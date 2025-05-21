function formatTelegramMessage(order) {
  let message = `🧾 *New Order Received!*\n`;
  message += `🆔 *Order ID:* ${order.id}\n`;
  message += `📅 *Date:* ${new Date(order.date).toLocaleString()}\n`;
  message += `📦 *Items:*\n`;

  order.items.forEach((item) => {
    message += `• ${item.name} x${item.quantity} — $${(
      item.price * item.quantity
    ).toFixed(2)}\n`;
  });

  message += `\n💰 *Total:* $${order.total.toFixed(2)}`;
  return message;
}

function sendToTelegram(text) {
  const botToken = "8101505368:AAF0lTcN7V8VgNPGOQUFdnhKe4EiIjy2vyQ"; // 🔁 Replace this
  const chatId = "5972075583"; // 🔁 Replace this

  fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: "Markdown",
    }),
  })
    .then((res) => {
      if (!res.ok) {
        console.error("Telegram error:", res.statusText);
      }
    })
    .catch((err) => console.error("Telegram error:", err));
}
