/* ----------------------------------------------------------- *
 * 1.  Run immediately when DOM is ready
 * ----------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const { status, time_in_second } = await fetchModeStatus();

    if (status === "focus") {
      startCountdown(Math.ceil(time_in_second)); // resume
    } else {
      // not in focus mode → hide banner entirely
      document.getElementById("focus-banner")?.remove();
    }
  } catch (err) {
    console.error(err);
    // on error just remove banner so user isn't stuck
    document.getElementById("focus-banner")?.remove();
  }
});

/* ----------------------------------------------------------- *
 * 2.  Fetch /mode-status and return JSON
 * ----------------------------------------------------------- */
async function fetchModeStatus() {
  const res = await fetch(`${BASE_URL}/mode-status`, {
    method: "GET",
    credentials: "include",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error(`API ${res.status}`);
  const json = await res.json();
  return json.data; // { status: 'focus', time_in_second: … }
}

/* ----------------------------------------------------------- *
 * 3.  Countdown logic
 * ----------------------------------------------------------- */
function startCountdown(totalSeconds) {
  const cd = document.getElementById("countdown");
  if (!cd) return;

  let secondsLeft = totalSeconds;

  const tick = () => {
    const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
    const ss = String(secondsLeft % 60).padStart(2, "0");
    cd.textContent = `00:${mm}:${ss} remaining`;

    if (--secondsLeft >= 0) {
      setTimeout(tick, 1000);
    } else {
      cd.textContent = "00:00:00 finished";
    }
  };

  tick();
}

/* ----------------------------------------------------------- *
 * 4.  End‑focus button
 * ----------------------------------------------------------- */
document.getElementById("end-focus")?.addEventListener("click", async () => {
  // call your own endpoint or just close Slack locally
  await window.electronAPI?.closeSlack?.();

  // remove banner from UI
  document.getElementById("focus-banner")?.remove();
});
