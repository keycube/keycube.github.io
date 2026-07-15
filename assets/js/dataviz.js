document.addEventListener('DOMContentLoaded', function () {
  const participantsData = window.participantsData;
  const preferenceAggregate = window.preferenceAggregate;
  const reachabilityData = window.reachabilityData;
  const perFingerReachability = window.perFingerReachability;

  const defaultModeMeta = document.querySelector('meta[name="default-mode"]');

  const FACES = ['R', 'B', 'G', 'W', 'Y'];

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

  bindControl('reset-view-btn', 'click', function () {
    if (window.updateModel) window.updateModel({ resetView: true });
  });

  applyReachabilityView();
});
