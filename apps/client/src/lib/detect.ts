import { detect } from "detect-browser";

export function detectBrowser() {
  const browser = detect();

  let friendly_name;
  if (browser) {
    let { name, os } = browser as { name: string; os: string };
    if (name === "ios") {
      name = "safari";
    } else if (name === "fxios") {
      name = "firefox";
    } else if (name === "crios") {
      name = "chrome";
    } else if (os === "Mac OS" && navigator.maxTouchPoints > 0) {
      os = "iPadOS";
    }

    friendly_name = `Reflect (${name} on ${os})`;
  } else {
    friendly_name = "Reflect (Unknown Device)";
  }

  return friendly_name;
}
