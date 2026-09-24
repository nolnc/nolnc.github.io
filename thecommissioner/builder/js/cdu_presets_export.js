/**
 * CDU Schematic CAD Builder - Presets & React JSX / SVG Export Module
 * Handles loading schematic presets (100kW, 30kW, 75kW, Vacuum N2) and
 * exporting / importing SVG and React JSX snippets.
 * Compatible with Windows, Linux, and macOS.
 */

(function(window) {
  'use strict';

  let currentExportTab = 'jsx';

  function openExportModal() {
    const modal = document.getElementById('exportModal');
    if (modal) {
      modal.classList.remove('hidden');
      generateExportCode();
    }
  }

  function closeExportModal() {
    const modal = document.getElementById('exportModal');
    if (modal) {
      modal.classList.add('hidden');
    }
  }

  function switchExportTab(tab) {
    currentExportTab = tab;
    const tabJsxBtn = document.getElementById('tabJsxBtn');
    const tabSvgBtn = document.getElementById('tabSvgBtn');

    if (tab === 'jsx') {
      if (tabJsxBtn) tabJsxBtn.className = 'px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white transition';
      if (tabSvgBtn) tabSvgBtn.className = 'px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-400 hover:text-white transition';
    } else {
      if (tabSvgBtn) tabSvgBtn.className = 'px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white transition';
      if (tabJsxBtn) tabJsxBtn.className = 'px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-400 hover:text-white transition';
    }
    generateExportCode();
  }

  function generateExportCode() {
    const presetSelect = document.getElementById('exportTargetPreset');
    const preset = presetSelect ? presetSelect.value : 'generic';
    const textarea = document.getElementById('exportCodeTextarea');
    const stats = document.getElementById('exportStatsLabel');
    if (!textarea) return;

    const pipesHtml = (document.getElementById('sandboxPipesContainer')?.innerHTML || '').trim();
    const itemsHtml = (document.getElementById('sandboxItemsContainer')?.innerHTML || '').trim();

    const dims = window.getCanvasDimensions ? window.getCanvasDimensions() : { width: 1200, height: 580 };
    const currentCanvasWidth = dims.width;
    const currentCanvasHeight = dims.height;

    if (currentExportTab === 'svg') {
      const fullSvg = `<svg viewBox="0 0 ${currentCanvasWidth} ${currentCanvasHeight}" className="cdu-svg">\n  <!-- Pipes & Loops -->\n  <g id="schematic-pipes">\n    ${pipesHtml}\n  </g>\n\n  <!-- Hardware Components & Sensors -->\n  <g id="schematic-components">\n    ${itemsHtml}\n  </g>\n</svg>`;
      textarea.value = fullSvg;
      if (stats) stats.innerText = `Raw SVG (${currentCanvasWidth}x${currentCanvasHeight}px viewBox)`;
      return;
    }

    let componentName = 'CDUSchematicCustom';
    if (preset === '100kw') componentName = 'CDUSchematic100kW';
    else if (preset === '300kw') componentName = 'CDUSchematic300kW';
    else if (preset === '30kw') componentName = 'CDUSchematic30kW';
    else if (preset === '75kw') componentName = 'CDUSchematic75kW';
    else if (preset === '2-5mw') componentName = 'CDUSchematic2_5MW';
    else if (preset === 'vacuum_n2') componentName = 'CDUSchematicVacuumN2';

    const fullJsxComponent = `import React from 'react';

const ${componentName} = ({ data, profile, isFlowing, pumpSpeed, themeColorMaps }) => {
    const { coldColor, hotColor, primaryPipeColor, secondaryPipeColor, hexColor, pumpColor, tankColor, flowMeterColor, valveColor } = themeColorMaps;

    return (
        <svg viewBox="0 0 ${currentCanvasWidth} ${currentCanvasHeight}" className="cdu-svg">
            {/* --- PIPES & FLUID FLOW LOOPS --- */}
            <g id="schematic-pipes">
${indentCode(convertSvgToJsx(pipesHtml), 16)}
            </g>

            {/* --- CDU COMPONENTS & SENSORS --- */}
            <g id="schematic-components">
${indentCode(convertSvgToJsx(itemsHtml), 16)}
            </g>
        </svg>
    );
};

export default ${componentName};
`;

    textarea.value = fullJsxComponent;
    if (stats) stats.innerText = `Ready for ${componentName}.jsx (${currentCanvasWidth}x${currentCanvasHeight}px)`;
  }

  function convertSvgToJsx(htmlStr) {
    if (!htmlStr) return '';
    return htmlStr
      .replace(/class=/g, 'className=')
      .replace(/stroke-width=/g, 'strokeWidth=')
      .replace(/stroke-linecap=/g, 'strokeLinecap=')
      .replace(/stroke-linejoin=/g, 'strokeLinejoin=')
      .replace(/stroke-dasharray=/g, 'strokeDasharray=')
      .replace(/text-anchor=/g, 'textAnchor=')
      .replace(/font-size=/g, 'fontSize=')
      .replace(/font-weight=/g, 'fontWeight=')
      .replace(/font-family=/g, 'fontFamily=')
      .replace(/fill-opacity=/g, 'fillOpacity=')
      .replace(/stop-color=/g, 'stopColor=')
      .replace(/stop-opacity=/g, 'stopOpacity=')
      .replace(/dominant-baseline=/g, 'dominantBaseline=');
  }

  function indentCode(codeStr, spaces) {
    const padding = ' '.repeat(spaces);
    return codeStr.split('\n').map(line => line.trim() ? padding + line : line).join('\n');
  }

  function copyExportCode() {
    const textarea = document.getElementById('exportCodeTextarea');
    if (!textarea) return;
    textarea.select();
    navigator.clipboard.writeText(textarea.value).then(() => {
      if (window.showToast) window.showToast('Schematic JSX / SVG code copied to clipboard!');
    });
  }

  // ==========================================
  // IMPORT MODAL & PRESET LOADERS
  // ==========================================
  function openImportModal() {
    const modal = document.getElementById('importModal');
    if (modal) modal.classList.remove('hidden');
  }

  function closeImportModal() {
    const modal = document.getElementById('importModal');
    if (modal) modal.classList.add('hidden');
  }

  function loadPresetSchematic(presetName) {
    if (window.clearSandbox) window.clearSandbox();
    const pipes = document.getElementById('sandboxPipesContainer');
    const items = document.getElementById('sandboxItemsContainer');
    if (!pipes || !items) return;

    if (presetName === '100kw') {
      pipes.innerHTML = `
        <g id="pipe-p1" class="draggable-item pipe-item" data-type="pipe" data-x1="55" data-y1="280" data-x2="280" data-y2="200" data-color="#38bdf8" data-start-conn="" data-end-conn="item-hex:p1_in">
          <path d="M 55 280 L 280 280 L 280 200" stroke="#0284c7" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round" class="pipe-base-path"/>
          <path d="M 55 280 L 280 280 L 280 200" stroke="#38bdf8" stroke-width="2" fill="none" class="flow-target flow-active pipe-flow-path" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="55" cy="280" r="5" fill="#38bdf8" class="pipe-handle handle-start cursor-move"/>
          <circle cx="280" cy="200" r="5" fill="#38bdf8" class="pipe-handle handle-end cursor-move"/>
        </g>
        <g id="pipe-p2" class="draggable-item pipe-item" data-type="pipe" data-x1="280" data-y1="120" data-x2="55" data-y2="120" data-color="#ef4444" data-start-conn="item-hex:p1_out" data-end-conn="">
          <path d="M 280 120 L 55 120" stroke="#b91c1c" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round" class="pipe-base-path"/>
          <path d="M 280 120 L 55 120" stroke="#ef4444" stroke-width="2" fill="none" class="flow-target flow-active pipe-flow-path" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="280" cy="120" r="5" fill="#ef4444" class="pipe-handle handle-start cursor-move"/>
          <circle cx="55" cy="120" r="5" fill="#ef4444" class="pipe-handle handle-end cursor-move"/>
        </g>
        <g id="pipe-s1" class="draggable-item pipe-item" data-type="pipe" data-x1="550" data-y1="280" data-x2="320" data-y2="200" data-color="#ef4444" data-start-conn="" data-end-conn="item-hex:p2_in">
          <path d="M 550 280 L 320 280 L 320 200" stroke="#b91c1c" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round" class="pipe-base-path"/>
          <path d="M 550 280 L 320 280 L 320 200" stroke="#ef4444" stroke-width="2" fill="none" class="flow-target flow-active pipe-flow-path" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="550" cy="280" r="5" fill="#ef4444" class="pipe-handle handle-start cursor-move"/>
          <circle cx="320" cy="200" r="5" fill="#ef4444" class="pipe-handle handle-end cursor-move"/>
        </g>
        <g id="pipe-s2" class="draggable-item pipe-item" data-type="pipe" data-x1="320" data-y1="120" data-x2="550" data-y2="120" data-color="#38bdf8" data-start-conn="item-hex:p2_out" data-end-conn="">
          <path d="M 320 120 L 550 120" stroke="#0284c7" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round" class="pipe-base-path"/>
          <path d="M 320 120 L 550 120" stroke="#38bdf8" stroke-width="2" fill="none" class="flow-target flow-active pipe-flow-path" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="320" cy="120" r="5" fill="#38bdf8" class="pipe-handle handle-start cursor-move"/>
          <circle cx="550" cy="120" r="5" fill="#38bdf8" class="pipe-handle handle-end cursor-move"/>
        </g>`;

      items.innerHTML = `
        <g id="item-hex" transform="translate(300, 200) rotate(0) scale(1.1)" class="draggable-item comp-item" data-type="comp" data-x="300" data-y="200" data-rot="0" data-scale="1.1">
          <rect x="-30" y="-120" width="60" height="240" rx="3" fill="#0f172a" stroke="#f59e0b" stroke-width="1.8"/>
          <path d="M -30 -80 L 30 -60 M -30 -40 L 30 -20 M -30 0 L 30 20 M -30 40 L 30 60 M -30 80 L 30 100" stroke="#f59e0b" stroke-width="0.8" opacity="0.4"/>
          <text x="0" y="5" fill="#f59e0b" font-size="9" font-weight="bold" text-anchor="middle" transform="rotate(-90 0 5)">HEAT_EXCHANGER</text>
          <circle cx="-20" cy="-80" r="4.5" class="port-dot" data-port="p1_out"/>
          <circle cx="-20" cy="0" r="4.5" class="port-dot" data-port="p1_in"/>
          <circle cx="20" cy="-80" r="4.5" class="port-dot" data-port="p2_out"/>
          <circle cx="20" cy="0" r="4.5" class="port-dot" data-port="p2_in"/>
        </g>
        <g id="item-pump1" transform="translate(450, 120) rotate(0) scale(1)" class="draggable-item comp-item" data-type="comp" data-x="450" data-y="120" data-rot="0" data-scale="1">
          <circle cx="0" cy="0" r="18" fill="#0f172a" stroke="#818cf8" stroke-width="1.8"/>
          <polygon points="-6,-8 -6,8 10,0" fill="#818cf8" class="spin-target spin-active" style="transform-origin: 0px 0px;"/>
          <text x="0" y="30" text-anchor="middle" fill="#94a3b8" font-size="8" font-weight="bold">PUMP_1</text>
          <circle cx="-18" cy="0" r="4.5" class="port-dot" data-port="in"/>
          <circle cx="18" cy="0" r="4.5" class="port-dot" data-port="out"/>
        </g>
        <g id="item-tank" transform="translate(370, 120) rotate(0) scale(1)" class="draggable-item comp-item" data-type="comp" data-x="370" data-y="120" data-rot="0" data-scale="1">
          <rect x="-9" y="10" width="18" height="25" rx="9" fill="#0f172a" stroke="#818cf8" stroke-width="1.5"/>
          <line x1="-6" y1="20" x2="6" y2="20" stroke="#818cf8" stroke-width="1" stroke-dasharray="1.5 1"/>
          <text x="0" y="45" text-anchor="middle" fill="#818cf8" font-size="7" font-weight="bold">EXP_TANK</text>
          <circle cx="0" cy="10" r="4.5" class="port-dot" data-port="conn"/>
        </g>`;
    } else if (presetName === '30kw' || presetName === '75kw') {
      pipes.innerHTML = `
        <g id="pipe-fan1" class="draggable-item pipe-item" data-type="pipe" data-x1="80" data-y1="100" data-x2="600" data-y2="100" data-color="#38bdf8" data-start-conn="" data-end-conn="">
          <path d="M 80 100 L 600 100" stroke="#0284c7" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round" class="pipe-base-path"/>
          <path d="M 80 100 L 600 100" stroke="#38bdf8" stroke-width="2" fill="none" class="flow-target flow-active pipe-flow-path" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="80" cy="100" r="5" fill="#38bdf8" class="pipe-handle handle-start cursor-move"/>
          <circle cx="600" cy="100" r="5" fill="#38bdf8" class="pipe-handle handle-end cursor-move"/>
        </g>
        <g id="pipe-fan2" class="draggable-item pipe-item" data-type="pipe" data-x1="600" data-y1="340" data-x2="80" data-y2="340" data-color="#ef4444" data-start-conn="" data-end-conn="">
          <path d="M 600 340 L 80 340" stroke="#b91c1c" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round" class="pipe-base-path"/>
          <path d="M 600 340 L 80 340" stroke="#ef4444" stroke-width="2" fill="none" class="flow-target flow-active pipe-flow-path" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="600" cy="340" r="5" fill="#ef4444" class="pipe-handle handle-start cursor-move"/>
          <circle cx="80" cy="340" r="5" fill="#ef4444" class="pipe-handle handle-end cursor-move"/>
        </g>`;

      items.innerHTML = `
        <g id="item-fan-array" transform="translate(660, 220) rotate(0) scale(1.4)" class="draggable-item comp-item" data-type="comp" data-x="660" data-y="220" data-rot="0" data-scale="1.4">
          <rect x="-35" y="-80" width="70" height="160" rx="6" fill="#0f172a" stroke="#84cc16" stroke-width="2"/>
          <g class="spin-target spin-active" style="transform-origin: 0px -40px;"><circle cx="0" cy="-40" r="14" fill="#84cc16" opacity="0.6"/></g>
          <g class="spin-target spin-active" style="transform-origin: 0px 40px;"><circle cx="0" cy="40" r="14" fill="#84cc16" opacity="0.6"/></g>
          <text x="0" y="95" text-anchor="middle" fill="#84cc16" font-size="8" font-weight="bold">RADIATOR_FAN_MATRIX</text>
          <circle cx="-35" cy="-60" r="4.5" class="port-dot" data-port="in"/>
          <circle cx="-35" cy="60" r="4.5" class="port-dot" data-port="out"/>
        </g>
        <g id="item-pump-30" transform="translate(300, 340) rotate(0) scale(1)" class="draggable-item comp-item" data-type="comp" data-x="300" data-y="340" data-rot="0" data-scale="1">
          <circle cx="0" cy="0" r="22" fill="#0f172a" stroke="#3b82f6" stroke-width="2"/>
          <polygon points="-7,-9 -7,9 11,0" fill="#3b82f6" class="spin-target spin-active" style="transform-origin: 0px 0px;"/>
          <text x="0" y="34" text-anchor="middle" fill="#94a3b8" font-size="8" font-weight="bold">PRIMARY_PUMP</text>
          <circle cx="-22" cy="0" r="4.5" class="port-dot" data-port="in"/>
          <circle cx="22" cy="0" r="4.5" class="port-dot" data-port="out"/>
        </g>`;
    } else if (presetName === 'vacuum') {
      pipes.innerHTML = `
        <g id="pipe-vac1" class="draggable-item pipe-item" data-type="pipe" data-x1="165" data-y1="310" data-x2="300" data-y2="360" data-color="#38bdf8" data-start-conn="" data-end-conn="">
          <path d="M 165 310 L 165 360 L 300 360" stroke="#0284c7" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round" class="pipe-base-path"/>
          <path d="M 165 310 L 165 360 L 300 360" stroke="#38bdf8" stroke-width="2" fill="none" class="flow-target flow-active pipe-flow-path" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="165" cy="310" r="5" fill="#38bdf8" class="pipe-handle handle-start cursor-move"/>
          <circle cx="300" cy="360" r="5" fill="#38bdf8" class="pipe-handle handle-end cursor-move"/>
        </g>`;

      items.innerHTML = `
        <g id="item-vac-chamber" transform="translate(160, 220) rotate(0) scale(1)" class="draggable-item comp-item" data-type="comp" data-x="160" data-y="220" data-rot="0" data-scale="1">
          <rect x="-65" y="-90" width="130" height="180" rx="8" fill="#0f172a" stroke="#818cf8" stroke-width="2"/>
          <circle cx="0" cy="0" r="25" fill="none" stroke="#818cf8" stroke-width="1" stroke-dasharray="3 2"/>
          <text x="0" y="-60" fill="#818cf8" font-size="9" font-weight="bold" text-anchor="middle">VACUUM_CHAMBER</text>
          <circle cx="0" cy="90" r="4.5" class="port-dot" data-port="drain"/>
        </g>
        <g id="item-n2-bottle" transform="translate(520, 200) rotate(0) scale(1)" class="draggable-item comp-item" data-type="comp" data-x="520" data-y="200" data-rot="0" data-scale="1">
          <rect x="-40" y="-100" width="80" height="200" rx="10" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>
          <text x="0" y="0" fill="#f59e0b" font-size="10" font-weight="bold" text-anchor="middle" transform="rotate(-90 0 0)">NITROGEN_N2</text>
          <circle cx="-40" cy="0" r="4.5" class="port-dot" data-port="outlet"/>
        </g>`;
    }

    // Match the canvas drawable region initially to the canvas viewport
    if (window.autoFitCanvasToViewport) {
      window.autoFitCanvasToViewport(true);
    }

    closeImportModal();
    if (window.resetSchematicDirty) window.resetSchematicDirty();
    if (window.refreshOutliner) window.refreshOutliner();
    if (window.showToast) {
      window.showToast(`Loaded ${presetName.toUpperCase()} Schematic Preset into CAD Canvas!`);
    }
  }

  function applyImportCode() {
    const textarea = document.getElementById('importCodeTextarea');
    const code = textarea ? textarea.value.trim() : '';
    if (!code) {
      if (window.showToast) window.showToast('Please paste SVG markup or JSX code first.');
      return;
    }

    try {
      // Ensure canvas drawable region initially matches viewport
      if (window.autoFitCanvasToViewport) {
        window.autoFitCanvasToViewport(true);
      }

      // Parse SVG or JSX snippet
      const tempDiv = document.createElement('div');
      const sanitizedHtml = code
        .replace(/className=/g, 'class=')
        .replace(/strokeWidth=/g, 'stroke-width=')
        .replace(/strokeLinecap=/g, 'stroke-linecap=')
        .replace(/strokeLinejoin=/g, 'stroke-linejoin=')
        .replace(/strokeDasharray=/g, 'stroke-dasharray=')
        .replace(/textAnchor=/g, 'text-anchor=')
        .replace(/fontSize=/g, 'font-size=')
        .replace(/fontWeight=/g, 'font-weight=')
        .replace(/fontFamily=/g, 'font-family=')
        .replace(/fillOpacity=/g, 'fill-opacity=')
        .replace(/dominantBaseline=/g, 'dominant-baseline=');

      tempDiv.innerHTML = sanitizedHtml;

      const svgElem = tempDiv.querySelector('svg');
      const contentToLoad = svgElem ? svgElem.innerHTML : sanitizedHtml;

      const items = document.getElementById('sandboxItemsContainer');
      if (items) {
        items.insertAdjacentHTML('beforeend', contentToLoad);
      }

      closeImportModal();
      if (window.markSchematicDirty) window.markSchematicDirty();
      if (window.refreshOutliner) window.refreshOutliner();
      if (window.showToast) window.showToast('Successfully imported SVG elements into CAD canvas!');
    } catch (err) {
      if (window.showToast) window.showToast('Could not parse SVG markup. Please check formatting.');
    }
  }

  // Exports to global window
  window.openExportModal = openExportModal;
  window.closeExportModal = closeExportModal;
  window.switchExportTab = switchExportTab;
  window.generateExportCode = generateExportCode;
  window.copyExportCode = copyExportCode;
  window.openImportModal = openImportModal;
  window.closeImportModal = closeImportModal;
  window.loadPresetSchematic = loadPresetSchematic;
  window.applyImportCode = applyImportCode;

})(window);
