import VitalsClient from "./VitalsClient";

export const metadata = {
  title: "Biometric Vitals & Biomarker Tracker | Growzok OS",
  description: "Track resting heart rate, HRV recovery, sleep duration, and body weight for free.",
};

export default function VitalsPage() {
  return <VitalsClient />;
}
