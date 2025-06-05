// menu search
function filterMenuItems(event) {
  const input = document.getElementById("menuSearchInput");
  const filter = input.value.trim().toLowerCase();
  const items = document.querySelectorAll(".menu-item");

  let firstMatch = null;
  let matchCount = 0;

  items.forEach((item) => {
    const name = item.querySelector("h3").textContent.toLowerCase();
    const match = name.includes(filter);
    item.style.display = match ? "" : "none";

    if (match && !firstMatch) {
      firstMatch = item;
    }

    if (match) matchCount++;
  });

  const noResults = document.getElementById("no-results-message");
  if (noResults) {
    noResults.style.display = matchCount === 0 ? "block" : "none";
  }

  // If user pressed Enter and there's a match, focus the first one
  if (event && event.key === "Enter" && firstMatch) {
    firstMatch.scrollIntoView({ behavior: "smooth", block: "center" });
    firstMatch.querySelector("button")?.focus(); // optional: focus Add button
  }
}
