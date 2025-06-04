let selectedItem = "";
let sizePrices = { S: 0, M: 0 }; // Match with HTML values

function updateQty(amount) {
  const qtyInput = document.getElementById("dialog-qty");
  let current = parseInt(qtyInput.value);
  qtyInput.value = Math.max(1, current + amount);
}

function closeDialog() {
  document.getElementById("customize-dialog").classList.add("hidden");
  document.body.classList.remove("modal-open"); // 🔓 Unlock scroll
}

function confirmAdd() {
  const qty = Math.max(
    1,
    parseInt(document.getElementById("dialog-qty")?.value) || 1
  );

  const sugar =
    document.querySelector('input[name="sugar"]:checked')?.value ||
    "Normal Sugar";
  const size =
    document.querySelector('input[name="size"]:checked')?.value || "S";
  const price = sizePrices[size] || sizePrices.S;

  let ice = "";
  const iceSection = document.getElementById("ice-section");
  if (iceSection && iceSection.offsetParent !== null) {
    ice =
      document.querySelector('input[name="ice"]:checked')?.value ||
      "Normal Ice";
  }

  const fullItemName = ice
    ? `${selectedItem} (${size} Size, ${sugar}, ${ice})`
    : `${selectedItem} (${size} Size, ${sugar})`;

  addToCart(fullItemName, price, qty); // 🔧 Ensure this function exists

  closeDialog();
  resetDialog();
}

function showDialog(itemName, basePrice) {
  selectedItem = itemName;

  // Assign prices for S and M
  sizePrices = {
    S: basePrice,
    M: basePrice + 0.5,
  };

  // Ice visibility logic
  const iceSection = document.getElementById("ice-section");
  const hasIce = !itemName.toLowerCase().includes("frappe");
  if (iceSection) {
    iceSection.style.display = hasIce ? "block" : "none";
  }

  resetDialog();

  document.getElementById("dialog-title").textContent = `Order - ${itemName}`;
  document.getElementById("dialog-qty").value = 1;
  document.getElementById("customize-dialog").classList.remove("hidden");
  document.body.classList.add("modal-open"); // 🔒 Lock scroll
}

function resetDialog() {
  // Reset sugar
  document.querySelectorAll('input[name="sugar"]').forEach((option) => {
    option.checked = option.value === "Normal Sugar";
  });

  // Reset ice
  const iceSection = document.getElementById("ice-section");
  if (iceSection && iceSection.style.display !== "none") {
    document.querySelectorAll('input[name="ice"]').forEach((option) => {
      option.checked = option.value === "Normal Ice";
    });
  }

  // Reset size
  document.querySelectorAll('input[name="size"]').forEach((option) => {
    option.checked = option.value === "S";
  });

  // Reset qty
  const qtyInput = document.getElementById("dialog-qty");
  if (qtyInput) qtyInput.value = 1;
}
