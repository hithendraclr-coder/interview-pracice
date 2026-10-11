# AI Interview Coach

> **"Practice Smarter. Interview Better. Get Hired."**

A complete, modern, responsive SaaS-style web application designed to help software engineering students and job candidates prepare for high-stakes technical interviews and HR behavioral rounds.

Built with pure **HTML5, CSS3, Vanilla JavaScript, Chart.js, and LocalStorage**—zero build tools, zero dependencies, zero complex frameworks required.

---

## 🚀 Key Features

### 1. 📊 SaaS-Style Dashboard & Live Analytics
- **Dynamic KPI Metrics**: Tracks total questions practiced, completed sessions, average evaluation score, and active learning streak.
- **Daily Practice Goal**: Set custom daily targets (e.g., 5 questions/day) with real-time visual progress bars and streak preservation.
- **Dynamic Recommendations**: Automatically analyzes your performance to highlight weak or untested categories with direct "Practice Now" links.
- **Daily Interview Preparation Tips**: Curated behavioral and technical interview strategies rotating daily.

### 2. 🎯 10 High-Yield Interview Categories
Comprehensive question bank with 60 in-depth questions across:
1. **Java Interview** (OOP, JVM, Garbage Collection, HashMaps, Exceptions)
2. **Python Interview** (GIL, Decorators, Generators, Memory Model, Collections)
3. **JavaScript Interview** (Event Loop, Closures, Scoping, Promises, Prototypes)
4. **SQL Interview** (JOINs, Window Functions, ACID, Indexing, Normalization)
5. **Data Structures and Algorithms** (Arrays, Linked Lists, BSTs, QuickSort, BFS/DFS, DP)
6. **HTML & CSS** (Box Model, Semantic HTML, Flexbox, Grid, Specificity, Critical Rendering Path)
7. **Computer Networks** (URL Lifecycle, TCP vs UDP, Handshakes, SSL/TLS, DNS, OSI Model)
8. **Operating Systems** (Processes vs Threads, Deadlocks, Virtual Memory, CPU Scheduling, System Calls)
9. **DBMS** (SQL vs NoSQL, Concurrency 2PL, Write-Ahead Logging, Sharding, CAP Theorem)
10. **HR Interview** (STAR method behavioral answers, weakness framing, conflict resolution, 5-year vision)

### 3. 🧠 Smart Answer Evaluation Engine
- **Local Heuristic & Keyword Evaluator**:
  - Analyzes candidate answers against domain-specific keywords, conceptual depth, and structure.
  - Generates a score out of 100 with clear quality labels: **Excellent (85-100)**, **Good (60-84)**, or **Needs Improvement (<60)**.
  - Highlights **Detected Concepts** (green badges) vs **Missing Important Concepts** (amber badges).
  - Delivers actionable, structured improvement suggestions.
  - Provides a complete **Model Reference Answer** for study and comparison.
  - **Honest Labeling**: Clearly noted as an automated learning aid based on concept matching.
- **Optional AI API Mode**: Ready to connect to an external LLM proxy (OpenAI, Gemini, Claude, or custom backend) via Settings.

### 4. ⏱️ Full Mock Interview Mode
- Choose your target domain (or mixed domains) and select 5, 10, or 15 questions.
- Realistic countdown session timer (10, 20, 30 minutes, or untimed).
- Sequential question progression with active progress meters.
- **Comprehensive Final Report**:
  - Overall average candidate score.
  - Performance grade (e.g., *Proficient Candidate*).
  - Identification of **Strongest Topics** and **Topics Requiring Additional Practice**.
  - Detailed question-by-question review accordion with candidate answers and model benchmarks.

### 5. 📇 Interactive 3D Flashcards
- Realistic 3D card flip animation revealing questions on the front and model answers + key concepts on the back.
- Spaced-repetition mastery tags: Mark cards as **Easy**, **Medium**, or **Difficult**.
- Filter by category and mastery level, or shuffle the deck for random testing.
- Flip instantly using your mouse or the **Spacebar** hotkey.

### 6. 📈 Data Visualizations (Chart.js)
- **Category Mastery Radar Chart**: Visualizes proficiency across all 10 interview domains using actual candidate performance data.
- **Score Trend Line Chart**: Tracks performance trajectory over your most recent practice and mock sessions.

### 7. 💾 LocalStorage Persistence & Privacy
- All session logs, question attempts, daily goals, streaks, bookmarks, and flashcard ratings are stored locally in the browser.
- Complete privacy—no external tracking or mandatory logins.
- Export all practice logs as a formatted `.json` backup file.
- Single-click clear history and factory reset options with confirmation modals.

### 8. 🎨 Design Aesthetics & Audio Cues
- Modern **Deep Space Navy** default theme with blue-purple gradients (`linear-gradient(135deg, #4f46e5, #7c3aed, #2563eb)`).
- Instant switch to a clean **Light Theme** with persistent user preference.
- Synthetic audio chimes for submission feedback, timer alerts, and clicks using the browser's built-in **Web Audio API** (no external audio files needed).
- Fully responsive across desktop, tablet, and mobile screens with a smooth slide-out navigation drawer.

---

## 📁 Repository File Structure

Every file is located directly in the root of the repository as required:

```text
ai-interview-coach/
├── index.html        # Main HTML5 application structure and semantic views
├── style.css         # CSS3 design system, responsive layouts, 3D animations
├── script.js         # Core application logic, evaluation engine, state management
├── questions.js      # 60 curated questions across 10 domains with hints & keywords
├── README.md         # Comprehensive project documentation
└── .gitignore        # Version control exclusions for sensitive and temporary files
```

---

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| **HTML5** | Semantic structure, accessible forms, landmark navigation |
| **CSS3** | Modern SaaS dark/light themes, CSS variables, 3D card transforms, animations |
| **Vanilla JavaScript (ES6+)** | State management, heuristics evaluator, timers, DOM updates |
| **LocalStorage API** | Offline-first persistence for streaks, history, and preferences |
| **Chart.js (CDN)** | Interactive Radar and Line charts for performance analytics |
| **Font Awesome (CDN)** | Professional SaaS iconography |
| **Google Fonts** | Modern typography using *Plus Jakarta Sans* & *JetBrains Mono* |
| **Web Audio API** | Pure browser audio synthesis for sound chimes |

---

## 💻 How to Run Locally

Because this project is built with standard web standards, no compilation or npm installations are needed.

### Method 1: VS Code Live Server (Recommended)
1. Open Visual Studio Code.
2. Open the project root folder: `ai-interview-coach/`.
3. Install the **Live Server** extension by *Ritwick Dey*.
4. Right-click `index.html` and select **"Open with Live Server"**.
5. Your default browser will open at `http://127.0.0.1:5500`.

### Method 2: Python HTTP Server
Open your terminal in the project directory and run:

```bash
# Python 3
python -m http.server 8000
```
Then navigate to `http://localhost:8000` in your browser.

### Method 3: Node.js `npx serve`
```bash
npx serve .
```

### Method 4: Direct Browser Open
Double-click `index.html` or drag and drop it into Chrome, Firefox, Safari, or Edge.

---

## 📤 How to Upload to GitHub

Follow these steps to publish your project to GitHub:

### 1. Initialize Git in the Project Root
```bash
cd "path/to/ai-interview-coach"
git init
```

### 2. Stage and Commit Files
```bash
git add .
git commit -m "Initial commit: AI Interview Coach complete web application"
```

### 3. Create a GitHub Repository
1. Go to [GitHub](https://github.com/) and click **New Repository**.
2. Name the repository (e.g., `ai-interview-coach`).
3. Set the repository to **Public** (or Private).
4. Do **not** initialize with a README, .gitignore, or license (we already created them).

### 4. Push to GitHub
```bash
git branch -M main
git remote add origin https://github.com/<your-username>/ai-interview-coach.git
git push -u origin main
```

### 5. Enable GitHub Pages (Free Live Deployment)
1. On GitHub, navigate to your repository's **Settings** tab.
2. In the left sidebar, click **Pages**.
3. Under **Build and deployment > Source**, select **Deploy from a branch**.
4. Choose `main` branch and `/ (root)` folder.
5. Click **Save**.
6. Your application will be live at `https://<your-username>.github.io/ai-interview-coach/` in 1-2 minutes!

---

## 🔍 Understanding the Local Answer Evaluator

The built-in evaluator runs 100% inside your browser in `script.js`. It works through a three-stage heuristic process:

1. **Concept & Keyword Detection (65% Weight)**:
   - Evaluates the presence of technical keywords and stems (e.g., matching `"polymorphism"`, `"override"`, `"o(1)"`, `"b-tree"`).
   - Generates exact detected concept tags and highlights missing points.
2. **Depth & Elaboration Analysis (25% Weight)**:
   - Measures candidate explanation depth (word count threshold between 35 and 120 words).
   - Discourages one-word answers and rewards structured explanations.
3. **Structure & Articulation (10% Weight)**:
   - Rewards punctuation, lists, and multi-sentence structural logic.

> **Disclaimer**: This score is an automated learning aid designed for deliberate practice and concept recall. It is not an exact human evaluation or a guarantee of employment.

---

## 🔌 Connecting an External AI Backend (Optional)

The application supports optional AI evaluation via a user-configured proxy.

### Why You Should Never Expose Keys on the Frontend
Calling OpenAI, Google Gemini, or Anthropic directly from client-side JavaScript requires embedding your private API key (`sk-...`). Anyone viewing browser DevTools or Network tabs can extract and abuse your key.

### Recommended Secure Architecture:
```text
Browser (script.js)  -->  Secure Backend (Node/Python)  -->  AI Provider (OpenAI/Gemini)
                              (Stores API Key in .env)
```

### Quick Backend Setup Example (Node.js / Express):
```javascript
// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/evaluate', async (req, res) => {
  const { question, answer, category } = req.body;
  
  // Call your chosen AI Provider securely using process.env.API_KEY
  // Return formatted evaluation JSON:
  res.json({
    score: 88,
    quality: "Excellent",
    detected: ["encapsulation", "inheritance"],
    missing: [],
    suggestions: ["Good technical clarity."]
  });
});

app.listen(3001, () => console.log('AI Proxy running on port 3001'));
```

Once running, navigate to the **Settings** view inside AI Interview Coach, enable **AI Evaluation Mode**, and enter `http://localhost:3001/api/evaluate`.

---

## 🔮 Future Improvements

- [ ] Speech-to-Text voice response input using the Web Speech API.
- [ ] Code runner sandbox for live algorithmic code execution.
- [ ] Exportable PDF Readiness Certificate based on mock interview scores.
- [ ] Custom user question creator to add personal company-specific questions.

---

## 📄 License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT). You are free to use, modify, and distribute this application for personal and educational purposes.
