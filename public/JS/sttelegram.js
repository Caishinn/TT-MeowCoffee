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
  fetch("/send-receipt", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: text }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (!data.success) {
        console.error("Telegram Error:", data.error);
      }
    })
    .catch((err) => console.error("Fetch error:", err));
}
