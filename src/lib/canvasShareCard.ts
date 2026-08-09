import type { Habit } from "@/types/habit";
import type { UserLevelStats } from "@/lib/gamification";

interface ShareCardOptions {
  stats: UserLevelStats;
  userName?: string;
  theme?: "dark" | "amoled" | "light";
}

/**
 * Draws a crisp 1200x630 social image on an in-memory HTML5 Canvas and returns a Data URL (image/png).
 * Runs 100% in-browser with 0 API calls or external servers.
 */
export function generateSocialShareCard({
  stats,
  userName = "Growzok Practitioner",
  theme = "dark",
}: ShareCardOptions): string {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 630;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const isDark = theme !== "light";
  const bgGrad = ctx.createLinearGradient(0, 0, 1200, 630);
  if (theme === "amoled") {
    bgGrad.addColorStop(0, "#000000");
    bgGrad.addColorStop(1, "#0a0a0c");
  } else if (isDark) {
    bgGrad.addColorStop(0, "#121215");
    bgGrad.addColorStop(1, "#1c221e");
  } else {
    bgGrad.addColorStop(0, "#fbf9f5");
    bgGrad.addColorStop(1, "#e5e1d7");
  }

  // Background Fill
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1200, 630);

  // Decorative organic accent line
  ctx.strokeStyle = isDark ? "#406852" : "#232f26";
  ctx.lineWidth = 4;
  ctx.strokeRect(40, 40, 1120, 550);

  // Header Brand Tagline
  ctx.fillStyle = isDark ? "#a3b899" : "#406852";
  ctx.font = "bold 18px sans-serif";
  ctx.fillText("GROWZOK — SYSTEM MASTERY & HABITS", 80, 95);

  // User Name & Level Title
  ctx.fillStyle = isDark ? "#ffffff" : "#232f26";
  ctx.font = "bold 44px Georgia, serif";
  ctx.fillText(userName, 80, 155);

  ctx.fillStyle = isDark ? "#a1a1aa" : "#737970";
  ctx.font = "600 24px sans-serif";
  ctx.fillText(`Level ${stats.level} • ${stats.levelTitle}`, 80, 195);

  // Stat Tile Cards (3 Grid Box Cards)
  const tiles = [
    { label: "TOTAL LOGS", val: stats.totalCompletions.toString(), sub: "Habit completions" },
    { label: "BEST STREAK", val: `${stats.longestStreak} Days`, sub: "Unbroken streak" },
    { label: "BADGES UNLOCKED", val: `${stats.unlockedBadgesCount} / ${stats.badges.length}`, sub: "Milestone trophies" },
  ];

  tiles.forEach((tile, i) => {
    const x = 80 + i * 350;
    const y = 250;
    const w = 320;
    const h = 180;

    // Card BG
    ctx.fillStyle = isDark ? "#18181b" : "#ffffff";
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 16);
    ctx.fill();

    // Card Border
    ctx.strokeStyle = isDark ? "#27272a" : "#d4d4d8";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Tile Label
    ctx.fillStyle = isDark ? "#a1a1aa" : "#737970";
    ctx.font = "600 14px sans-serif";
    ctx.fillText(tile.label, x + 24, y + 42);

    // Tile Main Value
    ctx.fillStyle = isDark ? "#f4f4f5" : "#232f26";
    ctx.font = "bold 38px Georgia, serif";
    ctx.fillText(tile.val, x + 24, y + 105);

    // Tile Subtext
    ctx.fillStyle = isDark ? "#71717a" : "#a1a1aa";
    ctx.font = "14px sans-serif";
    ctx.fillText(tile.sub, x + 24, y + 145);
  });

  // Footer Badge Ribbon
  ctx.fillStyle = isDark ? "#27272a" : "#e5e1d7";
  ctx.beginPath();
  ctx.roundRect(80, 470, 1040, 80, 16);
  ctx.fill();

  ctx.fillStyle = isDark ? "#f4f4f5" : "#232f26";
  ctx.font = "bold 20px sans-serif";
  const unlockedNames = stats.badges
    .filter((b) => b.unlocked)
    .map((b) => `${b.icon} ${b.name}`)
    .join("   •   ");

  ctx.fillText(
    unlockedNames || "🌱 First Step  •  ⚡ Consistency  •  🔥 Week Warrior",
    110,
    518
  );

  return canvas.toDataURL("image/png");
}
