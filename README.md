# Growzok (v2.0)

> **Human Performance & Biological Habit Optimization Platform**

Built with **Next.js 15 (App Router)** · **TypeScript** · **Tailwind CSS v4** · **Auth.js v5** · **MongoDB**

---

## Overview

**Growzok** is an executive-grade human performance and routine optimization system. Built on circadian neuroscience and behavioral psychology, Growzok replaces fragile willpower and penalty-heavy streak reset models with **frequency-aware scheduling**, **16 biological taxonomy domains**, an integrated **Bio Suite Engine**, **Full-Viewport Focus Mode**, **Science-Backed Playbooks & Protocols**, and **complete data sovereignty**.

---

## Core System Modules

### 1. Command Hub & Habit Architecture
- **Universal Vector Symbols**: Vector SVG icons mapped to habit domains without initial letter placeholders.
- **Frequency-Aware Scheduling**: Daily, Weekdays, Weekends, $N\times$ per week, or custom weekday selection.
- **Target Tracking & Numeric Goals**: Count, time, distance, or currency targets (e.g., *8 glasses*, *90 minutes*).
- **Miss Allowance**: Set weekly miss tolerances so rest days don't break habit momentum.
- **Executive Search & Filter Workstation**: Full-width search bar with vector magnifying glass icon, equal-width segmented status tab switcher (**Default: Pending**), domain filter pills, and custom label chips (`Label - Personal`).

### 2. Bio Suite Engine
- **Circadian Solar Window Calculator**: GPS geolocation photic window calculator computing morning photonic exposure (cortisol awakening spike), solar zenith peak (UV-B synthesis), and digital sunset cutoffs (melatonin protection).
- **Breathwork Workstation**: Real-time visual breath ring animation supporting Box 4-4, 4-7-8 Stress Reset, and Resonant Cadence.
- **Fasting Protocol Tracker**: Biological stage tracking (Glycogen Depletion, Ketosis, Autophagy, Peak HGH) across 16:8, 18:6, 24h, and Circadian protocols.
- **Recovery & Thermal Workstation**: Log Sauna, Cold Plunge, NSDR / Yoga Nidra, and Massage sessions.
- **Vitals Logger**: Track HRV (ms), Resting Heart Rate (bpm), Sleep Quality Score (%), SpO2 (%), and Blood Pressure.

### 3. Focus Workstation Mode (`100dvh`)
- **Full Viewport Coverage**: `fixed inset-0 z-[9999] h-[100dvh]` Pomodoro timer workstation with audio chime notifications.
- **Synthesized Ambient Soundscapes**: Real-time Web Audio API synthesized White Noise, Pink Noise, Rain, and Forest soundscapes with volume controls.

### 4. Protocols & Science-Backed Playbooks
- One-click adoption for science-backed protocol bundles (*Huberman Morning Sunlight*, *Sleep Architecture*, *Cognitive Deep Work*, *Zone 2 Aerobic Base*, *Strength & Mobility*).

### 5. Mobile-First Responsive Design
- **Top Navigation Bar**: Left icon-only hamburger menu button (`☰`), Center full-text branding (`Growzok`), Right light-themed profile icon tab (`/account`).
- **Mobile Bottom Navigation**: Fixed 5-item icon-only bar (`Bio`, `Habits`, `Dashboard`, `Reports`, `Protocols`) with safe-area bottom inset support.

### 6. Data Sovereignty & Calendar Feed
- **iCal Subscription Feed**: Standard `.ics` URL for live sync with Google Calendar, Apple Calendar, and Outlook.
- **Data Export & Portability**: CSV dataset exports, structured JSON backup & restore pipelines.

---

## Tech Stack & Architecture

- **Framework**: Next.js 15.1 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4 with custom dark mode & OLED AMOLED themes
- **Authentication**: Auth.js v5 (NextAuth) with node `scrypt` password hashing
- **Database**: MongoDB with atomic aggregation pipelines & cached connection pools
- **State & Data Layer**: Custom optimistic update hooks (`useHabits`)

---

## Quick Start & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```

Set the required environment variables:
```env
AUTH_SECRET="your-generated-auth-secret"
MONGODB_URI="mongodb://127.0.0.1:27017/growzok"
# or MongoDB Atlas: mongodb+srv://<user>:<password>@cluster.mongodb.net/growzok
```

Generate a secure `AUTH_SECRET`:
```bash
npx auth secret
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Production Deployment

Build the production bundle:
```bash
npm run build
npm start
```

### Deploy to Vercel
1. Push your repository to GitHub.
2. Import the project in Vercel.
3. Configure `AUTH_SECRET` and `MONGODB_URI` under Environment Variables.

---

## License

Growzok is private software. Built for peak human performance.
