// menu search
function filterMenuItems(event) {
  const input = document.getElementById("menuSearchInput");
  const filter = input.value.trim().toLowerCase();
  const items = document.querySelectorAll(".menu-item");

  let matchCount = 0;

  items.forEach((item) => {
    const name = item.querySelector("h3").textContent.toLowerCase();
    const match = name.includes(filter);
    item.style.display = match ? "" : "none";

    if (match) matchCount++;
  });

  const noResults = document.getElementById("no-results-message");
  if (noResults) {
    noResults.style.display = matchCount === 0 ? "block" : "none";
  }

  // Handle Enter key
  if (event && event.key === "Enter") {
    event.preventDefault(); // Prevent default scroll behavior

    if (filter.length > 0) {
      input.blur(); // Close mobile keyboard if something is typed
    } else {
      input.blur(); // Also blur when no text (reset focus)
    }

    return false;
  }

  // Additionally, blur input if cleared manually
  if (filter.length === 0) {
    input.blur(); // Reset focus when empty
  }
}

function toggleClearButton() {
  const input = document.getElementById("menuSearchInput");
  const clearBtn = document.getElementById("clearSearchBtn");
  clearBtn.style.display = input.value ? "block" : "none";
}

function clearSearch() {
  const input = document.getElementById("menuSearchInput");
  input.value = "";
  input.focus();
  document.getElementById("clearSearchBtn").style.display = "none";
  filterMenuItems(); // Re-run search to reset view
}
