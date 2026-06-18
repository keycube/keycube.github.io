document.addEventListener('DOMContentLoaded', async function () {
  const response = await fetch('/assets/js/dataviz-lang.json');
  const datavizLang = await response.json();

  const participantsData = window.participantsData;
  const preferenceAggregate = window.preferenceAggregate;
  const reachabilityData = window.reachabilityData;
  const perFingerReachability = window.perFingerReachability;

  const defaultModeMeta = document.querySelector('meta[name="default-mode"]');
  const currentMode = defaultModeMeta ? defaultModeMeta.getAttribute('content') : 'preference';
  let currentParticipant = null;
  let currentFace = null;

  const FACES = ['R', 'B', 'G', 'W', 'Y'];
  const FINGER_CODES = ['LL', 'LR', 'LM', 'LI', 'LT', 'RT', 'RI', 'RM', 'RR', 'RL'];

  const lang = document.documentElement.lang
  const datavizData = datavizLang[lang] ? datavizLang[lang] : datavizLang["en"];

  function computeFingerFrequencies(dataArray) {
    const frequencies = {};
    FACES.forEach(function (face) {
      frequencies[face] = [];
      for (let i = 0; i < 16; i++) {
        const counts = {};
        FINGER_CODES.forEach(function (code) { counts[code] = 0; });
        dataArray.forEach(function (participant) {
          const fingerCode = participant[face][i];
          if (fingerCode >= 1 && fingerCode <= 10) {
            counts[FINGER_CODES[fingerCode - 1]] += 1;
          }
        });
        frequencies[face].push(counts);
      }
    });
    return frequencies;
  }

  let preferenceFrequencies = computeFingerFrequencies(participantsData);

  // ─── Utility: compute aggregate data ───
  function computeAggregate(dataArray) {
    const result = {};
    FACES.forEach(function (face) {
      result[face] = [];
      for (let i = 0; i < 16; i++) {
        let sum = 0;
        dataArray.forEach(function (p) { sum += p[face][i]; });
        result[face].push(sum);
      }
    });
    return result;
  }

  function computeAggregateMean(dataArray) {
    const result = computeAggregate(dataArray);
    const count = dataArray.length;
    FACES.forEach(function (face) {
      result[face] = result[face].map(function (v) { return +(v / count).toFixed(2); });
    });
    return result;
  }

  const aggregatePreference = preferenceAggregate ? preferenceAggregate.scores : computeAggregateMean(participantsData);
  const aggregateReachability = computeAggregate(reachabilityData);

  // ─── Per-finger aggregate reachability ───
  function getFingerReachability(finger) {
    const fingerData = perFingerReachability[finger];
    return fingerData ? computeAggregate(fingerData) : { R: [], B: [], G: [], W: [], Y: [] };
  }

  // ═══════════════════════════════════════════════════════
  //  PREFERENCE MODE
  // ═══════════════════════════════════════════════════════

  function getParticipantPreferenceFigure(participant) {
    const figure = {scores: {}, dominantFingers: {}, tiedFingers: {}};

    FACES.forEach(function (face) {
      figure.scores[face] = [];
      figure.dominantFingers[face] = [];
      figure.tiedFingers[face] = [];

      for (let i = 0; i < 16; i++) {
        const fingerNumber = participant[face][i];
        const fingerCode = (fingerNumber >= 1 && fingerNumber <= 10)
            ? FINGER_CODES[fingerNumber - 1]
            : 'LT';
        const count = preferenceFrequencies[face][i][fingerCode] || 0;
        const ratio = +(count / participantsData.length).toFixed(2);

        figure.scores[face].push(ratio);
        figure.dominantFingers[face].push(fingerCode);
        figure.tiedFingers[face].push([fingerCode]);
      }
    });

    return figure;
  }

  function applyPreferenceView() {
    if (!window.updateModel) return;
    let figureData = null;
    let displayScores = null;
    let displayScoreFormat = 'ratio';
    if (currentParticipant === 'aggregate') figureData = preferenceAggregate;
    else if (currentParticipant && typeof currentParticipant === 'object') {
      figureData = getParticipantPreferenceFigure(currentParticipant);
      displayScores = {
        R: currentParticipant.R,
        B: currentParticipant.B,
        G: currentParticipant.G,
        W: currentParticipant.W,
        Y: currentParticipant.Y
      };
      displayScoreFormat = 'integer';
    }

    if (!figureData) {
      window.updateModel({ reset: true, hideScores: true });
      return;
    }

    if (!displayScores) displayScores = figureData.scores;

    const opts = {
      scores: displayScores,
      showScores: true,
      scoreFormat: displayScoreFormat,
      preferenceFigure: figureData,
      figure6View: true
    };

    if (currentFace) opts.preferenceFigureSingleFace = currentFace;
    window.updateModel(opts);
  }

  function updateSelectionBadge(icon, text) {
    const selectionIcon = document.getElementById('selection-icon');
    const selectionText = document.getElementById('selection-text');
    if (selectionIcon) selectionIcon.textContent = icon;
    if (selectionText) selectionText.textContent = text;
  }

  function togglePreferenceLegend(show) {
    const legend = document.getElementById('finger-preference-legend');
    if (!legend) return;
    legend.classList.toggle('hidden', !show);
  }

  function togglePreferenceHeatmapLegend(show) {
    const legend = document.getElementById('preference-heatmap-legend');
    if (!legend) return;
    legend.classList.toggle('hidden', !show);
  }

  function togglePreferenceFaceButtons(show) {
    const buttons = document.getElementById('preference-face-buttons');
    if (!buttons) return;
    buttons.classList.toggle('hidden', !show);
  }

  // ─── Participant selector ───
  const participantSelect = document.getElementById('participant-select');
  const colorButtons = document.querySelectorAll('.color-btn');

  if (currentMode === 'preference') {
    togglePreferenceLegend(false);
    togglePreferenceHeatmapLegend(false);
  }
  
  if (participantSelect) {
    participantSelect.addEventListener('change', function (e) {
      const val = e.target.value;
      currentFace = null;
      colorButtons.forEach(function (b) { b.classList.remove('active'); });
      const summaryPanel = document.getElementById('participant-summary');

      if (val === 'aggregate') {
        currentParticipant = 'aggregate';
        togglePreferenceLegend(true);
        togglePreferenceHeatmapLegend(false);
        togglePreferenceFaceButtons(true);
        if (summaryPanel) summaryPanel.style.display = 'none';
        updateSelectionBadge('', datavizData["afp"]);
        applyPreferenceView();
      } else if (val !== '') {
        currentParticipant = participantsData[parseInt(val)];
        togglePreferenceLegend(true);
        togglePreferenceHeatmapLegend(false);
        togglePreferenceFaceButtons(true);
        if (summaryPanel) {
          summaryPanel.style.display = 'block';
          ['handedness', 'circumferenceRight', 'lengthRight', 'spanRight'].forEach(function (key, i) {
            const ids = ['summary-handedness', 'summary-circumference', 'summary-length', 'summary-span'];
            const el = document.getElementById(ids[i]);
            if (el) el.textContent = currentParticipant[key];
          });
        }
        updateSelectionBadge('',
            datavizData["participant"] + ' ' + currentParticipant.number + ' ' + datavizData["p_participant"]
          );
        applyPreferenceView();
      } else {
        currentParticipant = null;
        togglePreferenceLegend(false);
        togglePreferenceHeatmapLegend(false);
        togglePreferenceFaceButtons(true);
        if (summaryPanel) summaryPanel.style.display = 'none';
        updateSelectionBadge('', datavizData["no_participant"]);
        if (window.updateModel) window.updateModel({ reset: true, hideScores: true });
      }
    });
  }

  // ─── Face color buttons ───
  colorButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      if (currentMode !== 'preference' || !currentParticipant) return;
      colorButtons.forEach(function (b) { b.classList.remove('active'); });
      button.classList.add('active');
      currentFace = button.getAttribute('data-color');
      applyPreferenceView();
    });
  });

  // ─── Reset / Show All button ───
  const resetBtn = document.querySelector('.reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      colorButtons.forEach(function (b) { b.classList.remove('active'); });
      currentFace = null;
      if (currentMode === 'preference') applyPreferenceView();
      else if (currentMode === 'reachability') applyReachabilityView();
    });
  }

  // ═══════════════════════════════════════════════════════
  //  REACHABILITY MODE
  // ═══════════════════════════════════════════════════════

  function applyReachabilityView() {
    if (!window.updateModel) return;
    const fingerEl = document.getElementById('finger-select');
    if (!fingerEl) return;
    const isTotal = fingerEl.value === 'total';
    const data = isTotal ? aggregateReachability : getFingerReachability(fingerEl.value);
    const range = isTotal ? {min: 0, max: 198} : {min: 0, max: 66};
    window.updateModel({ 
      heatmap: data, 
      heatmapMin: range.min,
      heatmapMax: range.max,
      scores: data,
      showScores: true,
      isReachability: true,
      scoreFormat: 'integer',
      figure6View: false
    });
  }

  // Finger filter for reachability
  const fingerSelect = document.getElementById('finger-select');
  if (fingerSelect) {
    fingerSelect.addEventListener('change', function () {
      if (currentMode === 'reachability') applyReachabilityView();
    });
  }

  // ═══════════════════════════════════════════════════════
  //  SHARED CONTROLS
  // ═══════════════════════════════════════════════════════

  // Make data available globally
  window.aggregatePreference = aggregatePreference;
  window.aggregateReachability = aggregateReachability;

  // Collapsible sections
  document.querySelectorAll('.controls-section h3').forEach(function (header) {
    header.addEventListener('click', function () {
      header.closest('.controls-section').classList.toggle('active');
    });
  });

  // Helper for simple control bindings
  function bindControl(id, event, handler) {
    const el = document.getElementById(id);
    if (el) el.addEventListener(event, handler);
  }

  bindControl('wireframe-toggle', 'change', function (e) {
    if (window.updateModel) window.updateModel({ wireframe: e.target.checked });
  });

  bindControl('bg-color-picker', 'input', function (e) {
    if (window.updateModel) window.updateModel({ backgroundColor: e.target.value });
  });

  bindControl('reset-view-btn', 'click', function () {
    if (window.updateModel) window.updateModel({ resetView: true });
  });

  const lightValueSpan = document.getElementById('light-intensity-value');
  bindControl('light-intensity', 'input', function (e) {
    if (lightValueSpan) lightValueSpan.textContent = e.target.value;
    if (window.updateModel) window.updateModel({ lightingIntensity: parseInt(e.target.value) / 100 });
  });

  // Auto-apply default mode on page load
  if (currentMode === 'reachability') applyReachabilityView();
});
