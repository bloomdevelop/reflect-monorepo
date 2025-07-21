import { blue } from "@suid/material/colors";
import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export const borderStyles = { // border colors for light/dark modes
  light: { default: "rgba(0, 0, 0, 0.12)", focus: blue[500] },
  dark: { default: "rgba(255, 255, 255, 0.12)", focus: blue[200] },
};