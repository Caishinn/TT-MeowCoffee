let selectedItem = "";
let selectedPrice = 0;
//let sizePrices = { Small: 0, Normal: 0 }; // price per size

function updateQty(amount) {
  const qtyInput = document.getElementById("dialog-qty");
  let current = parseInt(qtyInput.value);
  qtyInput.value = Math.max(1, current + amount);
}

function closeDialog() {
  document.getElementById("customize-dialog").classList.add("hidden");

  // 🔓 Unlock background scroll
  document.body.classList.remove("modal-open");
}

function confirmAdd() {
  const qtyInput = document.getElementById("dialog-qty");
  const qty = Math.max(1, parseInt(qtyInput?.value) || 1);

  const sugarInput = document.querySelector('input[name="sugar"]:checked');
  const sugar = sugarInput ? sugarInput.value : "Normal Sugar";

  const iceSection = document.getElementById("ice-section");
  let ice = "";

  // Only get ice if section is visible
  if (iceSection && iceSection.offsetParent !== null) {
    const iceInput = document.querySelector('input[name="ice"]:checked');
    ice = iceInput ? iceInput.value : "Normal Ice";
  }

  // Build final item name
  const fullItemName = ice
    ? `${selectedItem} (${sugar}, ${ice})`
    : `${selectedItem} (${sugar})`;

  // Add to cart (your custom function)
  addToCart(fullItemName, selectedPrice, qty);

  // Clean up
  closeDialog();
  resetDialog();
}

function showDialog(itemName, price) {
  selectedItem = itemName;
  selectedPrice = price;

  // Show/Hide ice section based on item
  const iceSection = document.getElementById("ice-section");
  const hasIce = !itemName.toLowerCase().includes("frappe"); // You can customize this check

  if (iceSection) {
    iceSection.style.display = hasIce ? "block" : "none";
  }

  resetDialog(); // Always reset after deciding about ice section

  document.getElementById("dialog-title").textContent = `Order - ${itemName}`;
  document.getElementById("dialog-qty").value = 1;
  document.getElementById("customize-dialog").classList.remove("hidden");
  // 🔒 Lock background scroll
  document.body.classList.add("modal-open");
}

// Reset dialog options
function resetDialog() {
  // Reset sugar
  const sugar = document.querySelectorAll('input[name="sugar"]');
  sugar.forEach((option) => {
    option.checked = option.value === "Normal Sugar";
  });

  // Reset ice only if ice section is visible
  const iceSection = document.getElementById("ice-section");
  if (iceSection && iceSection.style.display !== "none") {
    const iceOptions = document.querySelectorAll('input[name="ice"]');
    iceOptions.forEach((option) => {
      option.checked = option.value === "Normal Ice";
    });
  }

  // Reset quantity
  const qtyInput = document.getElementById("dialog-qty");
  if (qtyInput) qtyInput.value = 1;
}
