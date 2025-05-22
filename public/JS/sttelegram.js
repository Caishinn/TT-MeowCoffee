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

function sendToTelegram(message) {
  fetch("/send-telegram", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: message, // ✅ send the actual message you passed in
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        console.log("✅ Receipt sent to Telegram");
      } else {
        console.error("❌ Failed to send receipt:", data.error);
      }
    })
    .catch((err) => {
      console.error("❌ Telegram request failed:", err);
    });
}
