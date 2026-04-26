const QUESTION_BANK = Array.isArray(window.QUESTION_DATASET) ? window.QUESTION_DATASET : [];

const GAINS = [1000, 5000, 10000, 20000, 50000, 100000, 250000, 500000, 750000, 1000000, 1500000, 2000000];
const QUESTION_TIME = 60;
const QUESTIONS_PER_RUN = 12;
const LEADERBOARD_KEY = "lakota-leaderboard";
const USERS_KEY = "lakota-users";
const SESSION_KEY = "lakota-session";
const QUESTION_HISTORY_KEY = "genie-ivoire-question-history";
const QUESTION_STATS_KEY = "genie-ivoire-question-stats";
const DIFFICULTY_KEY = "lakota-selected-difficulty";
const QUESTION_BATCH_SIZE = 10;
const RECENT_CATEGORY_WINDOW = 3;
const LEADERBOARD_LIMIT = 25;
const AVATAR_STYLE_FALLBACK = "sunrise";

const AVATAR_STYLE_MAP = {
  sunrise: "linear-gradient(135deg, #ff8a5b, #ffcf6e)",
  lagoon: "linear-gradient(135deg, #00c6a2, #2dd4ff)",
  royal: "linear-gradient(135deg, #7c4dff, #ff5aa6)",
  ember: "linear-gradient(135deg, #ff5a36, #7c1dff)",
  forest: "linear-gradient(135deg, #0f9d74, #95f179)",
  midnight: "linear-gradient(135deg, #151b54, #4d7cff)",
  gold: "linear-gradient(135deg, #f4a623, #ff7f50)",
  rose: "linear-gradient(135deg, #ff4d8d, #ffc1d8)"
};

const DIFFICULTY_DESCRIPTIONS = {
  Facile: "Mode facile : questions directes et reponses evidentes.",
  Moyen: "Mode moyen : un peu de reflexion, mais le rythme reste fluide.",
  Difficile: "Mode difficile : analyse, pieges et connaissances plus pointues."
};

const TOKEN_REWARD_BY_DIFFICULTY = {
  Facile: 1,
  Moyen: 2,
  Difficile: 5
};

const LIFELINE_CONFIG = {
  fifty: { cost: 2, label: "On enleve deux" },
  hint: { cost: 2, label: "Petit coup de pouce" },
  audience: { cost: 2, label: "On demande aux gens" },
  time: { cost: 1, label: "Donne-moi temps" }
};

const state = {
  score: 0,
  questionIndex: 0,
  timeLeft: QUESTION_TIME,
  timerId: null,
  acceptingAnswers: false,
  currentQuestions: [],
  currentQuestion: null,
  finalScorePendingSave: false,
  audioCtx: null,
  currentUser: null,
  currentStreak: 0,
  bestStreak: 0,
  lifelinesUsed: createEmptyLifelineState(),
  currentBatch: [],
  sessionQuestionIds: new Set(),
  selectedDifficulty: "Facile",
  leaderboardView: "global",
  currentRunStats: createEmptyRunStats()
};

const screens = {
  auth: document.getElementById("authScreen"),
  home: document.getElementById("homeScreen"),
  profile: document.getElementById("profileScreen"),
  transition: document.getElementById("transitionScreen"),
  game: document.getElementById("gameScreen"),
  result: document.getElementById("resultScreen"),
  end: document.getElementById("endScreen"),
  leaderboard: document.getElementById("leaderboardScreen"),
  profile: document.getElementById("profileScreen")
};

const elements = {
  authStatus: document.getElementById("authStatus"),
  loginForm: document.getElementById("loginForm"),
  registerForm: document.getElementById("registerForm"),
  loginPseudo: document.getElementById("loginPseudo"),
  loginPassword: document.getElementById("loginPassword"),
  registerPseudo: document.getElementById("registerPseudo"),
  registerRegion: document.getElementById("registerRegion"),
  registerPassword: document.getElementById("registerPassword"),
  registerConfirmPassword: document.getElementById("registerConfirmPassword"),
  homeTokensDisplay: document.getElementById("homeTokensDisplay"),
  homeBestScore: document.getElementById("homeBestScore"),
  scoreDisplay: document.getElementById("scoreDisplay"),
  tokensDisplay: document.getElementById("tokensDisplay"),
  tokenCaption: document.getElementById("tokenCaption"),
  tokenCard: document.getElementById("tokenCard"),
  timerDisplay: document.getElementById("timerDisplay"),
  timerRingValue: document.getElementById("timerRingValue"),
  timerCard: document.getElementById("timerCard"),
  timerBar: document.getElementById("timerBar"),
  levelDisplay: document.getElementById("levelDisplay"),
  questionText: document.getElementById("questionText"),
  questionHint: document.getElementById("questionHint"),
  questionIndexDisplay: document.getElementById("questionIndexDisplay"),
  nextGainDisplay: document.getElementById("nextGainDisplay"),
  answersGrid: document.getElementById("answersGrid"),
  resultPanel: document.getElementById("resultPanel"),
  resultText: document.getElementById("resultText"),
  resultDescription: document.getElementById("resultDescription"),
  finalScore: document.getElementById("finalScore"),
  resultMessage: document.getElementById("resultMessage"),
  endTokensDisplay: document.getElementById("endTokensDisplay"),
  endStreakDisplay: document.getElementById("endStreakDisplay"),
  leaderboardList: document.getElementById("leaderboardList"),
  gainsList: document.getElementById("gainsList"),
  pseudoModal: document.getElementById("pseudoModal"),
  pseudoInput: document.getElementById("pseudoInput"),
  confirmLogoutModal: document.getElementById("confirmLogoutModal"),
  infoModal: document.getElementById("infoModal"),
  infoModalTag: document.getElementById("infoModalTag"),
  infoModalTitle: document.getElementById("infoModalTitle"),
  infoModalBody: document.getElementById("infoModalBody"),
  passwordModal: document.getElementById("passwordModal"),
  currentPasswordInput: document.getElementById("currentPasswordInput"),
  newPasswordInput: document.getElementById("newPasswordInput"),
  confirmPasswordInput: document.getElementById("confirmPasswordInput"),
  passwordModalStatus: document.getElementById("passwordModalStatus"),
  toastStack: document.getElementById("toastStack"),
  gameUserName: document.getElementById("gameUserName"),
  gameProfileButton: document.getElementById("gameProfileButton"),
  profileButton: document.getElementById("profileButton"),
  playerNameText: document.getElementById("playerNameText"),
  profileScreen: document.getElementById("profileScreen"),
  closeProfileButton: document.getElementById("closeProfileButton"),
  profileAvatarDisplay: document.getElementById("profileAvatarDisplay"),
  profileAvatarFile: document.getElementById("profileAvatarFile"),
  profilePseudo: document.getElementById("profilePseudo"),
  profileJoined: document.getElementById("profileJoined"),
  profileId: document.getElementById("profileId"),
  profileGamesPlayed: document.getElementById("profileGamesPlayed"),
  profileGoodAnswers: document.getElementById("profileGoodAnswers"),
  profileWrongAnswers: document.getElementById("profileWrongAnswers"),
  profileSuccessRate: document.getElementById("profileSuccessRate"),
  profileTopCategories: document.getElementById("profileTopCategories"),
  profileBestByCategory: document.getElementById("profileBestByCategory"),
  profileRecentPerformance: document.getElementById("profileRecentPerformance"),
  profileThemeBreakdown: document.getElementById("profileThemeBreakdown"),
  profileLocalZone: document.getElementById("profileLocalZone"),
  profileGlobalRank: document.getElementById("profileGlobalRank"),
  profileLocalRank: document.getElementById("profileLocalRank"),
  profileTopRank: document.getElementById("profileTopRank"),
  profileBestScore: document.getElementById("profileBestScore"),
  profileRegionBadge: document.getElementById("profileRegionBadge"),
  profileProgressLabel: document.getElementById("profileProgressLabel"),
  profileProgressFill: document.getElementById("profileProgressFill"),
  profileThemesCount: document.getElementById("profileThemesCount"),
  profileBestStreak: document.getElementById("profileBestStreak"),
  profileFavoriteCategory: document.getElementById("profileFavoriteCategory"),
  profileSuccessRateHint: document.getElementById("profileSuccessRateHint"),
  leaderboardPosition: document.getElementById("leaderboardPosition"),
  leaderboardBestScore: document.getElementById("leaderboardBestScore"),
  leaderboardTopCategory: document.getElementById("leaderboardTopCategory"),
  leaderboardLocalZone: document.getElementById("leaderboardLocalZone"),
  leaderboardHeroTitle: document.getElementById("leaderboardHeroTitle"),
  leaderboardHeroText: document.getElementById("leaderboardHeroText"),
  leaderboardViewLabel: document.getElementById("leaderboardViewLabel"),
  leaderboardVisibleCount: document.getElementById("leaderboardVisibleCount"),
  leaderboardTopScore: document.getElementById("leaderboardTopScore"),
  leaderboardPodium: document.getElementById("leaderboardPodium"),
  leaderboardListCaption: document.getElementById("leaderboardListCaption"),
  leaderboardTabs: document.querySelectorAll(".leaderboard-tab"),
  registerAvatarFile: document.getElementById("registerAvatarFile"),
  registerAvatarPresets: document.querySelectorAll("#registerAvatarPresets .avatar-preset"),
  profileAvatarPresets: document.querySelectorAll("#profileAvatarPresets .avatar-preset"),
  lifeline5050Button: document.getElementById("lifeline5050Button"),
  lifelineHintButton: document.getElementById("lifelineHintButton"),
  lifelineAudienceButton: document.getElementById("lifelineAudienceButton"),
  lifelineTimeButton: document.getElementById("lifelineTimeButton"),
  selectedDifficultySummary: document.getElementById("selectedDifficultySummary")
};

const answerButtons = Array.from(document.querySelectorAll(".answer-btn"));
const difficultyButtons = Array.from(document.querySelectorAll(".difficulty-btn"));

document.getElementById("showLoginButton").addEventListener("click", () => switchAuthTab("login"));
document.getElementById("showRegisterButton").addEventListener("click", () => switchAuthTab("register"));
document.getElementById("startButton").addEventListener("click", startGame);
document.getElementById("leaderboardButton").addEventListener("click", showLeaderboard);
document.getElementById("restartButton").addEventListener("click", startGame);
document.getElementById("endLeaderboardButton").addEventListener("click", showLeaderboard);
document.getElementById("closeLeaderboardButton").addEventListener("click", backToHome);
document.getElementById("logoutButton").addEventListener("click", askLogoutConfirmation);
document.getElementById("gameProfileButton").addEventListener("click", showProfile);
document.getElementById("bottomLogoutButton").addEventListener("click", askLogoutConfirmation);
document.getElementById("backHomeButton").addEventListener("click", backToHome);
document.getElementById("surrenderButton").addEventListener("click", surrenderGame);
document.getElementById("confirmLogoutYesButton").addEventListener("click", logout);
document.getElementById("confirmLogoutNoButton").addEventListener("click", closeLogoutModal);
document.getElementById("savePseudoButton").addEventListener("click", savePseudo);
document.getElementById("skipPseudoButton").addEventListener("click", closePseudoModal);
document.getElementById("closeInfoModalButton").addEventListener("click", closeInfoModal);
document.getElementById("profileButton").addEventListener("click", showProfile);
document.getElementById("closeProfileButton").addEventListener("click", backToHome);
document.getElementById("profileAvatarFile").addEventListener("change", handleAvatarFileChange);
document.getElementById("registerAvatarFile").addEventListener("change", handleRegisterAvatarChange);
document.getElementById("changePasswordButton").addEventListener("click", openPasswordModal);
document.getElementById("savePasswordButton").addEventListener("click", handleSavePassword);
document.getElementById("cancelPasswordButton").addEventListener("click", closePasswordModal);
elements.loginForm.addEventListener("submit", handleLogin);
elements.registerForm.addEventListener("submit", handleRegister);
elements.pseudoInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    savePseudo();
  }
});

answerButtons.forEach((button) => {
  button.addEventListener("click", () => selectAnswer(Number(button.dataset.index)));
});

elements.lifeline5050Button.addEventListener("click", useFiftyFifty);
elements.lifelineHintButton.addEventListener("click", useHint);
elements.lifelineAudienceButton.addEventListener("click", useAudience);
elements.lifelineTimeButton.addEventListener("click", useExtraTime);
difficultyButtons.forEach((button) => {
  button.addEventListener("click", () => setSelectedDifficulty(button.dataset.difficulty));
});
elements.registerAvatarPresets.forEach((button) => {
  button.addEventListener("click", () => setAvatarPreset(button.dataset.style, "register"));
});
elements.profileAvatarPresets.forEach((button) => {
  button.addEventListener("click", () => setAvatarPreset(button.dataset.style, "profile"));
});

renderGains();
renderLeaderboard();
elements.leaderboardTabs.forEach((button) => {
  button.addEventListener("click", () => {
    elements.leaderboardTabs.forEach((tab) => tab.classList.toggle("active", tab === button));
    state.leaderboardView = button.dataset.filter || "global";
    renderLeaderboard();
  });
});
hydrateSelectedDifficulty();
hydrateSession();

function createEmptyLifelineState() {
  return {
    fifty: false,
    hint: false,
    audience: false,
    time: false
  };
}

function createEmptyProfileStats() {
  return {
    gamesPlayed: 0,
    goodAnswers: 0,
    wrongAnswers: 0,
    totalAnswers: 0,
    successRate: 0,
    bestStreak: 0,
    categoriesPlayed: {},
    categoryStats: {},
    bestScoreByCategory: {},
    recentPerformance: []
  };
}

function createEmptyRunStats() {
  return {
    correct: 0,
    wrong: 0,
    categoryHits: {}
  };
}

function readImageFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

function handleRegisterAvatarChange(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) {
    return;
  }
  readImageFile(file).then((value) => {
    if (value) {
      event.target.dataset.preview = value;
    }
  });
}

function normalizeAvatarStyle(style) {
  return AVATAR_STYLE_MAP[style] ? style : AVATAR_STYLE_FALLBACK;
}

function setAvatarPreset(style, scope) {
  const safeStyle = normalizeAvatarStyle(style);
  const collection = scope === "profile" ? elements.profileAvatarPresets : elements.registerAvatarPresets;
  collection.forEach((button) => button.classList.toggle("active", button.dataset.style === safeStyle));

  if (scope === "profile" && state.currentUser) {
    state.currentUser.avatar = null;
    state.currentUser.avatarStyle = safeStyle;
    persistCurrentUser();
    syncCurrentUserUI();
    renderProfile();
    showToast("Avatar personnalisÃ© mis Ã  jour.");
  }
}

function getSelectedRegisterAvatarStyle() {
  const active = Array.from(elements.registerAvatarPresets).find((button) => button.classList.contains("active"));
  return normalizeAvatarStyle(active ? active.dataset.style : AVATAR_STYLE_FALLBACK);
}

function applyAvatarToElement(node, user, fallbackText = "J") {
  if (!node || !user) {
    return;
  }

  const initial = (user.pseudo || fallbackText).slice(0, 1).toUpperCase();
  node.style.backgroundSize = "cover";
  node.style.backgroundPosition = "center";
  if (user.avatar) {
    node.textContent = "";
    node.style.backgroundImage = `url('${user.avatar}')`;
    return;
  }

  node.textContent = initial;
  node.style.backgroundImage = AVATAR_STYLE_MAP[normalizeAvatarStyle(user.avatarStyle)];
}

function syncAvatarPresetSelection(style, scope) {
  const safeStyle = normalizeAvatarStyle(style);
  const collection = scope === "profile" ? elements.profileAvatarPresets : elements.registerAvatarPresets;
  collection.forEach((button) => button.classList.toggle("active", button.dataset.style === safeStyle));
}

function handleAvatarFileChange(event) {
  const file = event.target.files && event.target.files[0];
  if (!file || !state.currentUser) {
    return;
  }
  readImageFile(file).then((dataUrl) => {
    if (!dataUrl) {
      showToast("Impossible de charger l'image.");
      return;
    }
    state.currentUser.avatar = dataUrl;
    state.currentUser.avatarStyle = normalizeAvatarStyle(state.currentUser.avatarStyle);
    persistCurrentUser();
    syncCurrentUserUI();
    renderProfile();
    showToast("Avatar mis à jour.");
  });
}

function openPasswordModal() {
  if (!state.currentUser) {
    return;
  }
  elements.passwordModal.classList.remove("hidden");
  elements.passwordModal.setAttribute("aria-hidden", "false");
  elements.passwordModalStatus.textContent = "";
  elements.currentPasswordInput.value = "";
  elements.newPasswordInput.value = "";
  elements.confirmPasswordInput.value = "";
}

function closePasswordModal() {
  elements.passwordModal.classList.add("hidden");
  elements.passwordModal.setAttribute("aria-hidden", "true");
  elements.passwordModalStatus.textContent = "";
}

async function handleSavePassword() {
  if (!state.currentUser) {
    return;
  }
  const currentPassword = elements.currentPasswordInput.value;
  const newPassword = elements.newPasswordInput.value;
  const confirmPassword = elements.confirmPasswordInput.value;

  if (!currentPassword || !newPassword || !confirmPassword) {
    elements.passwordModalStatus.textContent = "Remplis tous les champs.";
    elements.passwordModalStatus.className = "status-message error";
    return;
  }

  if (newPassword.length < 4) {
    elements.passwordModalStatus.textContent = "Le nouveau mot de passe doit contenir au moins 4 caractères.";
    elements.passwordModalStatus.className = "status-message error";
    return;
  }

  if (newPassword !== confirmPassword) {
    elements.passwordModalStatus.textContent = "Les mots de passe ne correspondent pas.";
    elements.passwordModalStatus.className = "status-message error";
    return;
  }

  const currentHash = await hashPassword(currentPassword);
  if (currentHash !== state.currentUser.passwordHash) {
    elements.passwordModalStatus.textContent = "Mot de passe actuel incorrect.";
    elements.passwordModalStatus.className = "status-message error";
    return;
  }

  state.currentUser.passwordHash = await hashPassword(newPassword);
  persistCurrentUser();
  elements.passwordModalStatus.textContent = "Mot de passe modifié avec succès.";
  elements.passwordModalStatus.className = "status-message success";
  window.setTimeout(() => closePasswordModal(), 1200);
}

function showProfile() {
  if (!requireAuth()) {
    return;
  }
  closeLogoutModal();
  closePseudoModal();
  closeInfoModal();
  renderProfile();
  showScreen("profile");
}

function renderProfile() {
  if (!state.currentUser) {
    return;
  }
  const user = state.currentUser;
  const stats = user.stats || createEmptyProfileStats();
  elements.profilePseudo.textContent = user.pseudo;
  elements.profileJoined.textContent = `Inscrit le ${new Date(user.createdAt).toLocaleDateString("fr-FR")}`;
  elements.profileId.textContent = `ID : ${user.id}`;
  elements.profileGamesPlayed.textContent = stats.gamesPlayed;
  elements.profileGoodAnswers.textContent = stats.goodAnswers;
  elements.profileWrongAnswers.textContent = stats.wrongAnswers;
  elements.profileSuccessRate.textContent = `${stats.successRate || 0} %`;
  const rankings = computeLeaderboardRanks(user);
  const topCategory = Object.entries(stats.categoriesPlayed || {}).sort((a, b) => b[1] - a[1])[0];
  const recentAverage = stats.recentPerformance && stats.recentPerformance.length
    ? Math.round(stats.recentPerformance.reduce((sum, item) => sum + (item.accuracy || 0), 0) / stats.recentPerformance.length)
    : 0;
  if (elements.profileLocalZone) {
    elements.profileLocalZone.textContent = `Zone locale : ${user.region || "Non renseignÃ©e"}`;
  }
  if (elements.profileGlobalRank) {
    elements.profileGlobalRank.textContent = rankings.global ? `#${rankings.global}` : "#--";
  }
  if (elements.profileLocalRank) {
    elements.profileLocalRank.textContent = rankings.local ? `#${rankings.local}` : "#--";
  }
  if (elements.profileTopRank) {
    elements.profileTopRank.textContent = rankings.top ? `#${rankings.top}` : "#--";
  }
  if (elements.profileBestScore) {
    elements.profileBestScore.textContent = `${formatFCFA(user.bestScore || 0)} FCFA`;
  }
  if (elements.profileRegionBadge) {
    elements.profileRegionBadge.textContent = `Ville : ${user.region || "Non renseignÃ©e"}`;
  }
  if (elements.profileProgressLabel) {
    elements.profileProgressLabel.textContent = `${recentAverage} % de rÃ©ussite`;
  }
  if (elements.profileProgressFill) {
    elements.profileProgressFill.style.width = `${recentAverage}%`;
  }
  if (elements.profileThemesCount) {
    elements.profileThemesCount.textContent = Object.keys(stats.categoriesPlayed || {}).length;
  }
  if (elements.profileBestStreak) {
    elements.profileBestStreak.textContent = stats.bestStreak || 0;
  }
  if (elements.profileFavoriteCategory) {
    elements.profileFavoriteCategory.textContent = topCategory ? topCategory[0] : "Aucune";
  }
  if (elements.profileSuccessRateHint) {
    elements.profileSuccessRateHint.textContent = `${stats.totalAnswers || 0} rÃ©ponses analysÃ©es`;
  }

  applyAvatarToElement(elements.profileAvatarDisplay, user);
  syncAvatarPresetSelection(user.avatarStyle, "profile");

  const sortedCategories = Object.entries(stats.categoriesPlayed || {}).sort((a, b) => b[1] - a[1]).slice(0, 5);
  elements.profileTopCategories.innerHTML = sortedCategories.length
    ? sortedCategories.map(([category]) => `<span>${escapeHtml(category)}</span>`).join("")
    : "<span>Aucune catégorie encore</span>";

  const bestByCategory = Object.entries(stats.bestScoreByCategory || {}).sort((a, b) => b[1] - a[1]).slice(0, 6);
  elements.profileBestByCategory.innerHTML = bestByCategory.length
    ? bestByCategory.map(([category, value]) => `<li><span>${escapeHtml(category)}</span><strong>${formatFCFA(value)} FCFA</strong></li>`).join("")
    : "<li>Aucun score enregistré.</li>";

  const recent = stats.recentPerformance || [];
  elements.profileRecentPerformance.innerHTML = recent.length
    ? recent.map((item) => `<li><span>${new Date(item.date).toLocaleDateString("fr-FR")} <em>${escapeHtml(item.difficulty || "Normal")} · ${item.accuracy || 0}%</em></span><strong>${formatFCFA(item.score)} FCFA</strong></li>`).join("")
    : "<li>Aucune performance récente.</li>";
  if (elements.profileThemeBreakdown) {
    const themeRows = Object.entries(stats.categoryStats || {})
      .sort(([, left], [, right]) => (right.played || 0) - (left.played || 0))
      .slice(0, 6);
    elements.profileThemeBreakdown.innerHTML = themeRows.length
      ? themeRows.map(([category, value]) => `<li><span>${escapeHtml(category)} <em>${value.correct || 0} bonnes / ${value.wrong || 0} erreurs</em></span><strong>${formatFCFA(value.bestScore || 0)} FCFA</strong></li>`).join("")
      : "<li>Aucun thÃ¨me jouÃ© pour le moment.</li>";
  }
}

function updateUserStatsOnAnswer(isCorrect) {
  if (!state.currentUser || !state.currentQuestion) {
    return;
  }
  const stats = state.currentUser.stats || createEmptyProfileStats();
  stats.totalAnswers += 1;
  if (isCorrect) {
    stats.goodAnswers += 1;
    state.currentRunStats.correct += 1;
  } else {
    stats.wrongAnswers += 1;
    state.currentRunStats.wrong += 1;
  }
  const category = state.currentQuestion.category || "Culture générale";
  stats.categoriesPlayed[category] = (stats.categoriesPlayed[category] || 0) + 1;
  stats.categoryStats[category] = stats.categoryStats[category] || { played: 0, correct: 0, wrong: 0, bestScore: 0 };
  stats.categoryStats[category].played += 1;
  state.currentRunStats.categoryHits[category] = (state.currentRunStats.categoryHits[category] || 0) + 1;
  if (isCorrect) {
    stats.bestScoreByCategory[category] = Math.max(stats.bestScoreByCategory[category] || 0, state.score);
    stats.categoryStats[category].correct += 1;
    stats.categoryStats[category].bestScore = Math.max(stats.categoryStats[category].bestScore || 0, state.score);
  } else {
    stats.categoryStats[category].wrong += 1;
  }
  stats.successRate = stats.totalAnswers > 0 ? Math.round((stats.goodAnswers / stats.totalAnswers) * 100) : 0;
  stats.bestStreak = Math.max(stats.bestStreak || 0, state.bestStreak || 0);
  state.currentUser.stats = stats;
  persistCurrentUser();
}

function updateCurrentUserAfterGame() {
  if (!state.currentUser) {
    return;
  }
  const stats = state.currentUser.stats || createEmptyProfileStats();
  stats.gamesPlayed += 1;
  const totalRunAnswers = state.currentRunStats.correct + state.currentRunStats.wrong;
  const accuracy = totalRunAnswers > 0 ? Math.round((state.currentRunStats.correct / totalRunAnswers) * 100) : 0;
  stats.bestStreak = Math.max(stats.bestStreak || 0, state.bestStreak || 0);
  stats.recentPerformance.unshift({
    date: new Date().toISOString(),
    score: state.score,
    difficulty: state.selectedDifficulty,
    accuracy,
    correct: state.currentRunStats.correct,
    wrong: state.currentRunStats.wrong
  });
  stats.recentPerformance = stats.recentPerformance.slice(0, 5);
  stats.successRate = stats.totalAnswers > 0 ? Math.round((stats.goodAnswers / stats.totalAnswers) * 100) : 0;
  state.currentUser.stats = stats;
  persistCurrentUser();
}

function updateLeaderboardSummary(entries) {
  if (!state.currentUser || !entries) {
    return;
  }
  const current = state.currentUser;
  const topCategory = Object.entries((current.stats && current.stats.categoriesPlayed) || {})
    .sort((a, b) => b[1] - a[1])[0];
  elements.leaderboardBestScore.textContent = `${formatFCFA(current.bestScore || 0)} FCFA`;
  elements.leaderboardTopCategory.textContent = topCategory ? escapeHtml(topCategory[0]) : "Aucune catégorie";

  const rankings = computeLeaderboardRanks(current);
  elements.leaderboardPosition.textContent = rankings.active ? `#${rankings.active}` : "--";
  if (elements.leaderboardLocalZone) {
    elements.leaderboardLocalZone.textContent = current.region || "Non dÃ©finie";
  }
}

function computeLeaderboardRanks(user) {
  if (!user) {
    return { global: 0, local: 0, active: 0, top: 0 };
  }

  const entries = getLeaderboard();
  const global = entries.findIndex((entry) => entry.owner === user.pseudo && entry.score === user.bestScore) + 1;
  const localEntries = entries.filter((entry) => (entry.region || "") === (user.region || ""));
  const local = localEntries.findIndex((entry) => entry.owner === user.pseudo && entry.score === user.bestScore) + 1;
  const active = state.leaderboardView === "local" ? local : global;
  const ranks = [global, local].filter(Boolean);
  return {
    global,
    local,
    active,
    top: ranks.length ? Math.min(...ranks) : 0
  };
}

function requireAuth() {
  if (!state.currentUser) {
    showScreen("auth");
    return false;
  }
  return true;
}

function switchAuthTab(tab) {
  document.getElementById("showLoginButton").classList.toggle("active", tab === "login");
  document.getElementById("showRegisterButton").classList.toggle("active", tab === "register");
  elements.loginForm.classList.toggle("hidden-panel", tab !== "login");
  elements.registerForm.classList.toggle("hidden-panel", tab !== "register");
  setAuthStatus("");
}

async function handleRegister(event) {
  event.preventDefault();

  const pseudo = sanitizePseudo(elements.registerPseudo.value);
  const region = sanitizeRegion(elements.registerRegion ? elements.registerRegion.value : "");
  const password = elements.registerPassword.value;
  const confirm = elements.registerConfirmPassword.value;

  if (!pseudo || pseudo.length < 3) {
    setAuthStatus("Le pseudo doit contenir au moins 3 caracteres.", "error");
    return;
  }

  if (password.length < 4) {
    setAuthStatus("Le mot de passe doit contenir au moins 4 caracteres.", "error");
    return;
  }

  if (password !== confirm) {
    setAuthStatus("Les mots de passe ne correspondent pas.", "error");
    return;
  }

  const users = getUsers();
  const alreadyExists = users.some((user) => user.pseudo.toLowerCase() === pseudo.toLowerCase());
  if (alreadyExists) {
    setAuthStatus("Ce pseudo existe deja. Choisis-en un autre.", "error");
    return;
  }

  const passwordHash = await hashPassword(password);
  const newUser = {
    id: createId(),
    pseudo,
    passwordHash,
    createdAt: new Date().toISOString(),
    tokens: 2,
    bestScore: 0,
    region: "Côte d'Ivoire",
    avatar: null,
    avatarStyle: getSelectedRegisterAvatarStyle(),
    stats: createEmptyProfileStats()
  };
  if (region) {
    newUser.region = region;
  }

  if (elements.registerAvatarFile && elements.registerAvatarFile.files.length > 0) {
    newUser.avatar = await readImageFile(elements.registerAvatarFile.files[0]);
  }

  users.push(newUser);
  saveUsers(users);
  createSession(newUser);
  elements.registerForm.reset();
  syncAvatarPresetSelection(AVATAR_STYLE_FALLBACK, "register");
  setAuthStatus("Compte cree avec 2 jetons de bienvenue. Tu es connecte.", "success");
  enterAuthenticatedArea();
}

async function handleLogin(event) {
  event.preventDefault();

  const pseudo = sanitizePseudo(elements.loginPseudo.value);
  const password = elements.loginPassword.value;
  const users = getUsers();
  const user = users.find((entry) => entry.pseudo.toLowerCase() === pseudo.toLowerCase());

  if (!user) {
    setAuthStatus("Pseudo introuvable.", "error");
    return;
  }

  const passwordHash = await hashPassword(password);
  if (user.passwordHash !== passwordHash) {
    setAuthStatus("Mot de passe incorrect.", "error");
    return;
  }

  createSession(user);
  elements.loginForm.reset();
  setAuthStatus("Connexion reussie.", "success");
  enterAuthenticatedArea();
}

function hydrateSession() {
  const session = getSession();
  if (!session) {
    showScreen("auth");
    switchAuthTab("login");
    return;
  }

  const users = getUsers();
  const user = users.find((entry) => entry.id === session.userId);
  if (!user || session.token !== buildSessionToken(user)) {
    clearSession();
    showScreen("auth");
    return;
  }

  state.currentUser = user;
  enterAuthenticatedArea();
}

function enterAuthenticatedArea() {
  if (!state.currentUser) {
    const session = getSession();
    if (!session) {
      showScreen("auth");
      return;
    }
    state.currentUser = getUsers().find((entry) => entry.id === session.userId) || null;
  }

  if (!state.currentUser) {
    showScreen("auth");
    return;
  }

  closeLogoutModal();
  closePseudoModal();
  closeInfoModal();
  setAuthStatus("");
  syncCurrentUserUI();
  renderDifficultySelection();
  renderLeaderboard();
  updateHud();
  showScreen("home");
}

function syncCurrentUserUI() {
  if (!state.currentUser) {
    return;
  }
  applyAvatarToElement(elements.profileAvatarDisplay, state.currentUser);
  applyAvatarToElement(elements.gameUserAvatar, state.currentUser);
  syncAvatarPresetSelection(state.currentUser.avatarStyle, "profile");
  elements.playerNameText.textContent = state.currentUser.pseudo;
  elements.gameUserName.textContent = state.currentUser.pseudo;
  elements.homeTokensDisplay.textContent = `${state.currentUser.tokens}`;
  elements.homeBestScore.textContent = `${formatFCFA(state.currentUser.bestScore || 0)} FCFA`;
}

function hydrateSelectedDifficulty() {
  const storedDifficulty = localStorage.getItem(DIFFICULTY_KEY);
  if (DIFFICULTY_DESCRIPTIONS[storedDifficulty]) {
    state.selectedDifficulty = storedDifficulty;
  }
  renderDifficultySelection();
}

function setSelectedDifficulty(difficulty) {
  if (!DIFFICULTY_DESCRIPTIONS[difficulty]) {
    return;
  }

  state.selectedDifficulty = difficulty;
  localStorage.setItem(DIFFICULTY_KEY, difficulty);
  renderDifficultySelection();
}

function renderDifficultySelection() {
  difficultyButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.difficulty === state.selectedDifficulty);
  });

  if (elements.selectedDifficultySummary) {
    elements.selectedDifficultySummary.textContent = DIFFICULTY_DESCRIPTIONS[state.selectedDifficulty] || "";
  }
}

function askLogoutConfirmation() {
  elements.confirmLogoutModal.classList.remove("hidden");
  elements.confirmLogoutModal.setAttribute("aria-hidden", "false");
}

function closeLogoutModal() {
  elements.confirmLogoutModal.classList.add("hidden");
  elements.confirmLogoutModal.setAttribute("aria-hidden", "true");
}

function logout() {
  clearTimer();
  closePseudoModal();
  closeLogoutModal();
  closeInfoModal();
  clearSession();
  state.currentUser = null;
  state.acceptingAnswers = false;
  state.currentQuestion = null;
  state.currentQuestions = [];
  state.questionIndex = 0;
  state.score = 0;
  state.timeLeft = QUESTION_TIME;
  state.currentStreak = 0;
  state.bestStreak = 0;
  state.currentRunStats = createEmptyRunStats();
  state.lifelinesUsed = createEmptyLifelineState();
  updateHud();
  showScreen("auth");
  switchAuthTab("login");
  setAuthStatus("Tu as ete deconnecte.", "success");
}

function startGame() {
  if (!requireAuth()) {
    return;
  }

  enableAudio();
  closePseudoModal();
  closeInfoModal();
  clearTimer();
  state.score = 0;
  state.questionIndex = 0;
  state.timeLeft = QUESTION_TIME;
  state.currentStreak = 0;
  state.bestStreak = 0;
  state.finalScorePendingSave = false;
  state.lifelinesUsed = createEmptyLifelineState();
  state.currentBatch = [];
  state.sessionQuestionIds = new Set();
  state.currentRunStats = createEmptyRunStats();
  state.currentQuestions = buildQuestionRun(state.selectedDifficulty);
  updateLifelineButtons();
  updateHud();
  showScreen("transition");
  playSuspenseTone();

  window.setTimeout(() => {
    showScreen("game");
    loadQuestion();
  }, 1800);
}

function buildQuestionRun(targetDifficulty) {
  const run = [];

  for (let index = 0; index < QUESTIONS_PER_RUN; index += 1) {
    const selected = takeQuestionFromBatch(targetDifficulty, run);
    if (selected) {
      run.push(selected);
    }
  }

  saveQuestionHistory(run.map((item) => item.id));
  return run;
}

function takeQuestionFromBatch(difficulty, currentRun) {
  if (!state.currentBatch.length) {
    state.currentBatch = buildQuestionBatch(difficulty, currentRun);
  }

  let batchIndex = state.currentBatch.findIndex((item) => isQuestionEligible(item, difficulty, currentRun));
  if (batchIndex === -1) {
    state.currentBatch = buildQuestionBatch(difficulty, currentRun);
    batchIndex = state.currentBatch.findIndex((item) => isQuestionEligible(item, difficulty, currentRun));
  }

  const selected = batchIndex >= 0 ? state.currentBatch.splice(batchIndex, 1)[0] : null;
  if (selected) {
    state.sessionQuestionIds.add(selected.id);
    touchQuestionStats(selected.id);
  }
  return selected;
}

function buildQuestionBatch(targetDifficulty, currentRun = []) {
  const history = getQuestionHistory();
  const stats = getQuestionStats();
  const recentCategories = currentRun.slice(-RECENT_CATEGORY_WINDOW).map((item) => item.category);

  let candidates = QUESTION_BANK.filter((item) => {
    return !state.sessionQuestionIds.has(item.id)
      && !history.includes(item.id)
      && item.difficulty === targetDifficulty
      && !recentCategories.includes(item.category);
  });

  if (!candidates.length) {
    candidates = QUESTION_BANK.filter((item) => {
      return !state.sessionQuestionIds.has(item.id)
        && item.difficulty === targetDifficulty
        && !recentCategories.includes(item.category);
    });
  }

  if (!candidates.length) {
    candidates = QUESTION_BANK.filter((item) => {
      return !state.sessionQuestionIds.has(item.id)
        && item.difficulty === targetDifficulty;
    });
  }

  if (!candidates.length) {
    candidates = QUESTION_BANK.filter((item) => !state.sessionQuestionIds.has(item.id));
  }

  if (!candidates.length) {
    state.sessionQuestionIds = new Set();
    resetQuestionHistory();
    candidates = [...QUESTION_BANK];
  }

  return candidates
    .slice()
    .sort((left, right) => scoreQuestionCandidate(left, targetDifficulty, currentRun, history, stats) - scoreQuestionCandidate(right, targetDifficulty, currentRun, history, stats))
    .slice(0, QUESTION_BATCH_SIZE);
}

function isQuestionEligible(question, targetDifficulty, currentRun = []) {
  if (!question || state.sessionQuestionIds.has(question.id)) {
    return false;
  }

  const recentCategories = currentRun.slice(-RECENT_CATEGORY_WINDOW).map((item) => item.category);
  if (recentCategories.includes(question.category)) {
    return false;
  }

  return !targetDifficulty || question.difficulty === targetDifficulty || QUESTION_BANK.length < QUESTION_BATCH_SIZE;
}

function scoreQuestionCandidate(question, targetDifficulty, currentRun, history, stats) {
  const questionStats = stats[question.id] || {};
  const timesSeen = questionStats.seenCount || 0;
  const lastSeenAt = questionStats.lastSeenAt ? new Date(questionStats.lastSeenAt).getTime() : 0;
  const now = Date.now();
  const recentCategories = currentRun.slice(-RECENT_CATEGORY_WINDOW).map((item) => item.category);
  const recencyPenalty = lastSeenAt ? Math.max(0, 100000000 - (now - lastSeenAt)) / 1000000 : 0;
  const historyPenalty = history.includes(question.id) ? 120 : 0;
  const categoryPenalty = recentCategories.includes(question.category) ? 30 : 0;
  const difficultyPenalty = question.difficulty !== targetDifficulty ? 10 : 0;
  const randomness = Math.random();

  return timesSeen * 20 + recencyPenalty + historyPenalty + categoryPenalty + difficultyPenalty + randomness;
}

function loadQuestion() {
  const question = state.currentQuestions[state.questionIndex];
  if (!question) {
    finishGame(true);
    return;
  }

  state.currentQuestion = question;
  state.timeLeft = QUESTION_TIME;
  state.acceptingAnswers = true;

  elements.questionText.textContent = question.question;
  elements.questionHint.textContent = question.hint;
  elements.levelDisplay.textContent = question.difficulty;
  elements.questionIndexDisplay.textContent = `${state.questionIndex + 1} / ${state.currentQuestions.length}`;
  elements.nextGainDisplay.textContent = `${formatFCFA(GAINS[state.questionIndex] || 0)} FCFA`;
  elements.timerCard.classList.remove("warning", "danger");
  elements.tokenCaption.textContent = "Fais vite oh !";

  answerButtons.forEach((button, index) => {
    button.disabled = false;
    button.classList.remove("selected", "correct", "wrong", "eliminated");
    button.querySelector(".answer-label").textContent = question.answers[index];
  });

  updateHud();
  updateGainsHighlight();
  updateLifelineButtons();
  startTimer();
}

function startTimer() {
  clearTimer();
  updateTimerVisual();

  state.timerId = window.setInterval(() => {
    state.timeLeft -= 1;
    updateTimerVisual();

    if (state.timeLeft <= 12) {
      elements.timerCard.classList.add("warning");
      elements.questionHint.textContent = "Fais vite oh ! Le temps chauffe.";
      playTickTone();
    }

    if (state.timeLeft <= 5) {
      elements.timerCard.classList.add("danger");
    }

    if (state.timeLeft <= 0) {
      clearTimer();
      handleAnswerResult(-1);
    }
  }, 1000);
}

function updateTimerVisual() {
  elements.timerDisplay.textContent = formatTime(state.timeLeft);
  elements.timerRingValue.textContent = String(Math.max(state.timeLeft, 0));
  const ratio = Math.max(state.timeLeft, 0) / QUESTION_TIME;
  elements.timerBar.style.transform = `scaleX(${ratio})`;
}

function clearTimer() {
  if (state.timerId) {
    window.clearInterval(state.timerId);
    state.timerId = null;
  }
}

function selectAnswer(index) {
  if (!state.acceptingAnswers) {
    return;
  }

  const targetButton = answerButtons[index];
  if (targetButton.classList.contains("eliminated")) {
    return;
  }

  enableAudio();
  answerButtons.forEach((button) => {
    if (!button.classList.contains("eliminated")) {
      button.disabled = true;
    }
  });
  targetButton.classList.add("selected");
  handleAnswerResult(index);
}

function handleAnswerResult(selectedIndex) {
  if (!state.acceptingAnswers) {
    return;
  }

  state.acceptingAnswers = false;
  clearTimer();

  const correctIndex = state.currentQuestion.correctIndex;
  const isCorrect = selectedIndex === correctIndex;

  answerButtons.forEach((button) => {
    button.disabled = true;
  });

  if (selectedIndex >= 0) {
    answerButtons[selectedIndex].classList.add("selected");
  }

  window.setTimeout(() => {
    answerButtons[correctIndex].classList.add("correct");

    if (!isCorrect && selectedIndex >= 0 && selectedIndex !== correctIndex) {
      answerButtons[selectedIndex].classList.add("wrong");
      shakeGameScreen();
    }

    if (!isCorrect && selectedIndex === -1) {
      shakeGameScreen();
    }

    if (isCorrect) {
      applyCorrectAnswerRewards();
      playSuccessTone();
    } else {
      state.currentStreak = 0;
      elements.tokenCaption.textContent = "On reprend encore.";
      playFailureTone();
    }

    updateUserStatsOnAnswer(isCorrect);

    window.setTimeout(() => {
      showResult(isCorrect, selectedIndex === -1);
    }, 1000);
  }, 650);
}

function applyCorrectAnswerRewards() {
  const question = state.currentQuestion;
  const gainValue = GAINS[state.questionIndex] || 0;
  const baseTokens = TOKEN_REWARD_BY_DIFFICULTY[question.difficulty] || 5;
  let bonusTokens = 0;

  state.score += gainValue;
  state.currentStreak += 1;
  state.bestStreak = Math.max(state.bestStreak, state.currentStreak);

  if (state.currentStreak === 3) {
    bonusTokens += 2;
  }

  if (state.currentStreak === 5) {
    bonusTokens += 5;
  }

  addTokens(baseTokens + bonusTokens, {
    message: bonusTokens > 0 ? `Bonus ! +${baseTokens + bonusTokens} jetons` : `+${baseTokens} jetons !`,
    caption: bonusTokens > 0 ? "Bien joue ! Serie en feu." : "Bien joue ! 🔥"
  });

  updateHud();
}

function addTokens(amount, options = {}) {
  if (!state.currentUser || amount <= 0) {
    return;
  }

  state.currentUser.tokens = (state.currentUser.tokens || 0) + amount;
  persistCurrentUser();
  elements.tokenCard.classList.remove("gain-flash");
  void elements.tokenCard.offsetWidth;
  elements.tokenCard.classList.add("gain-flash");
  elements.tokenCaption.textContent = options.caption || "Jetons ajoutes.";
  showToast(options.message || `+${amount} jetons !`);
  playTokenTone();
  updateHud();
}

function spendTokens(amount, reason) {
  if (!state.currentUser || state.currentUser.tokens < amount) {
    showToast("Jetons insuffisants pour cet avantage.");
    playFailureTone();
    return false;
  }

  state.currentUser.tokens -= amount;
  persistCurrentUser();
  elements.tokenCaption.textContent = `-${amount} jeton${amount > 1 ? "s" : ""} pour ${reason}.`;
  updateHud();
  return true;
}

function useFiftyFifty() {
  if (!canUseLifeline("fifty")) {
    return;
  }
  if (!spendTokens(LIFELINE_CONFIG.fifty.cost, LIFELINE_CONFIG.fifty.label)) {
    return;
  }

  state.lifelinesUsed.fifty = true;
  const wrongIndexes = answerButtons
    .map((button, index) => ({ button, index }))
    .filter(({ index }) => index !== state.currentQuestion.correctIndex && !answerButtons[index].classList.contains("eliminated"))
    .sort(() => Math.random() - 0.5)
    .slice(0, 2);

  wrongIndexes.forEach(({ button }) => {
    button.classList.add("eliminated");
    button.disabled = true;
  });

  updateLifelineButtons();
  showToast("On va t'aider un peu 😄 Deux reponses en moins.");
  playLifelineTone();
}

function useHint() {
  if (!canUseLifeline("hint")) {
    return;
  }
  if (!spendTokens(LIFELINE_CONFIG.hint.cost, LIFELINE_CONFIG.hint.label)) {
    return;
  }

  state.lifelinesUsed.hint = true;
  updateLifelineButtons();
  playLifelineTone();
  openInfoModal("Indice", "Petit coup de pouce", `<p>${escapeHtml(state.currentQuestion.hint)}</p><p class="modal-copy">Reste calme, la bonne piste est la.</p>`);
}

function useAudience() {
  if (!canUseLifeline("audience")) {
    return;
  }
  if (!spendTokens(LIFELINE_CONFIG.audience.cost, LIFELINE_CONFIG.audience.label)) {
    return;
  }

  state.lifelinesUsed.audience = true;
  updateLifelineButtons();
  playLifelineTone();

  const percentages = buildAudienceVotes();
  const rows = percentages.map((value, index) => `
    <div class="audience-row">
      <div class="audience-line">
        <span>${String.fromCharCode(65 + index)} - ${escapeHtml(state.currentQuestion.answers[index])}</span>
        <strong>${value}%</strong>
      </div>
      <div class="audience-track">
        <div class="audience-fill" data-width="${value}"></div>
      </div>
    </div>
  `).join("");

  openInfoModal("Le public", "On demande aux gens", `<p class="modal-copy">Au maquis, les gens ont vote. Vois un peu ce que la salle pense.</p>${rows}`);

  window.setTimeout(() => {
    elements.infoModalBody.querySelectorAll(".audience-fill").forEach((fill) => {
      fill.style.width = `${fill.dataset.width}%`;
    });
  }, 60);
}

function useExtraTime() {
  if (!canUseLifeline("time")) {
    return;
  }
  if (!spendTokens(LIFELINE_CONFIG.time.cost, LIFELINE_CONFIG.time.label)) {
    return;
  }

  state.lifelinesUsed.time = true;
  state.timeLeft = Math.min(QUESTION_TIME, state.timeLeft + 15);
  elements.timerCard.classList.remove("warning", "danger");
  elements.questionHint.textContent = "Tu as repris un peu de souffle.";
  updateTimerVisual();
  updateLifelineButtons();
  showToast("+15 secondes. Respire et vise juste.");
  playLifelineTone(620);
}

function canUseLifeline(type) {
  if (!state.acceptingAnswers || !state.currentQuestion) {
    return false;
  }

  if (state.lifelinesUsed[type]) {
    showToast("Cet avantage a deja ete utilise dans cette partie.");
    return false;
  }

  return true;
}

function buildAudienceVotes() {
  const correctIndex = state.currentQuestion.correctIndex;
  const baseCorrect = 52 + Math.floor(Math.random() * 22);
  let remaining = 100 - baseCorrect;
  const values = [0, 0, 0, 0];
  values[correctIndex] = baseCorrect;

  const wrongIndexes = [0, 1, 2, 3].filter((index) => index !== correctIndex);
  wrongIndexes.forEach((index, position) => {
    if (position === wrongIndexes.length - 1) {
      values[index] = remaining;
    } else {
      const share = 6 + Math.floor(Math.random() * Math.max(remaining - (wrongIndexes.length - position - 1) * 6, 1));
      values[index] = share;
      remaining -= share;
    }
  });

  return values;
}

function updateLifelineButtons() {
  const wallet = state.currentUser ? state.currentUser.tokens : 0;
  const disabledBecauseLocked = !state.acceptingAnswers;

  setLifelineState(elements.lifeline5050Button, state.lifelinesUsed.fifty, wallet < LIFELINE_CONFIG.fifty.cost || disabledBecauseLocked);
  setLifelineState(elements.lifelineHintButton, state.lifelinesUsed.hint, wallet < LIFELINE_CONFIG.hint.cost || disabledBecauseLocked);
  setLifelineState(elements.lifelineAudienceButton, state.lifelinesUsed.audience, wallet < LIFELINE_CONFIG.audience.cost || disabledBecauseLocked);
  setLifelineState(elements.lifelineTimeButton, state.lifelinesUsed.time, wallet < LIFELINE_CONFIG.time.cost || disabledBecauseLocked);
}

function setLifelineState(button, used, disabled) {
  button.disabled = used || disabled;
}

function showResult(isCorrect, timedOut) {
  showScreen("result");
  elements.resultPanel.classList.toggle("good", isCorrect);
  elements.resultPanel.classList.toggle("bad", !isCorrect);
  elements.resultText.textContent = isCorrect ? "Bonne reponse !" : (timedOut ? "Temps ecoule !" : "Mauvaise reponse");
  elements.resultDescription.textContent = isCorrect
    ? `Tu avances avec ${formatFCFA(state.score)} FCFA.`
    : `La bonne reponse etait "${state.currentQuestion.answers[state.currentQuestion.correctIndex]}".`;

  window.setTimeout(() => {
    if (isCorrect) {
      state.questionIndex += 1;
      if (state.questionIndex >= state.currentQuestions.length) {
        finishGame(true);
      } else {
        showScreen("game");
        loadQuestion();
      }
    } else {
      finishGame(false);
    }
  }, 1700);
}

function finishGame(completed) {
  clearTimer();
  state.finalScorePendingSave = state.score > 0;

  if (state.currentUser) {
    state.currentUser.bestScore = Math.max(state.currentUser.bestScore || 0, state.score);
    updateCurrentUserAfterGame();
  }

  elements.finalScore.textContent = `${formatFCFA(state.score)} FCFA`;
  elements.endTokensDisplay.textContent = `${state.currentUser ? state.currentUser.tokens : 0} jetons`;
  elements.endStreakDisplay.textContent = `${state.bestStreak}`;
  elements.resultMessage.textContent = completed ? getVictoryMessage(state.score) : getFailureMessage(state.score);
  showScreen("end");

  if (state.score > 0) {
    window.setTimeout(openPseudoModal, 500);
  }
}

function requireAuth() {
  if (state.currentUser) {
    return true;
  }

  const session = getSession();
  if (!session) {
    showScreen("auth");
    setAuthStatus("Connecte-toi pour entrer dans LAKOTA.", "error");
    return false;
  }

  hydrateSession();
  return Boolean(state.currentUser);
}

function updateHud() {
  elements.scoreDisplay.textContent = `${formatFCFA(state.score)} FCFA`;
  elements.levelDisplay.textContent = state.currentQuestion ? state.currentQuestion.difficulty : state.selectedDifficulty;
  elements.tokensDisplay.textContent = `${state.currentUser ? state.currentUser.tokens : 0} jetons`;
  elements.homeTokensDisplay.textContent = `${state.currentUser ? state.currentUser.tokens : 0}`;
  elements.homeBestScore.textContent = `${formatFCFA(state.currentUser ? state.currentUser.bestScore || 0 : 0)} FCFA`;
  updateTimerVisual();
  updateLifelineButtons();
}

function renderGains() {
  elements.gainsList.innerHTML = GAINS.slice().reverse().map((gain, reverseIndex) => {
    const actualIndex = GAINS.length - 1 - reverseIndex;
    return `<div class="gain-item" data-gain-index="${actualIndex}">${formatFCFA(gain)} FCFA</div>`;
  }).join("");
}

function updateGainsHighlight() {
  const items = Array.from(elements.gainsList.querySelectorAll(".gain-item"));
  items.forEach((item) => {
    const gainIndex = Number(item.dataset.gainIndex);
    item.classList.toggle("current", gainIndex === state.questionIndex);
    item.classList.toggle("completed", gainIndex < state.questionIndex);
  });
}

function showLeaderboard() {
  if (!requireAuth()) {
    return;
  }

  closePseudoModal();
  closeInfoModal();
  renderLeaderboard();
  showScreen("leaderboard");
}

function backToHome() {
  clearTimer();
  state.acceptingAnswers = false;
  closePseudoModal();
  closeInfoModal();
  showScreen(state.currentUser ? "home" : "auth");
}

function surrenderGame() {
  if (!state.currentQuestion) {
    backToHome();
    return;
  }

  clearTimer();
  state.acceptingAnswers = false;
  state.currentStreak = 0;
  showToast("Partie abandonnee.");
  finishGame(false);
}

function renderLeaderboard() {
  const entries = getLeaderboard();
  const current = state.currentUser;
  let filteredEntries = entries;

  if (state.leaderboardView === "local" && current) {
    filteredEntries = entries.filter((entry) => entry.region && entry.region === current.region);
  }

  const displayEntries = filteredEntries;
  const podiumEntries = displayEntries.slice(0, 3);

  if (elements.leaderboardViewLabel) {
    elements.leaderboardViewLabel.textContent = state.leaderboardView === "local" ? "Local" : "Global";
  }
  if (elements.leaderboardVisibleCount) {
    elements.leaderboardVisibleCount.textContent = String(displayEntries.length);
  }
  if (elements.leaderboardTopScore) {
    elements.leaderboardTopScore.textContent = `${formatFCFA(displayEntries[0] ? displayEntries[0].score : 0)} FCFA`;
  }
  if (elements.leaderboardHeroTitle) {
    elements.leaderboardHeroTitle.textContent = state.leaderboardView === "local" ? "Podium local" : "Podium mondial";
  }
  if (elements.leaderboardHeroText) {
    elements.leaderboardHeroText.textContent = state.leaderboardView === "local"
      ? `Voici les meilleurs scores de ${current && current.region ? current.region : "ta zone locale"}.`
      : "Compare ton meilleur parcours avec les meilleurs joueurs du moment partout dans le classement.";
  }
  if (elements.leaderboardListCaption) {
    elements.leaderboardListCaption.textContent = state.leaderboardView === "local"
      ? "Classement de ta zone locale."
      : "Classement complet du mode actif.";
  }

  if (!displayEntries.length) {
    if (elements.leaderboardPodium) {
      elements.leaderboardPodium.innerHTML = `<div class="podium-empty">Aucun podium disponible pour l'instant.</div>`;
    }
    elements.leaderboardList.innerHTML = `
      <div class="leaderboard-empty">
        <div>
          <strong>Aucun score pour l'instant</strong>
          <div class="leaderboard-meta">Lance une partie pour ouvrir le podium.</div>
        </div>
      </div>
    `;
    elements.leaderboardPosition.textContent = "--";
    elements.leaderboardBestScore.textContent = "0 FCFA";
    elements.leaderboardTopCategory.textContent = "N/A";
    return;
  }

  if (elements.leaderboardPodium) {
    elements.leaderboardPodium.innerHTML = podiumEntries.map((entry, index) => {
      const className = ["first", "second", "third"][index] || "";
      return `
        <article class="podium-card ${className}">
          <div class="podium-rank">#${index + 1}</div>
          <div class="podium-name">${escapeHtml(entry.name)}</div>
          <div class="podium-score">${formatFCFA(entry.score)} FCFA</div>
          <div class="podium-meta">${escapeHtml(entry.owner)}<br>${escapeHtml(entry.region || "Global")}</div>
        </article>
      `;
    }).join("") || `<div class="podium-empty">Aucun podium disponible pour cette vue.</div>`;
  }

  elements.leaderboardList.innerHTML = displayEntries.map((entry, index) => {
    const rank = `#${index + 1}`;
    const date = new Date(entry.date).toLocaleDateString("fr-FR");
    return `
      <div class="leaderboard-item top-${index + 1}">
        <div class="leaderboard-rank">${rank}</div>
        <div>
          <div class="leaderboard-name">${escapeHtml(entry.name)}</div>
          <div class="leaderboard-meta">${escapeHtml(entry.owner)} - ${escapeHtml(entry.region || "Global")} - ${date}</div>
        </div>
        <div class="leaderboard-score">${formatFCFA(entry.score)} FCFA</div>
      </div>
    `;
  }).join("");

  updateLeaderboardSummary(entries);
}

function openPseudoModal() {
  if (!state.finalScorePendingSave || !state.currentUser) {
    return;
  }

  elements.pseudoModal.classList.remove("hidden");
  elements.pseudoModal.setAttribute("aria-hidden", "false");
  elements.pseudoInput.value = state.currentUser.pseudo;
}

function closePseudoModal() {
  elements.pseudoModal.classList.add("hidden");
  elements.pseudoModal.setAttribute("aria-hidden", "true");
}

function savePseudo() {
  if (!state.finalScorePendingSave) {
    closePseudoModal();
    return;
  }

  const displayName = sanitizePseudo(elements.pseudoInput.value) || (state.currentUser ? state.currentUser.pseudo : "Joueur");
  const leaderboard = getLeaderboard();
  leaderboard.push({
    name: displayName,
    owner: state.currentUser ? state.currentUser.pseudo : "Invite",
    score: state.score,
    date: new Date().toISOString(),
    region: state.currentUser ? state.currentUser.region || "Global" : "Global"
  });

  leaderboard.sort((a, b) => b.score - a.score);
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard.slice(0, LEADERBOARD_LIMIT)));
  state.finalScorePendingSave = false;
  closePseudoModal();
  renderLeaderboard();
}

function openInfoModal(tag, title, bodyHtml) {
  elements.infoModalTag.textContent = tag;
  elements.infoModalTitle.textContent = title;
  elements.infoModalBody.innerHTML = bodyHtml;
  elements.infoModal.classList.remove("hidden");
  elements.infoModal.setAttribute("aria-hidden", "false");
}

function closeInfoModal() {
  elements.infoModal.classList.add("hidden");
  elements.infoModal.setAttribute("aria-hidden", "true");
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  elements.toastStack.appendChild(toast);

  window.setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(12px)";
    window.setTimeout(() => toast.remove(), 220);
  }, 2200);
}

function getLeaderboard() {
  try {
    return JSON.parse(localStorage.getItem(LEADERBOARD_KEY) || "[]");
  } catch (error) {
    return [];
  }
}

function getQuestionHistory() {
  if (!state.currentUser) {
    return [];
  }

  try {
    const allHistory = JSON.parse(localStorage.getItem(QUESTION_HISTORY_KEY) || "{}");
    return allHistory[state.currentUser.id] || [];
  } catch (error) {
    return [];
  }
}

function getQuestionStats() {
  if (!state.currentUser) {
    return {};
  }

  try {
    const allStats = JSON.parse(localStorage.getItem(QUESTION_STATS_KEY) || "{}");
    return allStats[state.currentUser.id] || {};
  } catch (error) {
    return {};
  }
}

function touchQuestionStats(questionId) {
  if (!state.currentUser || !questionId) {
    return;
  }

  let allStats = {};
  try {
    allStats = JSON.parse(localStorage.getItem(QUESTION_STATS_KEY) || "{}");
  } catch (error) {
    allStats = {};
  }

  const playerStats = allStats[state.currentUser.id] || {};
  const current = playerStats[questionId] || { seenCount: 0, lastSeenAt: null };
  playerStats[questionId] = {
    seenCount: current.seenCount + 1,
    lastSeenAt: new Date().toISOString()
  };
  allStats[state.currentUser.id] = playerStats;
  localStorage.setItem(QUESTION_STATS_KEY, JSON.stringify(allStats));
}

function saveQuestionHistory(ids) {
  if (!state.currentUser || !ids.length) {
    return;
  }

  let allHistory = {};
  try {
    allHistory = JSON.parse(localStorage.getItem(QUESTION_HISTORY_KEY) || "{}");
  } catch (error) {
    allHistory = {};
  }

  const existing = allHistory[state.currentUser.id] || [];
  const merged = [...new Set([...existing, ...ids])];
  allHistory[state.currentUser.id] = merged.slice(-2000);
  localStorage.setItem(QUESTION_HISTORY_KEY, JSON.stringify(allHistory));
}

function resetQuestionHistory() {
  if (!state.currentUser) {
    return;
  }

  let allHistory = {};
  try {
    allHistory = JSON.parse(localStorage.getItem(QUESTION_HISTORY_KEY) || "{}");
  } catch (error) {
    allHistory = {};
  }

  const current = allHistory[state.currentUser.id] || [];
  const keepRecentTail = Math.floor(current.length / 3);
  allHistory[state.currentUser.id] = keepRecentTail > 0 ? current.slice(-keepRecentTail) : [];
  localStorage.setItem(QUESTION_HISTORY_KEY, JSON.stringify(allHistory));
}

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]").map((user) => ({
      ...user,
      avatarStyle: normalizeAvatarStyle(user.avatarStyle),
      region: user.region || "Abidjan",
      stats: {
        ...createEmptyProfileStats(),
        ...(user.stats || {}),
        categoryStats: {
          ...(createEmptyProfileStats().categoryStats),
          ...((user.stats && user.stats.categoryStats) || {})
        }
      }
    }));
  } catch (error) {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
  } catch (error) {
    return null;
  }
}

function createSession(user) {
  state.currentUser = user;
  const session = {
    userId: user.id,
    token: buildSessionToken(user),
    createdAt: new Date().toISOString()
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

function buildSessionToken(user) {
  return btoa(`${user.id}:${user.passwordHash}`).replaceAll("=", "");
}

function persistCurrentUser() {
  if (!state.currentUser) {
    return;
  }

  const users = getUsers();
  const index = users.findIndex((entry) => entry.id === state.currentUser.id);
  if (index >= 0) {
    users[index] = state.currentUser;
    saveUsers(users);
    createSession(state.currentUser);
  }
}

function showScreen(name) {
  Object.entries(screens).forEach(([key, node]) => {
    node.classList.toggle("active", key === name);
  });
}

function setAuthStatus(message, type = "") {
  elements.authStatus.textContent = message;
  elements.authStatus.className = "status-message";
  if (type) {
    elements.authStatus.classList.add(type);
  }
}

function formatFCFA(value) {
  return new Intl.NumberFormat("fr-FR").format(value);
}

function formatTime(totalSeconds) {
  const safe = Math.max(0, totalSeconds);
  const minutes = String(Math.floor(safe / 60)).padStart(2, "0");
  const seconds = String(safe % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function getVictoryMessage(score) {
  if (score >= 1000000) {
    return "Expert. Tu as gere ca comme un vrai champion de plateau.";
  }
  if (score >= 100000) {
    return "Solide parcours. Tu sens deja le haut du classement.";
  }
  return "Belle base. Encore une partie et tu montes vite.";
}

function getFailureMessage(score) {
  if (score >= 500000) {
    return "Aie... tu etais presque arrive au gros palier.";
  }
  if (score >= 50000) {
    return "Bien tente. Tu peux revenir plus fort avec tes jetons.";
  }
  return "On repart doucement. La prochaine peut changer beaucoup de choses.";
}

function shakeGameScreen() {
  screens.game.classList.add("screen-shake");
  window.setTimeout(() => screens.game.classList.remove("screen-shake"), 350);
}

function sanitizePseudo(value) {
  return value.trim().replace(/\s+/g, " ").slice(0, 20);
}

function sanitizeRegion(value) {
  return value.trim().replace(/\s+/g, " ").slice(0, 30);
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function createId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

async function hashPassword(password) {
  if (!window.crypto || !window.crypto.subtle) {
    return password;
  }

  const encoded = new TextEncoder().encode(password);
  const digest = await window.crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(digest)).map((item) => item.toString(16).padStart(2, "0")).join("");
}

function enableAudio() {
  if (!window.AudioContext && !window.webkitAudioContext) {
    return;
  }

  if (!state.audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    state.audioCtx = new AudioContextClass();
  }

  if (state.audioCtx.state === "suspended") {
    state.audioCtx.resume();
  }
}

function playTone(frequency, duration, type = "sine", gainValue = 0.03, delay = 0) {
  if (!state.audioCtx) {
    return;
  }

  const start = state.audioCtx.currentTime + delay;
  const oscillator = state.audioCtx.createOscillator();
  const gainNode = state.audioCtx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  gainNode.gain.setValueAtTime(0, start);
  gainNode.gain.linearRampToValueAtTime(gainValue, start + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.001, start + duration);

  oscillator.connect(gainNode);
  gainNode.connect(state.audioCtx.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.03);
}

function playSuspenseTone() {
  playTone(220, 0.65, "sine", 0.026, 0);
  playTone(262, 0.75, "sine", 0.022, 0.65);
}

function playTickTone() {
  playTone(520, 0.08, "square", 0.011, 0);
}

function playSuccessTone() {
  playTone(523, 0.12, "triangle", 0.03, 0);
  playTone(659, 0.14, "triangle", 0.03, 0.12);
  playTone(784, 0.18, "triangle", 0.03, 0.24);
}

function playFailureTone() {
  playTone(280, 0.18, "sawtooth", 0.025, 0);
  playTone(180, 0.25, "sawtooth", 0.025, 0.18);
}

function playLifelineTone(frequency = 700) {
  playTone(frequency, 0.1, "triangle", 0.022, 0);
  playTone(frequency + 120, 0.12, "triangle", 0.022, 0.1);
}

function playTokenTone() {
  playTone(840, 0.08, "triangle", 0.02, 0);
  playTone(980, 0.12, "triangle", 0.02, 0.08);
}
