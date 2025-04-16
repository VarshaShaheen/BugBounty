// loader.js

// Show loader (if you want to trigger it manually)
function showLoader() {
  const loader = document.getElementById("loader");
  if (loader) {
    loader.style.display = "flex";
  }
}

// Hide loader after data is loaded
function hideLoader() {
  const loader = document.getElementById("loader");
  if (loader) {
    loader.style.display = "none";
  }
}

// Optionally, show loader as soon as DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  showLoader();
});
