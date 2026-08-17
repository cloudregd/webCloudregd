const offerIdInput = document.getElementById("offerIdInput");
const lookupForm = document.getElementById("lookupForm");
const offerError = document.getElementById("offerError");
const offerPreviewWrap = document.getElementById("offerPreviewWrap");
const offerActions = document.getElementById("offerActions");
const downloadBtn = document.getElementById("downloadBtn");

function normalizeId(value) {
  return value.trim().toUpperCase();
}

function showError(message) {
  offerError.textContent = message;
  offerError.classList.add("visible");
  offerPreviewWrap.classList.remove("visible");
  offerActions.classList.remove("visible");
}

function hideError() {
  offerError.classList.remove("visible");
}

function renderOfferLetter(data) {
  document.getElementById("olName").textContent = data.name;
  document.getElementById("olInternship").textContent = data.internshipName;
  document.getElementById("olDuration").textContent = data.duration;
  document.getElementById("olDate").textContent = data.date;
  document.getElementById("olOfferId").textContent = data.offerId;

  hideError();
  offerPreviewWrap.classList.add("visible");
  offerActions.classList.add("visible");
  offerPreviewWrap.scrollIntoView({ behavior: "smooth", block: "start" });
}

function lookupOfferLetter(id) {
  const normalizedId = normalizeId(id);

  if (!normalizedId) {
    showError("Please enter an offer ID.");
    return;
  }

  const record = OFFER_LETTERS[normalizedId];

  if (!record) {
    showError(`No offer letter found for ID "${normalizedId}". Please check and try again.`);
    return;
  }

  renderOfferLetter(record);

  const url = new URL(window.location.href);
  url.searchParams.set("id", normalizedId);
  window.history.replaceState({}, "", url);
}

lookupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  lookupOfferLetter(offerIdInput.value);
});

downloadBtn.addEventListener("click", () => {
  const element = document.getElementById("offerLetterTemplate");
  const id = document.getElementById("olOfferId").textContent || "offer-letter";

  const options = {
    margin: [10, 10, 10, 10],
    filename: `CloudRegd-OfferLetter-${id}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  downloadBtn.disabled = true;
  downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';

  html2pdf()
    .set(options)
    .from(element)
    .save()
    .then(() => {
      downloadBtn.disabled = false;
      downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download PDF';
    })
    .catch(() => {
      downloadBtn.disabled = false;
      downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download PDF';
      alert("Could not generate PDF. Please try again.");
    });
});

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const idFromUrl = params.get("id");

  if (idFromUrl) {
    offerIdInput.value = idFromUrl;
    lookupOfferLetter(idFromUrl);
  }
});
