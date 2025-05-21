// Load cart and history from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let orderHistory = JSON.parse(localStorage.getItem("orderHistory")) || [];

// Save functions
function saveOrderHistory() {
  localStorage.setItem("orderHistory", JSON.stringify(orderHistory));
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Generate unique order ID
function generateOrderId() {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${datePart}-${randomPart}`;
}

// Update cart item count in header
function updateCartCount() {
  const el = document.getElementById("cart-count");
  if (el) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    el.innerText = count;
  }
}
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
});

// Change quantity by delta
function changeQty(id, delta) {
  const input = document.getElementById(id);
  let value = parseInt(input.value) || 1;
  value = Math.max(1, value + delta);
  input.value = value;
}
function changeItemQty(index, delta) {
  cart[index].quantity += delta;
  if (cart[index].quantity < 1) {
    cart.splice(index, 1);
  }
  saveCart();
  loadCartPage();
  updateCartCount();
}

// Qty buttons
function increaseQty(btn) {
  const input = btn.parentElement.querySelector("input");
  input.value = parseInt(input.value) + 1;
}

function decreaseQty(btn) {
  const input = btn.parentElement.querySelector("input");
  if (parseInt(input.value) > 1) {
    input.value = parseInt(input.value) - 1;
  }
}

// Remove from cart
function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  loadCartPage();
  updateCartCount();
}

// Confirm Payment + Show Modal Summary
function confirmPayment() {
  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  const orderId = generateOrderId();
  const orderDate = new Date();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Fill in modal data
  document.getElementById("summary-id").textContent = orderId;
  document.getElementById("summary-date").textContent =
    orderDate.toLocaleString();
  document.getElementById("summary-total").textContent = total.toFixed(2);

  const summaryItems = document.getElementById("summary-items");
  summaryItems.innerHTML = "";

  cart.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.name} x ${item.quantity} — $${(
      item.price * item.quantity
    ).toFixed(2)}`;
    summaryItems.appendChild(li);
  });

  // Show modal and lock background scroll
  const modal = document.getElementById("order-summary-modal");
  modal.classList.add("show");
  modal.style.display = "flex";
  document.body.classList.add("modal-open");

  // Close modal handler
  const closeButton = document.querySelector(".close-button");
  if (closeButton) {
    closeButton.onclick = () => {
      modal.classList.remove("show");
      modal.style.display = "none";
      document.body.classList.remove("modal-open");
    };
  }

  // Final confirmation (Place Order button)
  const placeOrderBtn = document.getElementById("final-confirm-btn");
  if (placeOrderBtn) {
    placeOrderBtn.onclick = () => {
      const newOrder = {
        id: orderId,
        date: orderDate.toISOString(),
        items: [...cart],
        total: total,
      };

      // 1. Send receipt to Telegram
      const message = formatTelegramMessage(newOrder);
      sendToTelegram(message);

      // 2. Save order to history at the start of the array (newest first)
      orderHistory.unshift(newOrder);
      saveOrderHistory();

      // 3. Clear cart
      cart = [];
      saveCart();
      updateCartCount();

      // 4. Close modal and redirect
      modal.classList.remove("show");
      modal.style.display = "none";
      document.body.classList.remove("modal-open");

      alert("✅ Payment successful! Order saved.");
      window.location.href = "index.html";
    };
  }
}

// Close modal handlers
window.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("order-summary-modal");

  document.querySelector(".close-button").addEventListener("click", () => {
    modal.classList.remove("show");
    setTimeout(() => (modal.style.display = "none"), 300);
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("show");
      setTimeout(() => (modal.style.display = "none"), 300);
    }
  });

  loadCartPage();
  updateCartCount();
});

// Modal close handlers - only once registered on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  const orderHistoryContainer = document.getElementById(
    "order-history-container"
  );
  const orders = JSON.parse(localStorage.getItem("orderHistory")) || [];

  if (orders.length === 0) {
    orderHistoryContainer.innerHTML = "<p>No past orders found.</p>";
    return;
  }

  orderHistoryContainer.innerHTML = ""; // Clear before rendering

  orders.forEach((order, index) => {
    const orderDiv = document.createElement("div");
    orderDiv.classList.add("order");

    // Parse date/time nicely
    const orderDate = new Date(order.date);
    const dateString = orderDate.toLocaleDateString(); // e.g. "5/19/2025"
    const timeString = orderDate.toLocaleTimeString(); // e.g. "3:45:23 PM"

    // Build items list HTML
    const itemsHtml = order.items
      .map(
        (item) =>
          `<li>${item.name} x ${item.quantity} - $${(
            item.price * item.quantity
          ).toFixed(2)}</li>`
      )
      .join("");

    orderDiv.innerHTML = `
      <h3>Order ID: ${order.id}</h3>
      <p><strong>Date:</strong> ${dateString}</p>
      <p><strong>Time:</strong> ${timeString}</p>
      <ul>${itemsHtml}</ul>
      <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
      <hr />
    `;

    orderHistoryContainer.appendChild(orderDiv);
  });
});
