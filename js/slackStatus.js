document.addEventListener("DOMContentLoaded", () => {
  const statusButtons = document.querySelectorAll(".status-btn");
  const briefStatusDot = document.getElementById("briefStatusDot");
  const statusDot = document.getElementById("statusDot");
  const briefStatusLabel = document.getElementById("briefStatusLabel");

  if (
    !statusButtons.length ||
    !briefStatusDot ||
    !briefStatusLabel ||
    !statusDot
  )
    return true;

  const statusColors = {
    Active: "bg-green-400",
    Offline: "bg-gray-300",
    DND: "bg-red-500",
  };

  let currentStatus = "Active";

  function updateStatusDisplay(newStatus) {
    currentStatus = newStatus;

    statusButtons.forEach((btn) => {
      btn.classList.remove("bg-gray-900", "text-white");
      btn.classList.add("bg-gray-100", "text-gray-800");
    });

    const activeBtn = Array.from(statusButtons).find(
      (btn) => btn.dataset.status === newStatus
    );
    if (activeBtn) {
      activeBtn.classList.add("bg-gray-900", "text-white");
      activeBtn.classList.remove("bg-gray-100", "text-gray-800");
    }

    for (const dot of [briefStatusDot, statusDot]) {
      dot.className =
        dot.id === "statusDot"
          ? "w-3 h-3 rounded-full"
          : "w-2 h-2 rounded-full";
      dot.classList.add(statusColors[newStatus] || "bg-gray-300");
    }

    briefStatusLabel.textContent = newStatus;
  }

  async function postSlackStatus(status) {
    if (status == "DND") {
    //   await window.electronAPI.closeSlack();
      return
    }
    let payload = {
      status: status.toLowerCase(),
      user_id: userId,
    };

    try {
      const response = await fetch(`${BASE_URL}/slack-status/update`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // 👈 VERY IMPORTANT
        },
        body: JSON.stringify(payload), // 👈 convert to JSON string
      });

      if (!response.ok) {
        alert("Failed to update Slack status");
      }

      console.log("Slack status updated:", status);
    } catch (err) {
      alert(JSON.stringify(err));
      console.error(err.message);
    }
  }

  statusButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const newStatus = btn.dataset.status;
      updateStatusDisplay(newStatus);
      postSlackStatus(newStatus);
    });
  });

  updateStatusDisplay(currentStatus);
});
