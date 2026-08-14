const certIdInput = document.getElementById("certIdInput");
const lookupForm = document.getElementById("lookupForm");
const certError = document.getElementById("certError");
const certPreviewWrap = document.getElementById("certPreviewWrap");
const certActions = document.getElementById("certActions");
const downloadBtn = document.getElementById("downloadBtn");

function normalizeId(value) {
  return value.trim().toUpperCase();
}

function showError(message) {
  certError.textContent = message;
  certError.classList.add("visible");
  certPreviewWrap.classList.remove("visible");
  certActions.classList.remove("visible");
}

function hideError() {
  certError.classList.remove("visible");
}

function renderCertificate(data) {
  document.getElementById("certRecipient").textContent = data.name;
  document.getElementById("certInternship").textContent = data.internshipName;
  document.getElementById("certDepartment").textContent = data.department;
  document.getElementById("certDuration").textContent = data.duration;
  document.getElementById("certIssueDate").textContent = data.issueDate;
  document.getElementById("certIdDisplay").textContent = data.certificateId;

  hideError();
  certPreviewWrap.classList.add("visible");
  certActions.classList.add("visible");
  certPreviewWrap.scrollIntoView({ behavior: "smooth", block: "start" });
}

function lookupCertificate(id) {
  const normalizedId = normalizeId(id);

  if (!normalizedId) {
    showError("Please enter a certificate ID.");
    return;
  }

  const record = CERTIFICATES[normalizedId];

  if (!record) {
    showError(`No certificate found for ID "${normalizedId}". Please check and try again.`);
    return;
  }

  renderCertificate(record);

  const url = new URL(window.location.href);
  url.searchParams.set("id", normalizedId);
  window.history.replaceState({}, "", url);
}

lookupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  lookupCertificate(certIdInput.value);
});

downloadBtn.addEventListener("click", () => {
  const element = document.getElementById("certificateTemplate");
  const id = document.getElementById("certIdDisplay").textContent || "certificate";

  const options = {
    margin: 0,
    filename: `CloudRegd-Certificate-${id}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
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
    certIdInput.value = idFromUrl;
    lookupCertificate(idFromUrl);
  }
});
