/**
 * ===================================================================
 * AI INTERVIEW COACH - CORE CLIENT APPLICATION LOGIC
 * Features:
 * - Reactive LocalStorage State & Analytics Tracking
 * - Daily Streak & Daily Goal Calculation
 * - Intelligent Heuristic & Keyword Evaluation Engine
 * - Interactive Practice Session with Live Timer & Counter
 * - Mock Interview Simulator with Timed Progression & Final Report
 * - 3D Flashcards with Spaced Revision Ratings (Easy/Med/Hard)
 * - Dynamic Chart.js Analytics (Category Mastery & Score Trends)
 * - Practice History Logging with JSON Export & Clear Modal
 * - Dark/Light Theme Switching & Web Audio API Sound Chimes
 * ===================================================================
 */

(function () {
    "use strict";

    // -------------------------------------------------------------
    // 1. STORAGE SERVICE & DATA MODEL
    // -------------------------------------------------------------
    const STORAGE_KEY = "ai_interview_coach_state_v2";

    const DEFAULT_STATE = {
        theme: "dark",
        soundEnabled: true,
        dailyGoal: 5,
        defaultTimerMinutes: 20,
        streak: {
            current: 1,
            lastActiveDate: new Date().toISOString().split("T")[0],
            datesPracticed: [new Date().toISOString().split("T")[0]]
        },
        dailyProgress: {
            date: new Date().toISOString().split("T")[0],
            count: 0
        },
        bookmarks: [],
        flashcardMastery: {}, // { [questionId]: "easy" | "medium" | "difficult" }
        history: [], // Array of completed session records
        attempts: [], // Array of individual evaluated questions
        aiConfig: {
            enabled: false,
            endpoint: "",
            apiKey: ""
        }
    };

    const StorageService = {
        loadState() {
            try {
                const data = localStorage.getItem(STORAGE_KEY);
                if (!data) return JSON.parse(JSON.stringify(DEFAULT_STATE));
                const parsed = JSON.parse(data);
                return { ...DEFAULT_STATE, ...parsed };
            } catch (err) {
                console.warn("Storage load error, resetting to defaults", err);
                return JSON.parse(JSON.stringify(DEFAULT_STATE));
            }
        },

        saveState(state) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
            } catch (err) {
                console.error("Failed to save state to localStorage", err);
            }
        },

        clearAll() {
            localStorage.removeItem(STORAGE_KEY);
        }
    };

    // -------------------------------------------------------------
    // 2. AUDIO SYNTHESIS SERVICE (Web Audio API)
    // -------------------------------------------------------------
    const AudioService = {
        ctx: null,

        initContext() {
            if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                this.ctx = new AudioCtx();
            }
        },

        playTone(frequency, duration, type = "sine") {
            if (!AppState.state.soundEnabled) return;
            try {
                this.initContext();
                if (!this.ctx) return;
                if (this.ctx.state === "suspended") {
                    this.ctx.resume();
                }

                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = type;
                osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);

                gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start();
                osc.stop(this.ctx.currentTime + duration);
            } catch (e) {
                // Audio autoplay might be prevented by browser policy
            }
        },

        playSuccess() {
            this.playTone(523.25, 0.12, "triangle"); // C5
            setTimeout(() => this.playTone(659.25, 0.2, "triangle"), 100); // E5
        },

        playTick() {
            this.playTone(800, 0.04, "sine");
        },

        playAlert() {
            this.playTone(440, 0.15, "sawtooth");
            setTimeout(() => this.playTone(349.23, 0.25, "sawtooth"), 120);
        }
    };

    // -------------------------------------------------------------
    // 3. MOTIVATIONAL PREPARATION TIPS
    // -------------------------------------------------------------
    const INTERVIEW_TIPS = [
        {
            quote: "Use the STAR method (Situation, Task, Action, Result) for behavioral questions, and explain your thought process out loud during technical interviews.",
            author: "Senior Engineering Hiring Manager"
        },
        {
            quote: "When explaining system architecture, start with high-level client-server flow before diving into deep database schemas or caching layers.",
            author: "Staff Infrastructure Architect"
        },
        {
            quote: "Never rush into silence. It is completely professional to say: 'That is a great question. Let me take five seconds to structure my response.'",
            author: "Tech Recruiter & Career Coach"
        },
        {
            quote: "In coding interviews, state your brute-force approach first, analyze its Big-O time and space complexity, and then systematically optimize it.",
            author: "Algorithms Interviewer"
        },
        {
            quote: "Always articulate trade-offs. Senior candidates don't just give one answer—they explain why they chose technology X over Y for that specific use case.",
            author: "Director of Software Engineering"
        },
        {
            quote: "For HR questions, frame your weaknesses around actionable self-awareness and measurable steps you are already taking to improve.",
            author: "Talent Acquisition Lead"
        }
    ];

    // -------------------------------------------------------------
    // 4. CENTRAL APP STATE & CONTROLLER
    // -------------------------------------------------------------
    const AppState = {
        state: null,
        currentSection: "dashboard",
        questions: [],

        // Practice Mode State
        practice: {
            filteredQuestions: [],
            currentIndex: 0,
            currentQuestion: null,
            timerSeconds: 0,
            timerInterval: null,
            sessionAttempts: 0,
            sessionTotalScore: 0,
            isHintShown: false,
            isEvaluated: false
        },

        // Mock Interview State
        mock: {
            activeQuestions: [],
            currentIndex: 0,
            currentQuestion: null,
            timeRemaining: 0,
            elapsedSeconds: 0,
            timerInterval: null,
            isUntimed: false,
            results: [],
            category: "all",
            totalQuestions: 10
        },

        // Flashcards State
        flashcards: {
            activeDeck: [],
            currentIndex: 0,
            isFlipped: false
        },

        // Charts Instances
        charts: {
            radar: null,
            line: null
        },

        init() {
            this.state = StorageService.loadState();
            this.questions = window.interviewQuestions || [];

            this.verifyStreakAndDailyGoal();
            this.applyTheme(this.state.theme);
            this.setupNavigation();
            this.setupEventListeners();

            // Populate initial views
            this.renderDashboard();
            this.initPracticeMode();
            this.initMockMode();
            this.initFlashcardDeck();
            this.renderHistoryTable();
            this.renderSettings();

            // Initialize Charts
            setTimeout(() => {
                this.initCharts();
            }, 300);
        },

        save() {
            StorageService.saveState(this.state);
        },

        verifyStreakAndDailyGoal() {
            const today = new Date().toISOString().split("T")[0];
            const yesterdayDate = new Date(Date.now() - 86400000);
            const yesterday = yesterdayDate.toISOString().split("T")[0];

            // Verify Daily Goal reset if new day
            if (this.state.dailyProgress.date !== today) {
                this.state.dailyProgress = {
                    date: today,
                    count: 0
                };
            }

            // Verify Streak logic
            const lastActive = this.state.streak.lastActiveDate;
            if (lastActive === today) {
                // Already active today
            } else if (lastActive === yesterday) {
                // Yesterday was active, streak remains valid
            } else {
                // Inactive for more than 1 day, reset streak to 1
                this.state.streak.current = 1;
            }

            this.save();
        },

        recordActivityDay() {
            const today = new Date().toISOString().split("T")[0];
            const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

            if (this.state.streak.lastActiveDate === yesterday) {
                this.state.streak.current += 1;
                this.state.streak.lastActiveDate = today;
                if (!this.state.streak.datesPracticed.includes(today)) {
                    this.state.streak.datesPracticed.push(today);
                }
            } else if (this.state.streak.lastActiveDate !== today) {
                this.state.streak.current = 1;
                this.state.streak.lastActiveDate = today;
                if (!this.state.streak.datesPracticed.includes(today)) {
                    this.state.streak.datesPracticed.push(today);
                }
            }

            // Increment daily progress counter
            this.state.dailyProgress.count += 1;
            this.save();
            this.updateGoalDisplays();
        },

        applyTheme(theme) {
            document.documentElement.setAttribute("data-theme", theme);
            this.state.theme = theme;
            this.save();

            // Update Theme Choice Buttons in Settings
            const btnDark = document.getElementById("btnThemeChoiceDark");
            const btnLight = document.getElementById("btnThemeChoiceLight");
            if (btnDark && btnLight) {
                if (theme === "dark") {
                    btnDark.classList.add("active");
                    btnLight.classList.remove("active");
                } else {
                    btnLight.classList.add("active");
                    btnDark.classList.remove("active");
                }
            }

            // Re-render chart colors if charts exist
            if (this.charts.radar || this.charts.line) {
                this.updateCharts();
            }
        },

        setupNavigation() {
            const navLinks = document.querySelectorAll(".nav-link");
            const sections = document.querySelectorAll(".app-section");
            const pageHeaderTitle = document.getElementById("pageHeaderTitle");
            const pageHeaderSubtitle = document.getElementById("pageHeaderSubtitle");
            const sidebar = document.getElementById("sidebar");
            const sidebarOverlay = document.getElementById("sidebarOverlay");

            const titles = {
                dashboard: { title: "Dashboard", sub: "Practice Smarter. Interview Better. Get Hired." },
                practice: { title: "Interactive Practice", sub: "Step-by-step interview questions with instant concept evaluation." },
                mock: { title: "Mock Interview Simulator", sub: "Full timed interview simulation with comprehensive readiness report." },
                flashcards: { title: "Flashcard Revision", sub: "Spaced-repetition card decks with 3D flip answers and key concepts." },
                analytics: { title: "Analytics & Insights", sub: "Domain mastery breakdown, score progressions, and growth areas." },
                history: { title: "Practice Logs", sub: "Historical record of all sessions, scores, and practice runs." },
                settings: { title: "System Preferences", sub: "Configure themes, practice timers, audio cues, and optional AI endpoints." }
            };

            const switchSection = (sectionId) => {
                this.currentSection = sectionId;

                navLinks.forEach(link => {
                    if (link.dataset.section === sectionId) {
                        link.classList.add("active");
                    } else {
                        link.classList.remove("active");
                    }
                });

                sections.forEach(sec => {
                    if (sec.id === `section-${sectionId}`) {
                        sec.classList.add("active");
                    } else {
                        sec.classList.remove("active");
                    }
                });

                if (titles[sectionId]) {
                    pageHeaderTitle.textContent = titles[sectionId].title;
                    pageHeaderSubtitle.textContent = titles[sectionId].sub;
                }

                // Close mobile sidebar if open
                if (sidebar) sidebar.classList.remove("open");
                if (sidebarOverlay) sidebarOverlay.classList.remove("active");

                // Trigger section-specific refreshes
                if (sectionId === "dashboard") this.renderDashboard();
                if (sectionId === "analytics") {
                    this.renderAnalyticsView();
                    this.updateCharts();
                }
                if (sectionId === "history") this.renderHistoryTable();

                window.scrollTo({ top: 0, behavior: "smooth" });
            };

            this.switchSection = switchSection;

            navLinks.forEach(link => {
                link.addEventListener("click", () => {
                    const sec = link.dataset.section;
                    if (sec) switchSection(sec);
                });
            });

            // Mobile menu toggle
            const menuToggleBtn = document.getElementById("menuToggleBtn");
            const sidebarCloseBtn = document.getElementById("sidebarCloseBtn");

            if (menuToggleBtn && sidebar && sidebarOverlay) {
                menuToggleBtn.addEventListener("click", () => {
                    sidebar.classList.add("open");
                    sidebarOverlay.classList.add("active");
                });
            }

            if (sidebarCloseBtn && sidebar && sidebarOverlay) {
                sidebarCloseBtn.addEventListener("click", () => {
                    sidebar.classList.remove("open");
                    sidebarOverlay.classList.remove("active");
                });
            }

            if (sidebarOverlay) {
                sidebarOverlay.addEventListener("click", () => {
                    sidebar.classList.remove("open");
                    sidebarOverlay.classList.remove("active");
                });
            }

            // Quick practice header button
            const headerQuickPracticeBtn = document.getElementById("headerQuickPracticeBtn");
            if (headerQuickPracticeBtn) {
                headerQuickPracticeBtn.addEventListener("click", () => switchSection("practice"));
            }

            // Theme toggle button in header
            const themeToggleBtn = document.getElementById("themeToggleBtn");
            if (themeToggleBtn) {
                themeToggleBtn.addEventListener("click", () => {
                    const next = this.state.theme === "dark" ? "light" : "dark";
                    this.applyTheme(next);
                    showToast(`Switched to ${next === "dark" ? "Dark Navy" : "Clean Light"} theme.`, "info");
                });
            }
        },

        setupEventListeners() {
            // Dashboard Buttons
            const dashPracticeBtn = document.getElementById("dashStartPracticeBtn");
            const dashMockBtn = document.getElementById("dashStartMockBtn");
            const dashFlashcardsBtn = document.getElementById("dashOpenFlashcardsBtn");
            const dashViewAllHistoryBtn = document.getElementById("dashViewAllHistoryBtn");
            const btnRefreshTip = document.getElementById("btnRefreshTip");

            if (dashPracticeBtn) dashPracticeBtn.addEventListener("click", () => this.switchSection("practice"));
            if (dashMockBtn) dashMockBtn.addEventListener("click", () => this.switchSection("mock"));
            if (dashFlashcardsBtn) dashFlashcardsBtn.addEventListener("click", () => this.switchSection("flashcards"));
            if (dashViewAllHistoryBtn) dashViewAllHistoryBtn.addEventListener("click", () => this.switchSection("history"));

            if (btnRefreshTip) {
                btnRefreshTip.addEventListener("click", () => this.renderRandomTip());
            }

            // Modal Generic Close Buttons
            const btnCloseSummaryModal = document.getElementById("btnCloseSummaryModal");
            const btnSummaryReturnHome = document.getElementById("btnSummaryReturnHome");
            const btnSummaryContinuePractice = document.getElementById("btnSummaryContinuePractice");
            const sessionSummaryModal = document.getElementById("sessionSummaryModal");

            if (btnCloseSummaryModal && sessionSummaryModal) {
                btnCloseSummaryModal.addEventListener("click", () => sessionSummaryModal.style.display = "none");
            }
            if (btnSummaryReturnHome && sessionSummaryModal) {
                btnSummaryReturnHome.addEventListener("click", () => {
                    sessionSummaryModal.style.display = "none";
                    this.switchSection("dashboard");
                });
            }
            if (btnSummaryContinuePractice && sessionSummaryModal) {
                btnSummaryContinuePractice.addEventListener("click", () => {
                    sessionSummaryModal.style.display = "none";
                    this.practiceNextQuestion();
                });
            }

            // Confirm Dialog Dismiss Buttons
            const btnCancelConfirm = document.getElementById("btnCancelConfirm");
            const btnConfirmDismiss = document.getElementById("btnConfirmDismiss");
            const confirmModal = document.getElementById("confirmModal");

            if (btnCancelConfirm && confirmModal) {
                btnCancelConfirm.addEventListener("click", () => confirmModal.style.display = "none");
            }
            if (btnConfirmDismiss && confirmModal) {
                btnConfirmDismiss.addEventListener("click", () => confirmModal.style.display = "none");
            }
        }
    };

    // -------------------------------------------------------------
    // 5. TOAST NOTIFICATIONS SERVICE
    // -------------------------------------------------------------
    function showToast(message, type = "info") {
        const container = document.getElementById("toastContainer");
        if (!container) return;

        const toast = document.createElement("div");
        toast.className = `toast toast-${type}`;

        const icons = {
            success: "fa-solid fa-circle-check",
            info: "fa-solid fa-circle-info",
            warning: "fa-solid fa-triangle-exclamation",
            danger: "fa-solid fa-circle-xmark"
        };

        toast.innerHTML = `
            <i class="${icons[type] || icons.info} toast-icon"></i>
            <span class="toast-message">${escapeHtml(message)}</span>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add("toast-hiding");
            setTimeout(() => {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
            }, 300);
        }, 3200);
    }

    function escapeHtml(str) {
        if (!str) return "";
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // -------------------------------------------------------------
    // 6. DASHBOARD LOGIC & STATISTICS
    // -------------------------------------------------------------
    AppState.renderDashboard = function () {
        const attempts = this.state.attempts || [];
        const history = this.state.history || [];

        // Total questions practiced
        const totalQuestions = attempts.length;
        document.getElementById("statTotalQuestions").textContent = totalQuestions;

        // Total completed sessions
        const totalSessions = history.length;
        document.getElementById("statTotalSessions").textContent = totalSessions;

        // Average practice score
        let avgScore = 0;
        if (attempts.length > 0) {
            const sum = attempts.reduce((acc, curr) => acc + (curr.score || 0), 0);
            avgScore = Math.round(sum / attempts.length);
        }
        document.getElementById("statAvgScore").textContent = `${avgScore}%`;

        // Readiness Score Radial Ring
        const dashReadinessScore = document.getElementById("dashReadinessScore");
        if (dashReadinessScore) {
            dashReadinessScore.textContent = `${avgScore}%`;
        }

        // Current streak
        const streakDisplay = `${this.state.streak.current} ${this.state.streak.current === 1 ? "Day" : "Days"}`;
        document.getElementById("statCurrentStreak").textContent = streakDisplay;
        document.getElementById("sidebarStreakDisplay").textContent = streakDisplay;

        // Update Daily Goal Progress
        this.updateGoalDisplays();

        // Render Categories Chips Explorer
        this.renderCategoryChips();

        // Render Recommended Topics
        this.renderRecommendedTopics();

        // Render Recent Activity List
        this.renderRecentActivity();

        // Render Random Tip
        this.renderRandomTip();
    };

    AppState.updateGoalDisplays = function () {
        const goal = this.state.dailyGoal || 5;
        const count = this.state.dailyProgress.count || 0;
        const pct = Math.min(100, Math.round((count / goal) * 100));

        const headerGoalProgress = document.getElementById("headerGoalProgress");
        if (headerGoalProgress) {
            headerGoalProgress.textContent = `${count} / ${goal} Today`;
        }

        const dashGoalFraction = document.getElementById("dashGoalFraction");
        if (dashGoalFraction) {
            dashGoalFraction.textContent = `${count} / ${goal} questions`;
        }

        const dashGoalPercent = document.getElementById("dashGoalPercent");
        if (dashGoalPercent) {
            dashGoalPercent.textContent = `${pct}%`;
        }

        const dashGoalBar = document.getElementById("dashGoalBar");
        if (dashGoalBar) {
            dashGoalBar.style.width = `${pct}%`;
        }

        const goalStatusBadge = document.getElementById("goalStatusBadge");
        if (goalStatusBadge) {
            if (count >= goal) {
                goalStatusBadge.textContent = "Goal Achieved! 🔥";
                goalStatusBadge.className = "badge badge-emerald";
            } else {
                goalStatusBadge.textContent = "In Progress";
                goalStatusBadge.className = "badge badge-info";
            }
        }

        const goalTipText = document.getElementById("goalTipText");
        if (goalTipText) {
            if (count >= goal) {
                goalTipText.textContent = "Awesome job! You reached today's interview preparation target.";
            } else {
                const remaining = goal - count;
                goalTipText.textContent = `Practice ${remaining} more question${remaining > 1 ? "s" : ""} today to hit your daily goal!`;
            }
        }
    };

    AppState.renderCategoryChips = function () {
        const container = document.getElementById("dashboardCategoriesGrid");
        if (!container) return;

        const categories = [
            "Java Interview",
            "Python Interview",
            "JavaScript Interview",
            "SQL Interview",
            "Data Structures and Algorithms",
            "HTML and CSS",
            "Computer Networks",
            "Operating Systems",
            "DBMS",
            "HR Interview"
        ];

        container.innerHTML = "";

        categories.forEach(cat => {
            const count = this.questions.filter(q => q.category === cat).length;
            const btn = document.createElement("button");
            btn.className = "category-chip-btn";
            btn.innerHTML = `
                <span class="category-chip-name">${cat}</span>
                <span class="category-chip-count">${count} Qs</span>
            `;

            btn.addEventListener("click", () => {
                const select = document.getElementById("practiceCategorySelect");
                if (select) {
                    select.value = cat;
                }
                this.switchSection("practice");
                this.filterPracticeQuestions(cat);
            });

            container.appendChild(btn);
        });
    };

    AppState.renderRecommendedTopics = function () {
        const container = document.getElementById("dashRecommendedList");
        if (!container) return;

        const categories = [
            "Java Interview", "Python Interview", "JavaScript Interview", "SQL Interview",
            "Data Structures and Algorithms", "HTML and CSS", "Computer Networks",
            "Operating Systems", "DBMS", "HR Interview"
        ];

        const attempts = this.state.attempts || [];

        // Calculate score per category
        const catStats = categories.map(cat => {
            const catAttempts = attempts.filter(a => a.category === cat);
            const total = catAttempts.length;
            const avg = total > 0
                ? Math.round(catAttempts.reduce((acc, c) => acc + c.score, 0) / total)
                : 0;
            return { category: cat, total, avg };
        });

        // Sort priority: fewest attempts, then lowest score
        catStats.sort((a, b) => {
            if (a.total === b.total) return a.avg - b.avg;
            return a.total - b.total;
        });

        const topRecommendations = catStats.slice(0, 3);
        container.innerHTML = "";

        topRecommendations.forEach(rec => {
            const div = document.createElement("div");
            div.className = "recommended-item";

            const reasonText = rec.total === 0
                ? "Not yet practiced • High interview frequency"
                : `Avg Score: ${rec.avg}% • ${rec.total} attempt${rec.total > 1 ? "s" : ""}`;

            div.innerHTML = `
                <div class="rec-meta">
                    <span class="rec-title">${rec.category}</span>
                    <span class="rec-sub">${reasonText}</span>
                </div>
                <button class="btn btn-outline btn-xs rec-action-btn">
                    Practice <i class="fa-solid fa-arrow-right"></i>
                </button>
            `;

            const btn = div.querySelector(".rec-action-btn");
            btn.addEventListener("click", () => {
                const select = document.getElementById("practiceCategorySelect");
                if (select) select.value = rec.category;
                this.switchSection("practice");
                this.filterPracticeQuestions(rec.category);
            });

            container.appendChild(div);
        });
    };

    AppState.renderRecentActivity = function () {
        const container = document.getElementById("dashRecentActivityList");
        if (!container) return;

        const attempts = (this.state.attempts || []).slice(-4).reverse();

        if (attempts.length === 0) {
            container.innerHTML = `
                <p class="text-muted text-sm text-center py-3">No questions practiced yet. Jump into practice to build your history!</p>
            `;
            return;
        }

        container.innerHTML = "";
        attempts.forEach(att => {
            const item = document.createElement("div");
            item.className = "recent-act-item";

            const scoreClass = att.score >= 80 ? "score-high" : (att.score >= 60 ? "score-mid" : "score-low");
            const timeAgo = formatTimeAgo(new Date(att.timestamp));

            item.innerHTML = `
                <div class="act-info">
                    <div class="act-icon"><i class="fa-solid fa-check"></i></div>
                    <div>
                        <div class="act-title">${escapeHtml(att.category)}</div>
                        <div class="act-time">${timeAgo}</div>
                    </div>
                </div>
                <div class="act-score ${scoreClass}">${att.score}%</div>
            `;
            container.appendChild(item);
        });
    };

    AppState.renderRandomTip = function () {
        const quoteEl = document.getElementById("dailyTipQuote");
        const authorEl = document.getElementById("dailyTipAuthor");
        if (!quoteEl || !authorEl) return;

        const randomIndex = Math.floor(Math.random() * INTERVIEW_TIPS.length);
        const item = INTERVIEW_TIPS[randomIndex];

        quoteEl.textContent = `"${item.quote}"`;
        authorEl.textContent = `— ${item.author}`;
    };

    function formatTimeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        if (seconds < 60) return "Just now";
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    }

    // -------------------------------------------------------------
    // 7. ANSWER EVALUATION ENGINE (Local Heuristic & Keyword Matcher)
    // -------------------------------------------------------------
    const EvaluationEngine = {
        /**
         * Evaluates a candidate's answer against the target question's keywords & model answer
         */
        evaluate(candidateAnswer, question) {
            const text = (candidateAnswer || "").trim();
            const lowerText = text.toLowerCase();
            const keywords = question.keywords || [];

            if (!text || text.length < 5) {
                return {
                    score: 0,
                    quality: "Needs Improvement",
                    detected: [],
                    missing: keywords,
                    suggestions: [
                        "Your response is empty or too short. Provide a structured, multi-sentence technical explanation.",
                        "Aim to address fundamental definitions, implementation details, and trade-offs."
                    ],
                    modelAnswer: question.answer
                };
            }

            // Word count and length metrics
            const words = text.split(/\s+/).filter(Boolean);
            const wordCount = words.length;

            const detected = [];
            const missing = [];

            // Detect matched keywords (supporting partial stem matches)
            keywords.forEach(kw => {
                const kwLower = kw.toLowerCase();
                // Check direct substring or regex boundary match
                const regex = new RegExp(`\\b${kwLower.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}`, "i");
                if (regex.test(lowerText) || lowerText.includes(kwLower)) {
                    detected.push(kw);
                } else {
                    missing.push(kw);
                }
            });

            // Calculate concept coverage percentage (65% weight)
            const coverageRatio = keywords.length > 0 ? (detected.length / keywords.length) : 0;
            const conceptScore = coverageRatio * 65;

            // Calculate depth & length score (25% weight)
            // Ideal answer has 35 - 120 words
            let depthScore = 0;
            if (wordCount >= 60) {
                depthScore = 25;
            } else if (wordCount >= 35) {
                depthScore = 20;
            } else if (wordCount >= 20) {
                depthScore = 15;
            } else if (wordCount >= 10) {
                depthScore = 10;
            } else {
                depthScore = 5;
            }

            // Structure & clarity bonus (10% weight)
            let structureScore = 0;
            if (text.includes(".") || text.includes(";") || text.includes(":") || text.includes("\n")) {
                structureScore += 5;
            }
            if (wordCount >= 25 && detected.length >= 2) {
                structureScore += 5;
            }

            // Total composite score (capped 0 - 100)
            let totalScore = Math.round(conceptScore + depthScore + structureScore);
            totalScore = Math.min(100, Math.max(10, totalScore));

            // Determine Quality Label
            let quality = "Needs Improvement";
            if (totalScore >= 85) {
                quality = "Excellent";
            } else if (totalScore >= 60) {
                quality = "Good";
            } else {
                quality = "Needs Improvement";
            }

            // Generate contextual improvement suggestions
            const suggestions = [];

            if (missing.length > 0) {
                const missingSample = missing.slice(0, 3).join(", ");
                suggestions.push(`Integrate key concepts and terminology: Consider elaborating on "${missingSample}".`);
            }

            if (wordCount < 40) {
                suggestions.push("Expand on the mechanics: State what happens under the hood or explain the internal data structures and memory behavior.");
            } else {
                suggestions.push("Structure with real-world context: Mention trade-offs, edge cases, or production considerations (e.g., concurrency, time/space complexity).");
            }

            if (detected.length === 0) {
                suggestions.push("Your response deviated from standard technical terminology. Review the model reference answer below.");
            } else if (totalScore >= 85) {
                suggestions.push("Strong answer! Continue maintaining concise, structured communication during live interview settings.");
            }

            return {
                score: totalScore,
                quality,
                detected,
                missing,
                suggestions,
                modelAnswer: question.answer
            };
        },

        /**
         * Optional AI API Evaluation (Backend Proxy / External Provider)
         */
        async evaluateWithAi(candidateAnswer, question, aiConfig) {
            if (!aiConfig.endpoint) {
                throw new Error("No AI Endpoint configured");
            }

            const prompt = `You are an expert technical interviewer evaluating a candidate's answer.
Question: ${question.question}
Category: ${question.category}
Model Answer: ${question.answer}
Candidate's Answer: ${candidateAnswer}

Return JSON with:
{
  "score": number (0-100),
  "quality": "Excellent" | "Good" | "Needs Improvement",
  "detected": string[],
  "missing": string[],
  "suggestions": string[]
}`;

            const response = await fetch(aiConfig.endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(aiConfig.apiKey ? { "Authorization": `Bearer ${aiConfig.apiKey}` } : {})
                },
                body: JSON.stringify({
                    prompt: prompt,
                    question: question.question,
                    answer: candidateAnswer,
                    category: question.category
                })
            });

            if (!response.ok) {
                throw new Error(`AI API responded with HTTP ${response.status}`);
            }

            const data = await response.json();
            return {
                score: data.score || 75,
                quality: data.quality || "Good",
                detected: data.detected || [],
                missing: data.missing || [],
                suggestions: data.suggestions || ["Clear technical explanation provided."],
                modelAnswer: question.answer
            };
        }
    };

    // -------------------------------------------------------------
    // 8. PRACTICE MODE CONTROLLER
    // -------------------------------------------------------------
    AppState.initPracticeMode = function () {
        const select = document.getElementById("practiceCategorySelect");
        const btnToggleHint = document.getElementById("btnToggleHint");
        const btnSubmitAnswer = document.getElementById("btnSubmitAnswer");
        const btnNextQuestion = document.getElementById("btnNextQuestion");
        const btnSkipQuestion = document.getElementById("btnSkipQuestion");
        const btnRetryAnswer = document.getElementById("btnRetryAnswer");
        const btnFeedbackContinue = document.getElementById("btnFeedbackContinue");
        const btnClearAnswer = document.getElementById("btnClearAnswer");
        const btnBookmarkQuestion = document.getElementById("btnBookmarkQuestion");
        const btnFinishSession = document.getElementById("btnFinishPracticeSession");
        const btnToggleModel = document.getElementById("btnToggleModelAnswer");
        const textarea = document.getElementById("userAnswerInput");

        if (select) {
            select.addEventListener("change", (e) => {
                this.filterPracticeQuestions(e.target.value);
            });
        }

        if (textarea) {
            textarea.addEventListener("input", () => {
                const text = textarea.value.trim();
                const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
                const chars = text.length;
                const counter = document.getElementById("answerWordCounter");
                if (counter) counter.textContent = `${words} words | ${chars} chars`;
            });
        }

        if (btnClearAnswer && textarea) {
            btnClearAnswer.addEventListener("click", () => {
                textarea.value = "";
                textarea.dispatchEvent(new Event("input"));
            });
        }

        if (btnToggleHint) {
            btnToggleHint.addEventListener("click", () => {
                const hintBox = document.getElementById("practiceHintBox");
                const label = document.getElementById("toggleHintLabel");
                if (!hintBox || !label) return;

                if (hintBox.style.display === "none") {
                    hintBox.style.display = "block";
                    label.textContent = "Hide Hint";
                } else {
                    hintBox.style.display = "none";
                    label.textContent = "Show Hint";
                }
            });
        }

        if (btnBookmarkQuestion) {
            btnBookmarkQuestion.addEventListener("click", () => {
                const q = this.practice.currentQuestion;
                if (!q) return;
                const icon = document.getElementById("practiceBookmarkIcon");
                const idx = this.state.bookmarks.indexOf(q.id);
                if (idx > -1) {
                    this.state.bookmarks.splice(idx, 1);
                    if (icon) icon.className = "fa-regular fa-bookmark";
                    showToast("Removed from revision bookmarks", "info");
                } else {
                    this.state.bookmarks.push(q.id);
                    if (icon) icon.className = "fa-solid fa-bookmark text-amber";
                    showToast("Saved to revision bookmarks", "success");
                }
                this.save();
            });
        }

        if (btnSubmitAnswer) {
            btnSubmitAnswer.addEventListener("click", () => this.submitPracticeAnswer());
        }

        if (btnNextQuestion) {
            btnNextQuestion.addEventListener("click", () => this.practiceNextQuestion());
        }

        if (btnFeedbackContinue) {
            btnFeedbackContinue.addEventListener("click", () => this.practiceNextQuestion());
        }

        if (btnSkipQuestion) {
            btnSkipQuestion.addEventListener("click", () => {
                showToast("Question skipped", "info");
                this.practiceNextQuestion();
            });
        }

        if (btnRetryAnswer) {
            btnRetryAnswer.addEventListener("click", () => {
                const feedbackCard = document.getElementById("evaluationFeedbackCard");
                const submitBtn = document.getElementById("btnSubmitAnswer");
                const nextBtn = document.getElementById("btnNextQuestion");
                if (feedbackCard) feedbackCard.style.display = "none";
                if (submitBtn) submitBtn.style.display = "inline-flex";
                if (nextBtn) nextBtn.style.display = "none";
                this.practice.isEvaluated = false;
                if (textarea) textarea.focus();
            });
        }

        if (btnToggleModel) {
            btnToggleModel.addEventListener("click", () => {
                const modelContent = document.getElementById("modelAnswerText");
                if (!modelContent) return;
                if (modelContent.style.display === "none") {
                    modelContent.style.display = "block";
                    btnToggleModel.textContent = "Hide Reference";
                } else {
                    modelContent.style.display = "none";
                    btnToggleModel.textContent = "Show Reference";
                }
            });
        }

        if (btnFinishSession) {
            btnFinishSession.addEventListener("click", () => this.finishPracticeSession());
        }

        // Start initial question filter & timer
        this.filterPracticeQuestions("all");
        this.startPracticeTimer();
    };

    AppState.startPracticeTimer = function () {
        if (this.practice.timerInterval) clearInterval(this.practice.timerInterval);
        this.practice.timerSeconds = 0;

        const display = document.getElementById("practiceTimerDisplay");
        this.practice.timerInterval = setInterval(() => {
            this.practice.timerSeconds += 1;
            if (display) {
                const mins = String(Math.floor(this.practice.timerSeconds / 60)).padStart(2, "0");
                const secs = String(this.practice.timerSeconds % 60).padStart(2, "0");
                display.textContent = `${mins}:${secs}`;
            }
        }, 1000);
    };

    AppState.filterPracticeQuestions = function (category) {
        if (!category || category === "all") {
            this.practice.filteredQuestions = [...this.questions];
        } else {
            this.practice.filteredQuestions = this.questions.filter(q => q.category === category);
        }

        this.practice.currentIndex = 0;
        this.loadPracticeQuestion(0);
    };

    AppState.loadPracticeQuestion = function (index) {
        const pool = this.practice.filteredQuestions;
        if (!pool || pool.length === 0) return;

        if (index < 0) index = 0;
        if (index >= pool.length) index = 0;

        this.practice.currentIndex = index;
        const q = pool[index];
        this.practice.currentQuestion = q;
        this.practice.isEvaluated = false;

        // Reset UI elements
        const qCounter = document.getElementById("practiceQuestionCounter");
        if (qCounter) qCounter.textContent = `${index + 1} / ${pool.length}`;

        const catBadge = document.getElementById("practiceCategoryBadge");
        if (catBadge) catBadge.textContent = q.category;

        const idBadge = document.getElementById("practiceQuestionIdBadge");
        if (idBadge) idBadge.textContent = `Question #${q.id}`;

        const qText = document.getElementById("practiceQuestionText");
        if (qText) qText.textContent = q.question;

        const hintText = document.getElementById("practiceHintText");
        if (hintText) hintText.textContent = q.hint;

        const hintBox = document.getElementById("practiceHintBox");
        const hintLabel = document.getElementById("toggleHintLabel");
        if (hintBox) hintBox.style.display = "none";
        if (hintLabel) hintLabel.textContent = "Show Hint";

        const textarea = document.getElementById("userAnswerInput");
        if (textarea) {
            textarea.value = "";
            textarea.dispatchEvent(new Event("input"));
        }

        const icon = document.getElementById("practiceBookmarkIcon");
        if (icon) {
            if (this.state.bookmarks.includes(q.id)) {
                icon.className = "fa-solid fa-bookmark text-amber";
            } else {
                icon.className = "fa-regular fa-bookmark";
            }
        }

        const feedbackCard = document.getElementById("evaluationFeedbackCard");
        if (feedbackCard) feedbackCard.style.display = "none";

        const submitBtn = document.getElementById("btnSubmitAnswer");
        const nextBtn = document.getElementById("btnNextQuestion");
        if (submitBtn) submitBtn.style.display = "inline-flex";
        if (nextBtn) nextBtn.style.display = "none";
    };

    AppState.submitPracticeAnswer = async function () {
        const textarea = document.getElementById("userAnswerInput");
        const text = textarea ? textarea.value.trim() : "";
        const q = this.practice.currentQuestion;

        if (!text) {
            showToast("Please enter an answer before submitting.", "warning");
            if (textarea) textarea.focus();
            return;
        }

        const submitBtn = document.getElementById("btnSubmitAnswer");
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Analyzing...`;
        }

        let evalResult = null;
        let isAi = false;

        // Check if AI mode is enabled
        if (this.state.aiConfig && this.state.aiConfig.enabled && this.state.aiConfig.endpoint) {
            try {
                evalResult = await EvaluationEngine.evaluateWithAi(text, q, this.state.aiConfig);
                isAi = true;
            } catch (err) {
                console.warn("AI API evaluation failed, falling back to local evaluator", err);
                showToast("External AI request failed. Evaluated with local engine.", "warning");
                evalResult = EvaluationEngine.evaluate(text, q);
            }
        } else {
            evalResult = EvaluationEngine.evaluate(text, q);
        }

        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles"></i> Submit Answer`;
            submitBtn.style.display = "none";
        }

        const nextBtn = document.getElementById("btnNextQuestion");
        if (nextBtn) nextBtn.style.display = "inline-flex";

        // Display results
        this.renderPracticeEvaluationResults(evalResult, isAi);
        AudioService.playSuccess();

        // Record attempt in state
        this.state.attempts.push({
            id: Date.now(),
            questionId: q.id,
            category: q.category,
            questionText: q.question,
            userAnswer: text,
            score: evalResult.score,
            quality: evalResult.quality,
            timestamp: new Date().toISOString()
        });

        this.practice.sessionAttempts += 1;
        this.practice.sessionTotalScore += evalResult.score;
        this.practice.isEvaluated = true;

        // Record daily activity & streak
        this.recordActivityDay();
    };

    AppState.renderPracticeEvaluationResults = function (res, isAi = false) {
        const card = document.getElementById("evaluationFeedbackCard");
        if (!card) return;

        const engineLabel = document.getElementById("feedbackEngineLabel");
        if (engineLabel) {
            engineLabel.textContent = isAi
                ? "AI LLM Evaluator (Connected Proxy)"
                : "Basic Automated Feedback (Concept Matcher)";
        }

        const scoreVal = document.getElementById("evalScoreValue");
        if (scoreVal) scoreVal.textContent = res.score;

        const qualityBadge = document.getElementById("evalQualityLabel");
        if (qualityBadge) {
            qualityBadge.textContent = res.quality;
            qualityBadge.className = "eval-quality-badge";
            if (res.quality === "Excellent") qualityBadge.classList.add("quality-excellent");
            else if (res.quality === "Good") qualityBadge.classList.add("quality-good");
            else qualityBadge.classList.add("quality-needs-improvement");
        }

        // Detected tags
        const detectedCount = document.getElementById("detectedCount");
        const detectedList = document.getElementById("detectedConceptsList");
        if (detectedCount) detectedCount.textContent = res.detected.length;
        if (detectedList) {
            detectedList.innerHTML = "";
            if (res.detected.length === 0) {
                detectedList.innerHTML = `<span class="text-muted text-sm">No primary keywords detected</span>`;
            } else {
                res.detected.forEach(tag => {
                    const span = document.createElement("span");
                    span.className = "concept-tag tag-detected";
                    span.innerHTML = `<i class="fa-solid fa-check"></i> ${escapeHtml(tag)}`;
                    detectedList.appendChild(span);
                });
            }
        }

        // Missing tags
        const missingCount = document.getElementById("missingCount");
        const missingList = document.getElementById("missingConceptsList");
        if (missingCount) missingCount.textContent = res.missing.length;
        if (missingList) {
            missingList.innerHTML = "";
            if (res.missing.length === 0) {
                missingList.innerHTML = `<span class="text-emerald text-sm"><i class="fa-solid fa-check-double"></i> All key concepts covered!</span>`;
            } else {
                res.missing.forEach(tag => {
                    const span = document.createElement("span");
                    span.className = "concept-tag tag-missing";
                    span.innerHTML = `<i class="fa-solid fa-xmark"></i> ${escapeHtml(tag)}`;
                    missingList.appendChild(span);
                });
            }
        }

        // Suggestions
        const suggList = document.getElementById("evalSuggestionsList");
        if (suggList) {
            suggList.innerHTML = "";
            res.suggestions.forEach(s => {
                const li = document.createElement("li");
                li.innerHTML = `<i class="fa-solid fa-angle-right"></i> <span>${escapeHtml(s)}</span>`;
                suggList.appendChild(li);
            });
        }

        // Model Answer
        const modelText = document.getElementById("modelAnswerText");
        if (modelText) {
            modelText.textContent = res.modelAnswer;
            modelText.style.display = "block";
        }
        const btnToggleModel = document.getElementById("btnToggleModelAnswer");
        if (btnToggleModel) btnToggleModel.textContent = "Hide Reference";

        card.style.display = "block";
        card.scrollIntoView({ behavior: "smooth", block: "nearest" });
    };

    AppState.practiceNextQuestion = function () {
        const pool = this.practice.filteredQuestions;
        let nextIndex = this.practice.currentIndex + 1;
        if (nextIndex >= pool.length) {
            nextIndex = 0;
            showToast("Reached the end of category deck. Cycling back to question #1.", "info");
        }
        this.loadPracticeQuestion(nextIndex);
    };

    AppState.finishPracticeSession = function () {
        const attempts = this.practice.sessionAttempts;
        const avg = attempts > 0 ? Math.round(this.practice.sessionTotalScore / attempts) : 0;
        const mins = String(Math.floor(this.practice.timerSeconds / 60)).padStart(2, "0");
        const secs = String(this.practice.timerSeconds % 60).padStart(2, "0");
        const durationFormatted = `${mins}:${secs}`;

        // Save session record to history
        if (attempts > 0) {
            const catSelect = document.getElementById("practiceCategorySelect");
            const catName = catSelect ? catSelect.value : "All Categories";

            this.state.history.push({
                id: Date.now(),
                mode: "Interactive Practice",
                category: catName,
                questionsCount: attempts,
                avgScore: avg,
                duration: durationFormatted,
                timestamp: new Date().toISOString()
            });
            this.save();
        }

        // Render Summary Modal
        const modal = document.getElementById("sessionSummaryModal");
        if (modal) {
            document.getElementById("sumAttemptedCount").textContent = attempts;
            document.getElementById("sumAvgScore").textContent = `${avg}%`;
            document.getElementById("sumDuration").textContent = durationFormatted;

            const encourText = document.getElementById("sumEncouragement");
            if (encourText) {
                if (avg >= 85) encourText.textContent = "Superb performance! Your answers demonstrate deep technical mastery and clear structure.";
                else if (avg >= 60) encourText.textContent = "Solid practice session! Review the missing concepts to turn your good answers into excellent ones.";
                else encourText.textContent = "Good effort! Regular daily practice will build your familiarity with key terms and architecture models.";
            }

            modal.style.display = "flex";
        }

        // Reset session accumulators
        this.practice.sessionAttempts = 0;
        this.practice.sessionTotalScore = 0;
    };

    // -------------------------------------------------------------
    // 9. MOCK INTERVIEW MODE CONTROLLER
    // -------------------------------------------------------------
    AppState.initMockMode = function () {
        const startBtn = document.getElementById("btnStartMockInterview");
        const quitBtn = document.getElementById("btnQuitMockInterview");
        const skipBtn = document.getElementById("btnMockSkip");
        const submitNextBtn = document.getElementById("btnMockSubmitNext");
        const hintBtn = document.getElementById("btnMockShowHint");
        const restartBtn = document.getElementById("btnReportRestartMock");
        const goDashBtn = document.getElementById("btnReportGoDashboard");
        const mockTextarea = document.getElementById("mockAnswerInput");

        if (startBtn) startBtn.addEventListener("click", () => this.startMockInterview());
        if (quitBtn) {
            quitBtn.addEventListener("click", () => {
                if (confirm("Are you sure you want to abort the current mock interview? Progress will be lost.")) {
                    this.abortMockInterview();
                }
            });
        }

        if (mockTextarea) {
            mockTextarea.addEventListener("input", () => {
                const text = mockTextarea.value.trim();
                const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
                const counter = document.getElementById("mockWordCounter");
                if (counter) counter.textContent = `${words} words`;
            });
        }

        if (hintBtn) {
            hintBtn.addEventListener("click", () => {
                const hintBox = document.getElementById("mockHintBox");
                const label = document.getElementById("mockHintBtnLabel");
                if (!hintBox || !label) return;
                if (hintBox.style.display === "none") {
                    hintBox.style.display = "block";
                    label.textContent = "Hide Hint";
                } else {
                    hintBox.style.display = "none";
                    label.textContent = "Hint";
                }
            });
        }

        if (skipBtn) {
            skipBtn.addEventListener("click", () => this.handleMockSkipQuestion());
        }

        if (submitNextBtn) {
            submitNextBtn.addEventListener("click", () => this.handleMockSubmitQuestion());
        }

        if (restartBtn) {
            restartBtn.addEventListener("click", () => {
                document.getElementById("mockReportScreen").style.display = "none";
                document.getElementById("mockSetupScreen").style.display = "block";
            });
        }

        if (goDashBtn) {
            goDashBtn.addEventListener("click", () => {
                document.getElementById("mockReportScreen").style.display = "none";
                document.getElementById("mockSetupScreen").style.display = "block";
                this.switchSection("dashboard");
            });
        }
    };

    AppState.startMockInterview = function () {
        const catSelect = document.getElementById("mockCategorySelect");
        const countSelect = document.getElementById("mockQuestionCountSelect");
        const timerSelect = document.getElementById("mockTimerLimitSelect");

        const category = catSelect ? catSelect.value : "all";
        const count = countSelect ? parseInt(countSelect.value, 10) : 10;
        const timerLimitMins = timerSelect ? parseInt(timerSelect.value, 10) : 20;

        // Filter and shuffle questions
        let pool = category === "all"
            ? [...this.questions]
            : this.questions.filter(q => q.category === category);

        if (pool.length === 0) pool = [...this.questions];

        // Fisher-Yates shuffle
        for (let i = pool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pool[i], pool[j]] = [pool[j], pool[i]];
        }

        const selected = pool.slice(0, Math.min(count, pool.length));

        this.mock.activeQuestions = selected;
        this.mock.currentIndex = 0;
        this.mock.currentQuestion = selected[0];
        this.mock.results = [];
        this.mock.category = category;
        this.mock.totalQuestions = selected.length;
        this.mock.elapsedSeconds = 0;

        if (timerLimitMins === 0) {
            this.mock.isUntimed = true;
            this.mock.timeRemaining = 0;
        } else {
            this.mock.isUntimed = false;
            this.mock.timeRemaining = timerLimitMins * 60;
        }

        // Switch screens
        document.getElementById("mockSetupScreen").style.display = "none";
        document.getElementById("mockReportScreen").style.display = "none";
        document.getElementById("mockActiveScreen").style.display = "block";

        this.startMockTimer();
        this.loadMockQuestion(0);
        showToast("Mock Interview started! Answer thoroughly and maintain a steady pace.", "info");
    };

    AppState.startMockTimer = function () {
        if (this.mock.timerInterval) clearInterval(this.mock.timerInterval);

        const display = document.getElementById("mockTimerDisplay");

        this.mock.timerInterval = setInterval(() => {
            this.mock.elapsedSeconds += 1;

            if (this.mock.isUntimed) {
                const mins = String(Math.floor(this.mock.elapsedSeconds / 60)).padStart(2, "0");
                const secs = String(this.mock.elapsedSeconds % 60).padStart(2, "0");
                if (display) display.textContent = `${mins}:${secs}`;
            } else {
                this.mock.timeRemaining -= 1;
                if (this.mock.timeRemaining <= 0) {
                    clearInterval(this.mock.timerInterval);
                    AudioService.playAlert();
                    showToast("Time expired! Finalizing your mock interview report.", "warning");
                    this.finishMockInterview();
                    return;
                }

                const mins = String(Math.floor(this.mock.timeRemaining / 60)).padStart(2, "0");
                const secs = String(this.mock.timeRemaining % 60).padStart(2, "0");
                if (display) display.textContent = `${mins}:${secs}`;
            }
        }, 1000);
    };

    AppState.loadMockQuestion = function (index) {
        const pool = this.mock.activeQuestions;
        if (!pool || index >= pool.length) {
            this.finishMockInterview();
            return;
        }

        this.mock.currentIndex = index;
        const q = pool[index];
        this.mock.currentQuestion = q;

        // Update progress bar & counters
        const pct = Math.round(((index + 1) / pool.length) * 100);
        const pBar = document.getElementById("mockProgressBar");
        if (pBar) pBar.style.width = `${pct}%`;

        const counter = document.getElementById("mockActiveCounter");
        if (counter) counter.textContent = `Question ${index + 1} of ${pool.length}`;

        const catBadge = document.getElementById("mockActiveCategoryBadge");
        if (catBadge) catBadge.textContent = this.mock.category === "all" ? "Mixed Domains" : this.mock.category;

        const qCatPill = document.getElementById("mockQuestionCategoryPill");
        if (qCatPill) qCatPill.textContent = q.category;

        const qNumPill = document.getElementById("mockQuestionNumberPill");
        if (qNumPill) qNumPill.textContent = `Q${index + 1}`;

        const qTitle = document.getElementById("mockActiveQuestionText");
        if (qTitle) qTitle.textContent = q.question;

        const hintText = document.getElementById("mockHintText");
        if (hintText) hintText.textContent = q.hint;

        const hintBox = document.getElementById("mockHintBox");
        const hintBtnLabel = document.getElementById("mockHintBtnLabel");
        if (hintBox) hintBox.style.display = "none";
        if (hintBtnLabel) hintBtnLabel.textContent = "Hint";

        const textarea = document.getElementById("mockAnswerInput");
        if (textarea) {
            textarea.value = "";
            textarea.dispatchEvent(new Event("input"));
            textarea.focus();
        }
    };

    AppState.handleMockSkipQuestion = function () {
        const q = this.mock.currentQuestion;
        this.mock.results.push({
            question: q,
            userAnswer: "[Skipped by candidate]",
            score: 0,
            quality: "Needs Improvement",
            detected: [],
            missing: q.keywords,
            skipped: true
        });

        AudioService.playTick();
        const nextIndex = this.mock.currentIndex + 1;
        this.loadMockQuestion(nextIndex);
    };

    AppState.handleMockSubmitQuestion = function () {
        const textarea = document.getElementById("mockAnswerInput");
        const text = textarea ? textarea.value.trim() : "";
        const q = this.mock.currentQuestion;

        if (!text) {
            showToast("Please enter an answer or click Skip.", "warning");
            if (textarea) textarea.focus();
            return;
        }

        const evalRes = EvaluationEngine.evaluate(text, q);

        this.mock.results.push({
            question: q,
            userAnswer: text,
            score: evalRes.score,
            quality: evalRes.quality,
            detected: evalRes.detected,
            missing: evalRes.missing,
            skipped: false
        });

        // Record individual attempt into state history
        this.state.attempts.push({
            id: Date.now(),
            questionId: q.id,
            category: q.category,
            questionText: q.question,
            userAnswer: text,
            score: evalRes.score,
            quality: evalRes.quality,
            timestamp: new Date().toISOString()
        });

        this.recordActivityDay();
        AudioService.playTick();

        const nextIndex = this.mock.currentIndex + 1;
        this.loadMockQuestion(nextIndex);
    };

    AppState.abortMockInterview = function () {
        if (this.mock.timerInterval) clearInterval(this.mock.timerInterval);
        document.getElementById("mockActiveScreen").style.display = "none";
        document.getElementById("mockSetupScreen").style.display = "block";
    };

    AppState.finishMockInterview = function () {
        if (this.mock.timerInterval) clearInterval(this.mock.timerInterval);

        const results = this.mock.results;
        const total = results.length;
        const totalScore = results.reduce((acc, r) => acc + r.score, 0);
        const avgScore = total > 0 ? Math.round(totalScore / total) : 0;
        const answeredCount = results.filter(r => !r.skipped).length;
        const skippedCount = results.filter(r => r.skipped).length;

        const mins = String(Math.floor(this.mock.elapsedSeconds / 60)).padStart(2, "0");
        const secs = String(this.mock.elapsedSeconds % 60).padStart(2, "0");
        const durationFormatted = `${mins}m ${secs}s`;

        // Save mock session to history
        this.state.history.push({
            id: Date.now(),
            mode: "Mock Interview Simulation",
            category: this.mock.category === "all" ? "Comprehensive Mixed" : this.mock.category,
            questionsCount: total,
            avgScore: avgScore,
            duration: durationFormatted,
            timestamp: new Date().toISOString()
        });
        this.save();

        // Switch to Report Screen
        document.getElementById("mockActiveScreen").style.display = "none";
        document.getElementById("mockReportScreen").style.display = "block";

        // Fill Report Data
        const todayStr = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
        document.getElementById("mockReportDate").textContent = `Completed on ${todayStr}`;
        document.getElementById("reportAvgScore").textContent = `${avgScore}%`;

        const gradeLabel = document.getElementById("reportGradeLabel");
        if (gradeLabel) {
            if (avgScore >= 85) gradeLabel.textContent = "Outstanding Candidate (L5/L6 Ready)";
            else if (avgScore >= 70) gradeLabel.textContent = "Proficient Candidate (Solid Pass)";
            else if (avgScore >= 50) gradeLabel.textContent = "Developing Candidate (Borderline)";
            else gradeLabel.textContent = "Requires In-depth Practice";
        }

        document.getElementById("reportQuestionsEvaluated").textContent = `${total} / ${total}`;
        document.getElementById("reportAnsweredStats").textContent = `${answeredCount} Answered, ${skippedCount} Skipped`;
        document.getElementById("reportTimeElapsed").textContent = durationFormatted;

        // Categorize Strengths and Weaknesses
        const catMap = {};
        results.forEach(r => {
            const cat = r.question.category;
            if (!catMap[cat]) catMap[cat] = { totalScore: 0, count: 0 };
            catMap[cat].totalScore += r.score;
            catMap[cat].count += 1;
        });

        const catAverages = Object.keys(catMap).map(cat => ({
            category: cat,
            avg: Math.round(catMap[cat].totalScore / catMap[cat].count)
        }));

        const strongTopics = catAverages.filter(c => c.avg >= 70);
        const weakTopics = catAverages.filter(c => c.avg < 70);

        const strongEl = document.getElementById("reportStrongTopics");
        if (strongEl) {
            strongEl.innerHTML = "";
            if (strongTopics.length === 0) {
                strongEl.innerHTML = `<span class="text-muted text-sm">Keep practicing across all topics to build strength.</span>`;
            } else {
                strongTopics.forEach(s => {
                    const span = document.createElement("span");
                    span.className = "badge badge-emerald";
                    span.textContent = `${s.category} (${s.avg}%)`;
                    strongEl.appendChild(span);
                });
            }
        }

        const weakEl = document.getElementById("reportWeakTopics");
        if (weakEl) {
            weakEl.innerHTML = "";
            if (weakTopics.length === 0) {
                weakEl.innerHTML = `<span class="badge badge-emerald"><i class="fa-solid fa-check"></i> None! Solid competency across tested domains.</span>`;
            } else {
                weakTopics.forEach(w => {
                    const span = document.createElement("span");
                    span.className = "badge badge-info";
                    span.textContent = `${w.category} (${w.avg}%)`;
                    weakEl.appendChild(span);
                });
            }
        }

        // Render Question Breakdown List
        const listEl = document.getElementById("reportQuestionsList");
        if (listEl) {
            listEl.innerHTML = "";
            results.forEach((r, idx) => {
                const item = document.createElement("div");
                item.className = "report-q-item";

                const badgeClass = r.score >= 80 ? "badge-emerald" : (r.score >= 60 ? "badge-info" : "badge-secondary");

                item.innerHTML = `
                    <div class="report-q-header">
                        <span class="category-pill">${r.question.category}</span>
                        <span class="badge ${badgeClass}">Score: ${r.score}% (${r.quality})</span>
                    </div>
                    <div class="report-q-text"><strong>Q${idx + 1}:</strong> ${escapeHtml(r.question.question)}</div>
                    <div class="report-q-user-ans"><strong>Your Answer:</strong> ${escapeHtml(r.userAnswer)}</div>
                    <div class="text-sm text-secondary"><strong>Model Answer:</strong> ${escapeHtml(r.question.answer)}</div>
                `;
                listEl.appendChild(item);
            });
        }

        AudioService.playSuccess();
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // -------------------------------------------------------------
    // 10. FLASHCARDS REVISION CONTROLLER
    // -------------------------------------------------------------
    AppState.initFlashcardDeck = function () {
        const scene = document.getElementById("flashcardScene");
        const btnPrev = document.getElementById("btnPrevCard");
        const btnNext = document.getElementById("btnNextCard");
        const btnShuffle = document.getElementById("btnShuffleFlashcards");
        const catFilter = document.getElementById("flashcardCategoryFilter");
        const masteryFilter = document.getElementById("flashcardMasteryFilter");

        const btnEasy = document.getElementById("btnMarkEasy");
        const btnMed = document.getElementById("btnMarkMedium");
        const btnHard = document.getElementById("btnMarkHard");

        if (scene) {
            scene.addEventListener("click", () => this.toggleFlashcardFlip());
        }

        // Keyboard Spacebar to flip card
        document.addEventListener("keydown", (e) => {
            if (this.currentSection === "flashcards" && e.code === "Space") {
                // Ensure not typing in textarea or input
                const tag = document.activeElement ? document.activeElement.tagName.toLowerCase() : "";
                if (tag !== "textarea" && tag !== "input") {
                    e.preventDefault();
                    this.toggleFlashcardFlip();
                }
            }
        });

        if (btnPrev) btnPrev.addEventListener("click", () => this.flashcardPrev());
        if (btnNext) btnNext.addEventListener("click", () => this.flashcardNext());
        if (btnShuffle) {
            btnShuffle.addEventListener("click", () => {
                this.shuffleFlashcardDeck();
                showToast("Flashcard deck shuffled!", "info");
            });
        }

        if (catFilter) catFilter.addEventListener("change", () => this.filterFlashcards());
        if (masteryFilter) masteryFilter.addEventListener("change", () => this.filterFlashcards());

        if (btnEasy) btnEasy.addEventListener("click", () => this.markFlashcardMastery("easy"));
        if (btnMed) btnMed.addEventListener("click", () => this.markFlashcardMastery("medium"));
        if (btnHard) btnHard.addEventListener("click", () => this.markFlashcardMastery("difficult"));

        this.filterFlashcards();
    };

    AppState.toggleFlashcardFlip = function () {
        const scene = document.getElementById("flashcardScene");
        if (!scene) return;
        this.flashcards.isFlipped = !this.flashcards.isFlipped;
        if (this.flashcards.isFlipped) {
            scene.classList.add("is-flipped");
        } else {
            scene.classList.remove("is-flipped");
        }
        AudioService.playTick();
    };

    AppState.filterFlashcards = function () {
        const catFilter = document.getElementById("flashcardCategoryFilter");
        const masteryFilter = document.getElementById("flashcardMasteryFilter");

        const catVal = catFilter ? catFilter.value : "all";
        const mastVal = masteryFilter ? masteryFilter.value : "all";

        let deck = [...this.questions];

        if (catVal !== "all") {
            deck = deck.filter(q => q.category === catVal);
        }

        if (mastVal !== "all") {
            deck = deck.filter(q => {
                const status = this.state.flashcardMastery[q.id] || "unrated";
                return status === mastVal;
            });
        }

        this.flashcards.activeDeck = deck;
        this.flashcards.currentIndex = 0;
        this.loadFlashcard(0);
        this.updateFlashcardStats();
    };

    AppState.shuffleFlashcardDeck = function () {
        const deck = this.flashcards.activeDeck;
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        this.flashcards.currentIndex = 0;
        this.loadFlashcard(0);
    };

    AppState.loadFlashcard = function (index) {
        const deck = this.flashcards.activeDeck;
        const scene = document.getElementById("flashcardScene");
        if (scene) scene.classList.remove("is-flipped");
        this.flashcards.isFlipped = false;

        const counter = document.getElementById("flashcardCounter");

        if (!deck || deck.length === 0) {
            if (counter) counter.textContent = "0 Cards Found";
            document.getElementById("fcFrontQuestion").textContent = "No flashcards match the selected filters. Try choosing 'All Categories' or 'All Difficulties'.";
            document.getElementById("fcBackAnswer").textContent = "N/A";
            return;
        }

        if (index < 0) index = 0;
        if (index >= deck.length) index = deck.length - 1;

        this.flashcards.currentIndex = index;
        const q = deck[index];

        if (counter) counter.textContent = `Card ${index + 1} of ${deck.length}`;

        // Front Face
        document.getElementById("fcFrontCategory").textContent = q.category;
        document.getElementById("fcFrontQuestion").textContent = q.question;

        const currentMastery = this.state.flashcardMastery[q.id] || "unrated";
        const masteryEl = document.getElementById("fcFrontMastery");
        if (masteryEl) {
            masteryEl.textContent = currentMastery.toUpperCase();
            masteryEl.className = `mastery-pill mastery-${currentMastery}`;
        }

        // Back Face
        document.getElementById("fcBackCategory").textContent = q.category;
        document.getElementById("fcBackAnswer").textContent = q.answer;

        const kwWrap = document.getElementById("fcBackKeywords");
        if (kwWrap) {
            kwWrap.innerHTML = "";
            (q.keywords || []).forEach(kw => {
                const tag = document.createElement("span");
                tag.className = "badge badge-secondary";
                tag.textContent = kw;
                kwWrap.appendChild(tag);
            });
        }

        // Highlight active rating button
        const btnEasy = document.getElementById("btnMarkEasy");
        const btnMed = document.getElementById("btnMarkMedium");
        const btnHard = document.getElementById("btnMarkHard");

        if (btnEasy) btnEasy.classList.toggle("active-easy", currentMastery === "easy");
        if (btnMed) btnMed.classList.toggle("active-med", currentMastery === "medium");
        if (btnHard) btnHard.classList.toggle("active-hard", currentMastery === "difficult");
    };

    AppState.flashcardPrev = function () {
        if (this.flashcards.currentIndex > 0) {
            this.loadFlashcard(this.flashcards.currentIndex - 1);
        } else {
            showToast("Already at the first card in deck", "info");
        }
    };

    AppState.flashcardNext = function () {
        const deck = this.flashcards.activeDeck;
        if (this.flashcards.currentIndex < deck.length - 1) {
            this.loadFlashcard(this.flashcards.currentIndex + 1);
        } else {
            showToast("Reached the end of the deck! Cycling to beginning.", "info");
            this.loadFlashcard(0);
        }
    };

    AppState.markFlashcardMastery = function (level) {
        const deck = this.flashcards.activeDeck;
        if (!deck || deck.length === 0) return;
        const q = deck[this.flashcards.currentIndex];
        if (!q) return;

        this.state.flashcardMastery[q.id] = level;
        this.save();
        this.loadFlashcard(this.flashcards.currentIndex);
        this.updateFlashcardStats();
        AudioService.playTick();
        showToast(`Marked card as ${level.toUpperCase()}`, "success");
    };

    AppState.updateFlashcardStats = function () {
        const mastery = this.state.flashcardMastery || {};
        let easy = 0, med = 0, hard = 0, unrated = 0;

        this.questions.forEach(q => {
            const m = mastery[q.id];
            if (m === "easy") easy++;
            else if (m === "medium") med++;
            else if (m === "difficult") hard++;
            else unrated++;
        });

        const elEasy = document.getElementById("fcCountEasy");
        const elMed = document.getElementById("fcCountMedium");
        const elHard = document.getElementById("fcCountHard");
        const elUnrated = document.getElementById("fcCountUnrated");

        if (elEasy) elEasy.textContent = easy;
        if (elMed) elMed.textContent = med;
        if (elHard) elHard.textContent = hard;
        if (elUnrated) elUnrated.textContent = unrated;
    };

    // -------------------------------------------------------------
    // 11. ANALYTICS & INSIGHTS VIEW
    // -------------------------------------------------------------
    AppState.renderAnalyticsView = function () {
        const attempts = this.state.attempts || [];
        const history = this.state.history || [];

        // Total answers evaluated
        document.getElementById("anTotalEvaluated").textContent = attempts.length;

        // Overall average score
        let avg = 0;
        if (attempts.length > 0) {
            const sum = attempts.reduce((acc, curr) => acc + curr.score, 0);
            avg = Math.round(sum / attempts.length);
        }
        document.getElementById("anOverallAvg").textContent = `${avg}%`;

        // Mock sessions taken
        const mockSessions = history.filter(h => h.mode.includes("Mock")).length;
        document.getElementById("anMockSessions").textContent = mockSessions;

        // Identify primary growth area (lowest score domain)
        const categories = [
            "Java Interview", "Python Interview", "JavaScript Interview", "SQL Interview",
            "Data Structures and Algorithms", "HTML and CSS", "Computer Networks",
            "Operating Systems", "DBMS", "HR Interview"
        ];

        let minAvg = 101;
        let weakestCat = "None (All strong)";

        categories.forEach(cat => {
            const catAttempts = attempts.filter(a => a.category === cat);
            if (catAttempts.length > 0) {
                const cAvg = Math.round(catAttempts.reduce((acc, c) => acc + c.score, 0) / catAttempts.length);
                if (cAvg < minAvg) {
                    minAvg = cAvg;
                    weakestCat = cat;
                }
            }
        });

        const elWeak = document.getElementById("anWeakestTopic");
        const elWeakDet = document.getElementById("anWeakestTopicDetail");
        if (elWeak) elWeak.textContent = weakestCat === "None (All strong)" ? "All Balanced" : weakestCat;
        if (elWeakDet) elWeakDet.textContent = minAvg <= 100 ? `Average: ${minAvg}%` : "Practice to calculate";

        // Render detailed breakdown table
        const tbody = document.getElementById("domainBreakdownTbody");
        if (tbody) {
            tbody.innerHTML = "";
            categories.forEach(cat => {
                const catAttempts = attempts.filter(a => a.category === cat);
                const count = catAttempts.length;
                const catAvg = count > 0 ? Math.round(catAttempts.reduce((acc, c) => acc + c.score, 0) / count) : 0;

                let profLevel = "Untested";
                let profBadge = "badge-secondary";
                let actionText = "Start Practice";

                if (count > 0) {
                    if (catAvg >= 85) {
                        profLevel = "Mastered";
                        profBadge = "badge-emerald";
                        actionText = "Maintain Mastery";
                    } else if (catAvg >= 65) {
                        profLevel = "Proficient";
                        profBadge = "badge-info";
                        actionText = "Review Hints";
                    } else {
                        profLevel = "Needs Practice";
                        profBadge = "badge-purple";
                        actionText = "Deep Dive";
                    }
                }

                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td><strong>${escapeHtml(cat)}</strong></td>
                    <td>${count} Questions</td>
                    <td><strong class="text-emerald">${count > 0 ? `${catAvg}%` : "—"}</strong></td>
                    <td><span class="badge ${profBadge}">${profLevel}</span></td>
                    <td>
                        <button class="btn btn-outline btn-xs" data-practice-cat="${escapeHtml(cat)}">
                            ${actionText} <i class="fa-solid fa-arrow-right"></i>
                        </button>
                    </td>
                `;

                const btn = tr.querySelector("button");
                btn.addEventListener("click", () => {
                    const sel = document.getElementById("practiceCategorySelect");
                    if (sel) sel.value = cat;
                    this.switchSection("practice");
                    this.filterPracticeQuestions(cat);
                });

                tbody.appendChild(tr);
            });
        }
    };

    AppState.initCharts = function () {
        if (typeof Chart === "undefined") {
            console.warn("Chart.js is not loaded yet");
            return;
        }

        const categories = [
            "Java", "Python", "JavaScript", "SQL", "DSA",
            "HTML/CSS", "Networks", "OS", "DBMS", "HR"
        ];

        // 1. Radar Chart Setup
        const radarCtx = document.getElementById("categoryRadarChart");
        if (radarCtx) {
            const isDark = this.state.theme === "dark";
            const gridColor = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)";
            const textColor = isDark ? "#94a3b8" : "#475569";

            this.charts.radar = new Chart(radarCtx, {
                type: "radar",
                data: {
                    labels: categories,
                    datasets: [{
                        label: "Mastery Level (%)",
                        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        backgroundColor: "rgba(99, 102, 241, 0.25)",
                        borderColor: "#6366f1",
                        pointBackgroundColor: "#8b5cf6",
                        pointBorderColor: "#ffffff",
                        pointHoverBackgroundColor: "#ffffff",
                        pointHoverBorderColor: "#8b5cf6"
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        r: {
                            min: 0,
                            max: 100,
                            ticks: {
                                stepSize: 20,
                                display: false
                            },
                            grid: { color: gridColor },
                            angleLines: { color: gridColor },
                            pointLabels: {
                                color: textColor,
                                font: { size: 11, family: "'Plus Jakarta Sans', sans-serif" }
                            }
                        }
                    },
                    plugins: {
                        legend: { display: false }
                    }
                }
            });
        }

        // 2. Line Chart Setup
        const lineCtx = document.getElementById("scoreHistoryLineChart");
        if (lineCtx) {
            const isDark = this.state.theme === "dark";
            const gridColor = isDark ? "rgba(255, 255, 255, 0.07)" : "rgba(0, 0, 0, 0.06)";
            const textColor = isDark ? "#94a3b8" : "#475569";

            this.charts.line = new Chart(lineCtx, {
                type: "line",
                data: {
                    labels: ["S1", "S2", "S3", "S4", "S5"],
                    datasets: [{
                        label: "Session Score",
                        data: [0, 0, 0, 0, 0],
                        borderColor: "#10b981",
                        backgroundColor: "rgba(16, 185, 129, 0.15)",
                        fill: true,
                        tension: 0.35,
                        pointRadius: 4,
                        pointBackgroundColor: "#10b981"
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            min: 0,
                            max: 100,
                            grid: { color: gridColor },
                            ticks: { color: textColor }
                        },
                        x: {
                            grid: { color: gridColor },
                            ticks: { color: textColor }
                        }
                    },
                    plugins: {
                        legend: { display: false }
                    }
                }
            });
        }

        this.updateCharts();
    };

    AppState.updateCharts = function () {
        if (!this.charts.radar && !this.charts.line) return;

        const attempts = this.state.attempts || [];
        const history = this.state.history || [];

        const catFullNames = [
            "Java Interview", "Python Interview", "JavaScript Interview", "SQL Interview",
            "Data Structures and Algorithms", "HTML and CSS", "Computer Networks",
            "Operating Systems", "DBMS", "HR Interview"
        ];

        // Calculate radar data
        const radarScores = catFullNames.map(cat => {
            const catAttempts = attempts.filter(a => a.category === cat);
            if (catAttempts.length === 0) return 0;
            return Math.round(catAttempts.reduce((acc, c) => acc + c.score, 0) / catAttempts.length);
        });

        if (this.charts.radar) {
            this.charts.radar.data.datasets[0].data = radarScores;
            this.charts.radar.update();
        }

        // Calculate line history scores (last 8 sessions)
        if (this.charts.line) {
            const recent = history.slice(-8);
            if (recent.length === 0) {
                this.charts.line.data.labels = ["None"];
                this.charts.line.data.datasets[0].data = [0];
            } else {
                this.charts.line.data.labels = recent.map((_, i) => `S${i + 1}`);
                this.charts.line.data.datasets[0].data = recent.map(h => h.avgScore || 0);
            }
            this.charts.line.update();
        }
    };

    // -------------------------------------------------------------
    // 12. PRACTICE HISTORY LOGGING & EXPORT
    // -------------------------------------------------------------
    AppState.renderHistoryTable = function () {
        const tbody = document.getElementById("historyTableBody");
        const emptyState = document.getElementById("historyEmptyState");
        const table = document.getElementById("historyTable");
        const btnHistoryStart = document.getElementById("btnHistoryStartPractice");
        const btnClear = document.getElementById("btnClearHistory");
        const btnExport = document.getElementById("btnExportHistory");

        if (btnHistoryStart) {
            btnHistoryStart.onclick = () => this.switchSection("practice");
        }

        const history = (this.state.history || []).slice().reverse();

        if (history.length === 0) {
            if (tbody) tbody.innerHTML = "";
            if (table) table.style.display = "none";
            if (emptyState) emptyState.style.display = "block";
        } else {
            if (table) table.style.display = "table";
            if (emptyState) emptyState.style.display = "none";

            if (tbody) {
                tbody.innerHTML = "";
                history.forEach(item => {
                    const tr = document.createElement("tr");
                    const dateStr = new Date(item.timestamp).toLocaleString();
                    const scoreClass = item.avgScore >= 80 ? "badge-emerald" : (item.avgScore >= 60 ? "badge-info" : "badge-purple");

                    tr.innerHTML = `
                        <td>${dateStr}</td>
                        <td><strong>${escapeHtml(item.mode)}</strong></td>
                        <td><span class="category-pill">${escapeHtml(item.category)}</span></td>
                        <td>${item.questionsCount} Qs (${item.duration || "N/A"})</td>
                        <td><strong class="text-emerald">${item.avgScore}%</strong></td>
                        <td><span class="badge ${scoreClass}">Recorded</span></td>
                    `;
                    tbody.appendChild(tr);
                });
            }
        }

        // Clear History with Confirmation Modal
        if (btnClear) {
            btnClear.onclick = () => {
                this.showConfirmDialog(
                    "Clear Practice History?",
                    "Are you sure you want to delete all practice and mock session logs? Your statistics will reset.",
                    () => {
                        this.state.history = [];
                        this.state.attempts = [];
                        this.save();
                        this.renderHistoryTable();
                        this.renderDashboard();
                        showToast("Practice logs cleared successfully.", "info");
                    }
                );
            };
        }

        // Export Data as JSON
        if (btnExport) {
            btnExport.onclick = () => {
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.state, null, 2));
                const dlAnchor = document.createElement("a");
                dlAnchor.setAttribute("href", dataStr);
                dlAnchor.setAttribute("download", `ai_interview_coach_export_${Date.now()}.json`);
                document.body.appendChild(dlAnchor);
                dlAnchor.click();
                dlAnchor.remove();
                showToast("Practice data exported as JSON file.", "success");
            };
        }
    };

    AppState.showConfirmDialog = function (title, message, onAccept) {
        const modal = document.getElementById("confirmModal");
        const titleEl = document.getElementById("confirmModalTitle");
        const msgEl = document.getElementById("confirmModalMessage");
        const acceptBtn = document.getElementById("btnConfirmAccept");

        if (!modal || !titleEl || !msgEl || !acceptBtn) return;

        titleEl.textContent = title;
        msgEl.textContent = message;
        modal.style.display = "flex";

        acceptBtn.onclick = () => {
            modal.style.display = "none";
            if (typeof onAccept === "function") onAccept();
        };
    };

    // -------------------------------------------------------------
    // 13. SETTINGS CONTROLLER
    // -------------------------------------------------------------
    AppState.renderSettings = function () {
        const btnDark = document.getElementById("btnThemeChoiceDark");
        const btnLight = document.getElementById("btnThemeChoiceLight");
        const soundToggle = document.getElementById("settingSoundToggle");
        const goalInput = document.getElementById("settingDailyGoalInput");
        const timerSelect = document.getElementById("settingDefaultTimerSelect");

        const aiToggle = document.getElementById("settingAiApiToggle");
        const aiFields = document.getElementById("aiConfigFields");
        const aiEndpoint = document.getElementById("aiApiEndpointInput");
        const aiKey = document.getElementById("aiApiKeyInput");
        const btnSaveAi = document.getElementById("btnSaveAiConfig");
        const btnEye = document.getElementById("btnToggleApiKeyEye");

        const btnResetAll = document.getElementById("btnResetAllData");

        // Theme Choice Buttons
        if (btnDark) btnDark.onclick = () => this.applyTheme("dark");
        if (btnLight) btnLight.onclick = () => this.applyTheme("light");

        // Sound Effects Toggle
        if (soundToggle) {
            soundToggle.checked = this.state.soundEnabled;
            soundToggle.onchange = (e) => {
                this.state.soundEnabled = e.target.checked;
                this.save();
                showToast(`Sound effects ${e.target.checked ? "enabled" : "disabled"}.`, "info");
            };
        }

        // Daily Goal Input
        if (goalInput) {
            goalInput.value = this.state.dailyGoal || 5;
            goalInput.onchange = (e) => {
                const val = Math.max(1, Math.min(50, parseInt(e.target.value, 10) || 5));
                this.state.dailyGoal = val;
                this.save();
                this.updateGoalDisplays();
                showToast(`Daily goal updated to ${val} questions.`, "success");
            };
        }

        // Default Timer Duration
        if (timerSelect) {
            timerSelect.value = String(this.state.defaultTimerMinutes || 20);
            timerSelect.onchange = (e) => {
                this.state.defaultTimerMinutes = parseInt(e.target.value, 10);
                this.save();
                showToast(`Default mock timer set to ${e.target.value} minutes.`, "info");
            };
        }

        // AI API Toggle and Fields
        if (aiToggle && aiFields) {
            aiToggle.checked = this.state.aiConfig ? this.state.aiConfig.enabled : false;
            aiFields.style.display = aiToggle.checked ? "block" : "none";

            aiToggle.onchange = (e) => {
                if (!this.state.aiConfig) this.state.aiConfig = { enabled: false, endpoint: "", apiKey: "" };
                this.state.aiConfig.enabled = e.target.checked;
                aiFields.style.display = e.target.checked ? "block" : "none";
                this.save();
                showToast(`AI API evaluation mode ${e.target.checked ? "activated" : "deactivated"}.`, "info");
            };
        }

        if (aiEndpoint && this.state.aiConfig) aiEndpoint.value = this.state.aiConfig.endpoint || "";
        if (aiKey && this.state.aiConfig) aiKey.value = this.state.aiConfig.apiKey || "";

        if (btnEye && aiKey) {
            btnEye.onclick = () => {
                if (aiKey.type === "password") {
                    aiKey.type = "text";
                    btnEye.innerHTML = `<i class="fa-solid fa-eye-slash"></i>`;
                } else {
                    aiKey.type = "password";
                    btnEye.innerHTML = `<i class="fa-solid fa-eye"></i>`;
                }
            };
        }

        if (btnSaveAi && aiEndpoint && aiKey) {
            btnSaveAi.onclick = () => {
                if (!this.state.aiConfig) this.state.aiConfig = { enabled: true, endpoint: "", apiKey: "" };
                this.state.aiConfig.endpoint = aiEndpoint.value.trim();
                this.state.aiConfig.apiKey = aiKey.value.trim();
                this.save();
                showToast("Custom AI integration parameters saved.", "success");
            };
        }

        // Full Factory Reset Button
        if (btnResetAll) {
            btnResetAll.onclick = () => {
                this.showConfirmDialog(
                    "Factory Reset Application?",
                    "This will permanently delete all session history, daily streaks, flashcard ratings, and custom settings. Are you completely sure?",
                    () => {
                        StorageService.clearAll();
                        showToast("Application data reset. Reloading...", "info");
                        setTimeout(() => {
                            window.location.reload();
                        }, 800);
                    }
                );
            };
        }
    };

    // -------------------------------------------------------------
    // 14. APPLICATION BOOTSTRAPPER
    // -------------------------------------------------------------
    document.addEventListener("DOMContentLoaded", () => {
        AppState.init();
    });

})();
