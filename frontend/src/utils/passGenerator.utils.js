/**
 * FootballHub High-Resolution Digital Match Pass Voucher Generator
 * Renders an authenticated match voucher ticket to canvas and triggers automatic PNG download.
 */
export const generateAndDownloadMatchPass = ({
  bookingId = "MATCH-PASS",
  turfName = "Football Turf Ground",
  turfAddress = "Bengaluru Pitch Ground",
  date,
  slots = [],
  expiresAt,
  bookerName = "Footballer",
  status = "CONFIRMED",
}) => {
  const canvas = document.createElement("canvas");
  const width = 1200;
  const height = 640;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  // 1. Background Fill with Deep Football Dark Theme
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, "#070b11");
  bgGrad.addColorStop(0.5, "#0b121c");
  bgGrad.addColorStop(1, "#080e15");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Decorative Outer Border with Emerald Accent
  ctx.strokeStyle = "rgba(16, 185, 129, 0.4)";
  ctx.lineWidth = 4;
  ctx.strokeRect(16, 16, width - 32, height - 32);

  // 3. Subtle Stadium Radial Glow
  const glowGrad = ctx.createRadialGradient(200, 200, 10, 200, 200, 300);
  glowGrad.addColorStop(0, "rgba(16, 185, 129, 0.15)");
  glowGrad.addColorStop(1, "transparent");
  ctx.fillStyle = glowGrad;
  ctx.fillRect(0, 0, width, height);

  // 4. Perforated Stub Divider (x = 340)
  ctx.setLineDash([10, 10]);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(340, 30);
  ctx.lineTo(340, height - 30);
  ctx.stroke();
  ctx.setLineDash([]); // Reset dash

  // 5. Left Stub Content (Pass Verification & Security Barcode)
  ctx.fillStyle = "#10b981";
  ctx.font = "bold 22px Inter, sans-serif";
  ctx.fillText("⚽ FOOTBALLHUB", 45, 75);

  ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
  ctx.font = "bold 13px Inter, sans-serif";
  ctx.fillText("OFFICIAL MATCHDAY PASS", 45, 100);

  // Verified Badge Box
  ctx.fillStyle = "rgba(16, 185, 129, 0.15)";
  ctx.strokeStyle = "rgba(16, 185, 129, 0.5)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(45, 130, 250, 110, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#34d399";
  ctx.font = "bold 13px Inter, sans-serif";
  ctx.fillText("STATUS", 65, 165);

  ctx.fillStyle = "#ffffff";
  ctx.font = "extrabold 22px Inter, sans-serif";
  ctx.fillText(String(status).toUpperCase(), 65, 195);

  ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
  ctx.font = "11px Inter, sans-serif";
  ctx.fillText("NON-MARKING BOOTS READY", 65, 220);

  // Simulated Security Barcode Blocks
  ctx.fillStyle = "#ffffff";
  const startX = 45;
  const startY = 280;
  for (let i = 0; i < 25; i++) {
    const barW = i % 3 === 0 ? 5 : i % 2 === 0 ? 8 : 3;
    const barH = 55;
    const curX = startX + i * 10;
    if (curX < 290) {
      ctx.fillRect(curX, startY, barW, barH);
    }
  }

  const passIdStr = String(bookingId || "PASS");
  ctx.fillStyle = "#94a3b8";
  ctx.font = "bold 11px monospace";
  ctx.fillText(`AUTH: #${passIdStr.slice(-10).toUpperCase()}`, 45, 360);

  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  ctx.font = "10.5px Inter, sans-serif";
  ctx.fillText("Scan or present voucher", 45, 410);
  ctx.fillText("at venue reception on arrival.", 45, 428);

  // 6. Right Main Voucher Content
  // Top Header
  ctx.fillStyle = "rgba(16, 185, 129, 0.9)";
  ctx.font = "bold 13px Inter, sans-serif";
  ctx.fillText("MATCHDAY RESERVATION VOUCHER", 380, 75);

  // Match Pass ID Header
  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  ctx.font = "bold 12px Inter, sans-serif";
  ctx.fillText("PASS ID", 380, 105);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 16px monospace";
  ctx.fillText(passIdStr, 445, 105);

  // Venue Title (Large)
  ctx.fillStyle = "#ffffff";
  ctx.font = "extrabold 32px Inter, sans-serif";
  ctx.fillText(turfName, 380, 165);

  // Venue Location
  ctx.fillStyle = "#a7f3d0";
  ctx.font = "medium 15px Inter, sans-serif";
  ctx.fillText(`📍 ${turfAddress}`, 380, 195);

  // Details Grid Boxes
  const boxY = 240;
  const boxW = 230;
  const boxH = 100;

  // Box 1: Match Date
  ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(380, boxY, boxW, boxH, 14);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#94a3b8";
  ctx.font = "bold 12px Inter, sans-serif";
  ctx.fillText("MATCH DATE", 400, boxY + 32);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 17px Inter, sans-serif";
  const dateStr = date
    ? new Date(date).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Match Day";
  ctx.fillText(dateStr, 400, boxY + 68);

  // Box 2: Slot Time
  ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.beginPath();
  ctx.roundRect(630, boxY, boxW, boxH, 14);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#10b981";
  ctx.font = "bold 12px Inter, sans-serif";
  ctx.fillText("RESERVED TIME SLOTS", 650, boxY + 32);

  ctx.fillStyle = "#34d399";
  ctx.font = "bold 17px monospace";
  let slotTimeStr = "06:00 AM - 07:00 AM";
  if (Array.isArray(slots) && slots.length > 0) {
    slotTimeStr = `${slots[0]?.startTime || "06:00 AM"} - ${slots[slots.length - 1]?.endTime || "07:00 AM"}`;
  } else if (typeof slots === "string" && slots.trim()) {
    slotTimeStr = slots.trim();
  }
  ctx.fillText(slotTimeStr, 650, boxY + 68);

  // Box 3: Player / Booker
  ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.beginPath();
  ctx.roundRect(880, boxY, boxW, boxH, 14);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#94a3b8";
  ctx.font = "bold 12px Inter, sans-serif";
  ctx.fillText("BOOKER / SQUAD", 900, boxY + 32);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 16px Inter, sans-serif";
  ctx.fillText(bookerName, 900, boxY + 68);

  // Bottom Row Information
  ctx.fillStyle = "rgba(16, 185, 129, 0.2)";
  ctx.strokeStyle = "rgba(16, 185, 129, 0.4)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(380, 380, 730, 70, 14);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#34d399";
  ctx.font = "bold 13.5px Inter, sans-serif";
  ctx.fillText(
    "🛡️ Official Pitch Guarantee: Verified match booking registered on FootballHub.",
    405,
    412
  );

  ctx.fillStyle = "#fbbf24";
  ctx.font = "12px monospace";
  const expiryStr = expiresAt
    ? new Date(expiresAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Match Completion";
  ctx.fillText(
    `Pass auto-expires after match end time (Valid until: ${expiryStr})`,
    405,
    435
  );

  // Bottom Footer Timestamp
  ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
  ctx.font = "11px Inter, sans-serif";
  ctx.fillText(
    `Generated by FootballHub Match Systems on ${new Date().toLocaleString()}`,
    380,
    520
  );
  ctx.fillText(
    "Present this digital pass directly to ground staff upon entry.",
    380,
    538
  );

  // 7. Trigger automatic PNG download
  const dataUrl = canvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = `FootballHub-MatchPass-${passIdStr}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
