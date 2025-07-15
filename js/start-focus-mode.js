/* DOM refs */
const modal = document.getElementById("modal");
const openFocusModal = document.getElementById("open-modal");
const closeFocusModal = document.getElementById("close-modal");
const cancelFocusModal = document.getElementById("btn-cancel");
const focusModalStart = document.getElementById("btn-start");

/* helpers */
const toggleModal = (show) =>
  modal.classList[show ? "remove" : "add"]("hidden");

openFocusModal.onclick = () => toggleModal(true);
closeFocusModal.onclick = cancelFocusModal.onclick = () => toggleModal(false);

/* ───────────────────────────────────────────────────────────
           Start Focus flow
        ─────────────────────────────────────────────────────────── */
focusModalStart.addEventListener("click", async () => {
  const focusModeDuration = document.getElementById("duration").value;
  const slackStatus = document.getElementById("slack-status").value;

  const closeApps = { slack: false, gmail: false, calendar: false };
  document.querySelectorAll(".app-card").forEach((card) => {
    const key = card.dataset.app; // "slack" | "gmail" | "calendar"
    closeApps[key] = card.querySelector("input").checked;
  });

  /* build statusUpdates object */
  const statusUpdates = { slack: slackStatus };

  try {
    const res = await fetch(`${BASE_URL}/focus-mode`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        duration: focusModeDuration,
        closeApps,
        statusUpdates,
      }),
    });

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(`API ${res.status}: ${msg}`);
    }

    // close slack application
    if (closeApps.slack) {
      await window.electronAPI.closeSlack();
    }

    window.location.reload();
  } catch (err) {
    console.error(err);
    alert(err.message || "Request failed – check console");
  }
});
