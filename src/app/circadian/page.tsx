import CircadianClient from "./CircadianClient";

export const metadata = {
  title: "Circadian Solar Window Calculator | Growzok OS",
  description: "Calculate solar noon, morning photic window, and digital sunset cutoff for free.",
};

export default function CircadianPage() {
  return <CircadianClient />;
}
