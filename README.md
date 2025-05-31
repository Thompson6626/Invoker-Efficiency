# Invoker Efficiency Trainer - Spell Input Efficiency Tracker

A lightweight React + Vite application for Dota 2 Invoker players to train and optimize spell input efficiency. This tool helps you eliminate unnecessary orb presses when chaining spells, improving both speed and precision.

---

## 🎯 Goal

Invoker has 10 spells that are formed using combinations of `Q`, `W`, and `E`. This trainer evaluates how efficient your transitions are between spells.

For example:

- Going from `Q Q E` to `E E E` normally takes 3 presses of `E`, but **only 2** are needed.
- The app highlights these extra inputs so you can train your muscle memory to **cast smarter, not harder**.

---

## 🛠️ Tech Stack

- **React** (Vite)
- **JavaScript**
- **Tailwind CSS**

---

## 🚀 Getting Started

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-username/invoker-trainer.git
   cd invoker-trainer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the dev server**
   ```bash
   npm run dev
   ```

4. Open your browser at `http://localhost:5173`

---

## 🧠 How Efficiency Works

The app calculates how many orb inputs are **actually needed** to invoke the next spell, based on your current orb buffer.

It compares:

- The **current orb combination**
- The **target spell orb combination**

Then it computes the **minimal changes** needed and compares it with what you actually input.

### Example:

From `Q Q E` to `E E E`:

- Optimal: Press `E` twice
- If you press `E E E`: 1 redundant input
- Your efficiency = `2 / 3 = 66.7%`

> I know—at most, you're just saving a few milliseconds. But small optimizations like this can make your input cleaner and more consistent over time.
