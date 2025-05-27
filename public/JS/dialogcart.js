let selectedItem = "";
let selectedPrice = 0;

function showDialog(itemName, price) {
  selectedItem = itemName;
  selectedPrice = price;
  document.getElementById("dialog-title").textContent = `Order - ${itemName}`;
  document.getElementById("dialog-qty").value = 1;
  document.getElementById("customize-dialog").classList.remove("hidden");
}

function updateQty(amount) {
  const qtyInput = document.getElementById("dialog-qty");
  let current = parseInt(qtyInput.value);
  qtyInput.value = Math.max(1, current + amount);
}

function closeDialog() {
  document.getElementById("customize-dialog").classList.add("hidden");
}

function confirmAdd() {
  const qty = parseInt(document.getElementById("dialog-qty").value);
  const sugar = document.querySelector('input[name="sugar"]:checked').value;
  //const size = document.querySelector('input[name="size"]:checked').value;

  //const fullItemName = `${selectedItem} (${size}, ${sugar} sugar)`;
  const fullItemName = `${selectedItem} (${sugar} sugar)`;

  addToCart(fullItemName, selectedPrice, qty);
  closeDialog();
}
function showDialog(itemName, price) {
  selectedItem = itemName;
  selectedPrice = price;
  document.getElementById("dialog-title").textContent = `Order - ${itemName}`;
  document.getElementById("dialog-qty").value = 1;

  // Show dialog
  document.getElementById("customize-dialog").classList.remove("hidden");

  // 🔒 Lock background scroll
  document.body.classList.add("modal-open");
}

function closeDialog() {
  document.getElementById("customize-dialog").classList.add("hidden");

  // 🔓 Unlock background scroll
  document.body.classList.remove("modal-open");
}
