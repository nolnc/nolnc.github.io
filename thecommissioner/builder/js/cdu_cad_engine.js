/**
 * CDU Schematic CAD Builder - Core CAD Engine
 * Handles Canvas interactions, orthogonal pipe routing, port snapping,
 * selection controls, rotation, and scaling.
 * Compatible with Windows, Linux, and macOS.
 */

(function(window) {
  'use strict';

  let animationsActive = true;
  let snapToGrid = true;
  const GRID_SIZE = 20;
  let itemIdCounter = 100;
  let selectedElement = null;

  // Interaction State
  let isDragging = false;
  let dragMode = null; // 'comp', 'pipe-body', 'pipe-handle-start', 'pipe-handle-end', 'pipe-handle-mid'
  let dragTarget = null;
  let activeHandle = null;

  let startMouseX = 0, startMouseY = 0;
  let startElemX = 0, startElemY = 0;
  let startLineX1 = 0, startLineY1 = 0, startLineX2 = 0, startLineY2 = 0;

  let svgCanvas = null;

  // Canvas Dimensions & Dynamic Expansion
  let currentCanvasWidth = 1200;
  let currentCanvasHeight = 580;
  let isUserExpanded = false;

  function initCadEngine() {
    svgCanvas = document.getElementById('sandboxCanvas');
    if (!svgCanvas) return;

    svgCanvas.addEventListener('mousedown', startInteraction);
    svgCanvas.addEventListener('mousemove', handleInteraction);
    svgCanvas.addEventListener('mouseup', endInteraction);
    svgCanvas.addEventListener('mouseleave', endInteraction);
    svgCanvas.addEventListener('dblclick', (e) => {
      const item = e.target.closest('.draggable-item');
      if (item && item.getAttribute('data-type') === 'comp') {
        selectElement(item);
        if (item.querySelectorAll('text').length > 0) {
          editSelectedText();
        }
      }
    });

    // Keyboard Delete
    window.addEventListener('keydown', (e) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElement) {
        // Prevent deleting if user is typing inside an input/textarea
        if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
        deleteSelected();
      }
    });

    updateSelectionControls();

    const viewport = document.getElementById('canvasViewport');
    const outliner = document.getElementById('outlinerPanel');
    if (viewport) {
      autoFitCanvasToViewport(true);

      if (window.ResizeObserver) {
        const ro = new ResizeObserver(() => {
          // Synchronize outlinerPanel height to exactly match canvasViewport
          if (outliner) {
            outliner.style.height = `${viewport.clientHeight}px`;
          }

          if (!isUserExpanded) {
            autoFitCanvasToViewport(true);
          } else {
            const vpWidth = Math.floor(viewport.clientWidth);
            const vpHeight = Math.floor(viewport.clientHeight);
            if (vpWidth > currentCanvasWidth || vpHeight > currentCanvasHeight) {
              currentCanvasWidth = Math.max(currentCanvasWidth, vpWidth);
              currentCanvasHeight = Math.max(currentCanvasHeight, vpHeight);
              applyCanvasDimensions();
            }
          }
        });
        ro.observe(viewport);
      }
    }
  }

  function toggleSnapGrid() {
    snapToGrid = !snapToGrid;
    const btn = document.getElementById('snapToggleBtn');
    if (btn) {
      btn.innerText = snapToGrid ? '🧲 Snap: ON (20px)' : '🔓 Snap: OFF';
      btn.className = snapToGrid
        ? 'action-btn bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 shadow-sm'
        : 'action-btn bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700 shadow-sm';
    }
  }

  function toggleAnimations() {
    animationsActive = !animationsActive;
    const spinTargets = document.querySelectorAll('.spin-target');
    const flowTargets = document.querySelectorAll('.flow-target');
    const btn = document.getElementById('animToggleBtn');

    spinTargets.forEach(el => el.classList.toggle('spin-active', animationsActive));
    flowTargets.forEach(el => el.classList.toggle('flow-active', animationsActive));
    if (btn) {
      btn.innerText = animationsActive ? '⚡ Anim: ACTIVE' : '⏸️ Anim: PAUSED';
    }
  }

  // MAIN INTERACTION HANDLERS (Drag, Connect & Move)
  function startInteraction(e) {
    const handle = e.target.closest('.pipe-handle');
    const item = e.target.closest('.draggable-item');

    if (handle) {
      const pipeGroup = handle.closest('.pipe-item');
      selectElement(pipeGroup);
      isDragging = true;
      dragTarget = pipeGroup;
      activeHandle = handle;

      if (handle.classList.contains('handle-start')) {
        dragMode = 'pipe-handle-start';
      } else if (handle.classList.contains('handle-end')) {
        dragMode = 'pipe-handle-end';
      } else if (handle.classList.contains('handle-mid')) {
        dragMode = 'pipe-handle-mid';
      }

      const CTM = svgCanvas.getScreenCTM();
      startMouseX = (e.clientX - CTM.e) / CTM.a;
      startMouseY = (e.clientY - CTM.f) / CTM.d;

      startLineX1 = parseFloat(pipeGroup.getAttribute('data-x1'));
      startLineY1 = parseFloat(pipeGroup.getAttribute('data-y1'));
      startLineX2 = parseFloat(pipeGroup.getAttribute('data-x2'));
      startLineY2 = parseFloat(pipeGroup.getAttribute('data-y2'));
      return;
    }

    if (item) {
      selectElement(item);
      isDragging = true;
      dragTarget = item;
      const type = item.getAttribute('data-type');

      const CTM = svgCanvas.getScreenCTM();
      startMouseX = (e.clientX - CTM.e) / CTM.a;
      startMouseY = (e.clientY - CTM.f) / CTM.d;

      if (type === 'comp') {
        dragMode = 'comp';
        startElemX = parseFloat(item.getAttribute('data-x')) || 0;
        startElemY = parseFloat(item.getAttribute('data-y')) || 0;
      } else if (type === 'pipe') {
        dragMode = 'pipe-body';
        startLineX1 = parseFloat(item.getAttribute('data-x1'));
        startLineY1 = parseFloat(item.getAttribute('data-y1'));
        startLineX2 = parseFloat(item.getAttribute('data-x2'));
        startLineY2 = parseFloat(item.getAttribute('data-y2'));
      }
      return;
    }

    deselectAll();
  }

  // Generate Smooth 90-Degree Orthogonal Route Between (x1, y1) and (x2, y2) with configurable Mid-Step
  function generateOrthogonalPath(x1, y1, x2, y2, customMidX = null) {
    const dx = x2 - x1;
    const dy = y2 - y1;

    // Straight horizontal or vertical line
    if (Math.abs(dx) < 1 || Math.abs(dy) < 1) {
      return {
        d: `M ${x1} ${y1} L ${x2} ${y2}`,
        midX: (x1 + x2) / 2,
        midY: (y1 + y2) / 2,
        hasBend: false
      };
    }

    // 90-degree Step routing (X-first mid-step)
    let midX = customMidX !== null ? customMidX : (x1 + dx / 2);

    return {
      d: `M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y2} L ${x2} ${y2}`,
      midX: midX,
      midY: (y1 + y2) / 2,
      hasBend: true
    };
  }

  function handleInteraction(e) {
    if (!isDragging || !dragTarget) return;

    const CTM = svgCanvas.getScreenCTM();
    const currentMouseX = (e.clientX - CTM.e) / CTM.a;
    const currentMouseY = (e.clientY - CTM.f) / CTM.d;

    let dx = currentMouseX - startMouseX;
    let dy = currentMouseY - startMouseY;

    if (dragMode === 'comp') {
      let newX = startElemX + dx;
      let newY = startElemY + dy;

      if (snapToGrid) {
        newX = Math.round(newX / GRID_SIZE) * GRID_SIZE;
        newY = Math.round(newY / GRID_SIZE) * GRID_SIZE;
      }

      const rot = dragTarget.getAttribute('data-rot') || 0;
      const scale = dragTarget.getAttribute('data-scale') || 1;
      dragTarget.setAttribute('data-x', newX);
      dragTarget.setAttribute('data-y', newY);
      dragTarget.setAttribute('transform', `translate(${newX}, ${newY}) rotate(${rot}) scale(${scale})`);

      // Update all connected orthogonal pipes in real-time
      updateConnectedPipes(dragTarget.id);
    } 
    else if (dragMode === 'pipe-body') {
      let x1 = startLineX1 + dx;
      let y1 = startLineY1 + dy;
      let x2 = startLineX2 + dx;
      let y2 = startLineY2 + dy;

      if (snapToGrid) {
        x1 = Math.round(x1 / GRID_SIZE) * GRID_SIZE;
        y1 = Math.round(y1 / GRID_SIZE) * GRID_SIZE;
        x2 = Math.round(x2 / GRID_SIZE) * GRID_SIZE;
        y2 = Math.round(y2 / GRID_SIZE) * GRID_SIZE;
      }

      // Detach connections if dragging the whole pipe body freely
      dragTarget.setAttribute('data-start-conn', '');
      dragTarget.setAttribute('data-end-conn', '');

      updatePipePosition(dragTarget, x1, y1, x2, y2);
    } 
    else if (dragMode === 'pipe-handle-start' || dragMode === 'pipe-handle-end') {
      let targetX = (dragMode === 'pipe-handle-start' ? startLineX1 : startLineX2) + dx;
      let targetY = (dragMode === 'pipe-handle-start' ? startLineY1 : startLineY2) + dy;

      if (snapToGrid) {
        targetX = Math.round(targetX / GRID_SIZE) * GRID_SIZE;
        targetY = Math.round(targetY / GRID_SIZE) * GRID_SIZE;
      }

      // Port Snapping Logic (Auto-snap pipe endpoint to Component Port within 25px)
      const closestPort = findClosestPort(targetX, targetY);
      if (closestPort) {
        targetX = closestPort.x;
        targetY = closestPort.y;
        if (dragMode === 'pipe-handle-start') {
          dragTarget.setAttribute('data-start-conn', `${closestPort.compId}:${closestPort.portName}`);
        } else {
          dragTarget.setAttribute('data-end-conn', `${closestPort.compId}:${closestPort.portName}`);
        }
      } else {
        if (dragMode === 'pipe-handle-start') {
          dragTarget.setAttribute('data-start-conn', '');
        } else {
          dragTarget.setAttribute('data-end-conn', '');
        }
      }

      let x1 = dragMode === 'pipe-handle-start' ? targetX : parseFloat(dragTarget.getAttribute('data-x1'));
      let y1 = dragMode === 'pipe-handle-start' ? targetY : parseFloat(dragTarget.getAttribute('data-y1'));
      let x2 = dragMode === 'pipe-handle-end' ? targetX : parseFloat(dragTarget.getAttribute('data-x2'));
      let y2 = dragMode === 'pipe-handle-end' ? targetY : parseFloat(dragTarget.getAttribute('data-y2'));

      updatePipePosition(dragTarget, x1, y1, x2, y2);
    }
    else if (dragMode === 'pipe-handle-mid') {
      let midX = currentMouseX;
      if (snapToGrid) {
        midX = Math.round(midX / GRID_SIZE) * GRID_SIZE;
      }
      dragTarget.setAttribute('data-mid-offset', midX);
      let x1 = parseFloat(dragTarget.getAttribute('data-x1'));
      let y1 = parseFloat(dragTarget.getAttribute('data-y1'));
      let x2 = parseFloat(dragTarget.getAttribute('data-x2'));
      let y2 = parseFloat(dragTarget.getAttribute('data-y2'));
      updatePipePosition(dragTarget, x1, y1, x2, y2, midX);
    }
  }

  function endInteraction() {
    isDragging = false;
    dragTarget = null;
    activeHandle = null;
    dragMode = null;
  }

  function updatePipePosition(pipeGroup, x1, y1, x2, y2, customMid = null) {
    pipeGroup.setAttribute('data-x1', x1);
    pipeGroup.setAttribute('data-y1', y1);
    pipeGroup.setAttribute('data-x2', x2);
    pipeGroup.setAttribute('data-y2', y2);

    let midOffset = customMid;
    if (midOffset === null) {
      const stored = pipeGroup.getAttribute('data-mid-offset');
      if (stored && stored !== '') {
        midOffset = parseFloat(stored);
      }
    }

    const route = generateOrthogonalPath(x1, y1, x2, y2, midOffset);

    const paths = pipeGroup.querySelectorAll('path');
    paths.forEach(p => {
      p.setAttribute('d', route.d);
    });

    const handleStart = pipeGroup.querySelector('.handle-start');
    const handleEnd = pipeGroup.querySelector('.handle-end');
    const handleMid = pipeGroup.querySelector('.handle-mid');

    if (handleStart) { handleStart.setAttribute('cx', x1); handleStart.setAttribute('cy', y1); }
    if (handleEnd) { handleEnd.setAttribute('cx', x2); handleEnd.setAttribute('cy', y2); }

    if (handleMid) {
      if (route.hasBend) {
        handleMid.setAttribute('cx', route.midX);
        handleMid.setAttribute('cy', route.midY);
        handleMid.style.display = 'block';
      } else {
        handleMid.style.display = 'none';
      }
    }
  }

  // Update all pipes connected to a given component ID
  function updateConnectedPipes(compId) {
    const pipes = document.querySelectorAll('.pipe-item');
    pipes.forEach(pipe => {
      const startConn = pipe.getAttribute('data-start-conn') || '';
      const endConn = pipe.getAttribute('data-end-conn') || '';

      let x1 = parseFloat(pipe.getAttribute('data-x1'));
      let y1 = parseFloat(pipe.getAttribute('data-y1'));
      let x2 = parseFloat(pipe.getAttribute('data-x2'));
      let y2 = parseFloat(pipe.getAttribute('data-y2'));
      let changed = false;

      if (startConn.startsWith(compId + ':')) {
        const portName = startConn.split(':')[1];
        const portPos = getComponentPortWorldPos(compId, portName);
        if (portPos) {
          x1 = portPos.x;
          y1 = portPos.y;
          changed = true;
        }
      }

      if (endConn.startsWith(compId + ':')) {
        const portName = endConn.split(':')[1];
        const portPos = getComponentPortWorldPos(compId, portName);
        if (portPos) {
          x2 = portPos.x;
          y2 = portPos.y;
          changed = true;
        }
      }

      if (changed) {
        updatePipePosition(pipe, x1, y1, x2, y2);
      }
    });
  }

  // Get current world coordinates of a specific port on a component
  function getComponentPortWorldPos(compId, portName) {
    const comp = document.getElementById(compId);
    if (!comp) return null;

    const compX = parseFloat(comp.getAttribute('data-x')) || 0;
    const compY = parseFloat(comp.getAttribute('data-y')) || 0;
    const compRotDeg = parseFloat(comp.getAttribute('data-rot')) || 0;
    const compScale = parseFloat(comp.getAttribute('data-scale')) || 1.0;
    const compRotRad = (compRotDeg * Math.PI) / 180;

    const port = comp.querySelector(`.port-dot[data-port="${portName}"]`);
    if (!port) return null;

    const portLocalX = parseFloat(port.getAttribute('cx')) || 0;
    const portLocalY = parseFloat(port.getAttribute('cy')) || 0;

    const scaledX = portLocalX * compScale;
    const scaledY = portLocalY * compScale;

    const rotatedX = scaledX * Math.cos(compRotRad) - scaledY * Math.sin(compRotRad);
    const rotatedY = scaledX * Math.sin(compRotRad) + scaledY * Math.cos(compRotRad);

    return {
      x: Math.round((compX + rotatedX) * 10) / 10,
      y: Math.round((compY + rotatedY) * 10) / 10
    };
  }

  // Find Closest Component Connection Port (Accounting for Component Position, Rotation, and Scale)
  function findClosestPort(x, y) {
    const compItems = document.querySelectorAll('.comp-item');
    let minDistance = 25; // 25px snap radius
    let snappedPort = null;

    compItems.forEach(comp => {
      const compId = comp.id;
      const compX = parseFloat(comp.getAttribute('data-x')) || 0;
      const compY = parseFloat(comp.getAttribute('data-y')) || 0;
      const compRotDeg = parseFloat(comp.getAttribute('data-rot')) || 0;
      const compScale = parseFloat(comp.getAttribute('data-scale')) || 1.0;
      const compRotRad = (compRotDeg * Math.PI) / 180;

      const ports = comp.querySelectorAll('.port-dot');
      ports.forEach(port => {
        const portName = port.getAttribute('data-port') || '';
        const portLocalX = parseFloat(port.getAttribute('cx')) || 0;
        const portLocalY = parseFloat(port.getAttribute('cy')) || 0;

        const scaledX = portLocalX * compScale;
        const scaledY = portLocalY * compScale;

        const rotatedX = scaledX * Math.cos(compRotRad) - scaledY * Math.sin(compRotRad);
        const rotatedY = scaledX * Math.sin(compRotRad) + scaledY * Math.cos(compRotRad);

        const absolutePortX = compX + rotatedX;
        const absolutePortY = compY + rotatedY;

        const dist = Math.hypot(x - absolutePortX, y - absolutePortY);
        if (dist < minDistance) {
          minDistance = dist;
          snappedPort = {
            x: Math.round(absolutePortX * 10) / 10,
            y: Math.round(absolutePortY * 10) / 10,
            compId: compId,
            portName: portName
          };
        }
      });
    });

    return snappedPort;
  }

  // Component Resizing (Scale)
  function scaleSelected(factor) {
    if (!selectedElement || selectedElement.getAttribute('data-type') !== 'comp') {
      return;
    }
    let currentScale = parseFloat(selectedElement.getAttribute('data-scale')) || 1.0;
    let newScale = Math.max(0.4, Math.min(2.5, currentScale * factor));
    newScale = Math.round(newScale * 100) / 100;

    selectedElement.setAttribute('data-scale', newScale);
    const x = selectedElement.getAttribute('data-x');
    const y = selectedElement.getAttribute('data-y');
    const rot = selectedElement.getAttribute('data-rot') || 0;

    selectedElement.setAttribute('transform', `translate(${x}, ${y}) rotate(${rot}) scale(${newScale})`);

    // Counter-scale port dots so they always remain constant 4.5px radius & 1.5px stroke
    const ports = selectedElement.querySelectorAll('.port-dot');
    ports.forEach(port => {
      port.setAttribute('r', (4.5 / newScale).toFixed(2));
      port.setAttribute('stroke-width', (1.5 / newScale).toFixed(2));
    });

    // Update connected orthogonal pipes
    updateConnectedPipes(selectedElement.id);
  }

  // Independent Component Text Label Sizing
  function scaleSelectedText(factor) {
    if (!selectedElement || selectedElement.getAttribute('data-type') !== 'comp') {
      return;
    }
    const texts = selectedElement.querySelectorAll('text');
    if (texts.length === 0) {
      return;
    }

    let currentTextScale = parseFloat(selectedElement.getAttribute('data-text-scale')) || 1.0;
    let newTextScale = Math.max(0.4, Math.min(3.0, currentTextScale * factor));
    newTextScale = Math.round(newTextScale * 100) / 100;
    selectedElement.setAttribute('data-text-scale', newTextScale);

    texts.forEach(t => {
      if (!t.getAttribute('data-base-size')) {
        const originalFs = parseFloat(t.getAttribute('font-size')) || 9;
        t.setAttribute('data-base-size', originalFs);
      }
      const baseSize = parseFloat(t.getAttribute('data-base-size'));
      const newFs = (baseSize * newTextScale).toFixed(1);
      t.setAttribute('font-size', newFs);
    });
  }

  // Edit Component or Static Text Content
  function editSelectedText() {
    if (!selectedElement || selectedElement.getAttribute('data-type') !== 'comp') {
      return;
    }
    const texts = selectedElement.querySelectorAll('text');
    if (texts.length === 0) {
      return;
    }

    // If single text element, prompt directly
    if (texts.length === 1) {
      const currentVal = texts[0].textContent;
      const newVal = prompt('Edit Text Label:', currentVal);
      if (newVal !== null && newVal.trim() !== '') {
        texts[0].textContent = newVal.trim();
        if (window.refreshOutliner) window.refreshOutliner();
      }
      return;
    }

    // If multiple text elements (e.g., TT 101 or Telemetry), prompt for each
    let updatedCount = 0;
    texts.forEach((t, idx) => {
      const currentVal = t.textContent;
      const newVal = prompt(`Edit Label Line #${idx + 1}:`, currentVal);
      if (newVal !== null && newVal.trim() !== '') {
        t.textContent = newVal.trim();
        updatedCount++;
      }
    });
    if (updatedCount > 0 && window.refreshOutliner) {
      window.refreshOutliner();
    }
  }

  function rotateSelected() {
    if (!selectedElement || selectedElement.getAttribute('data-type') !== 'comp') {
      return;
    }
    let rot = (parseInt(selectedElement.getAttribute('data-rot')) || 0) + 90;
    if (rot >= 360) rot = 0;
    selectedElement.setAttribute('data-rot', rot);
    const x = selectedElement.getAttribute('data-x');
    const y = selectedElement.getAttribute('data-y');
    const scale = selectedElement.getAttribute('data-scale') || 1;
    selectedElement.setAttribute('transform', `translate(${x}, ${y}) rotate(${rot}) scale(${scale})`);

    // Update connected orthogonal pipes
    updateConnectedPipes(selectedElement.id);
  }

  function updateSelectionControls() {
    const rotateBtn = document.getElementById('rotateBtn');
    const sizeUpBtn = document.getElementById('sizeUpBtn');
    const sizeDownBtn = document.getElementById('sizeDownBtn');
    const editTextBtn = document.getElementById('editTextBtn');
    const textSizeUpBtn = document.getElementById('textSizeUpBtn');
    const textSizeDownBtn = document.getElementById('textSizeDownBtn');
    const deleteBtn = document.getElementById('deleteBtn');

    if (!selectedElement) {
      if (rotateBtn) rotateBtn.disabled = true;
      if (sizeUpBtn) sizeUpBtn.disabled = true;
      if (sizeDownBtn) sizeDownBtn.disabled = true;
      if (editTextBtn) editTextBtn.disabled = true;
      if (textSizeUpBtn) textSizeUpBtn.disabled = true;
      if (textSizeDownBtn) textSizeDownBtn.disabled = true;
      if (deleteBtn) deleteBtn.disabled = true;
    } else {
      const isComp = selectedElement.getAttribute('data-type') === 'comp';
      const hasText = isComp && selectedElement.querySelectorAll('text').length > 0;

      if (rotateBtn) rotateBtn.disabled = !isComp;
      if (sizeUpBtn) sizeUpBtn.disabled = !isComp;
      if (sizeDownBtn) sizeDownBtn.disabled = !isComp;
      if (editTextBtn) editTextBtn.disabled = !hasText;
      if (textSizeUpBtn) textSizeUpBtn.disabled = !hasText;
      if (textSizeDownBtn) textSizeDownBtn.disabled = !hasText;
      if (deleteBtn) deleteBtn.disabled = false;
    }
  }

  function selectElement(elem) {
    deselectAll();
    selectedElement = elem;
    selectedElement.classList.add('selected');
    updateSelectionControls();
    if (window.refreshOutliner) window.refreshOutliner();
  }

  function deselectAll() {
    document.querySelectorAll('.draggable-item').forEach(el => el.classList.remove('selected'));
    selectedElement = null;
    updateSelectionControls();
    if (window.refreshOutliner) window.refreshOutliner();
  }

  function deleteSelected() {
    if (!selectedElement) {
      return;
    }
    const deletedId = selectedElement.id;
    const isComp = selectedElement.getAttribute('data-type') === 'comp';

    selectedElement.remove();
    selectedElement = null;
    updateSelectionControls();

    // Clear connection references on pipes if component was deleted
    if (isComp) {
      document.querySelectorAll('.pipe-item').forEach(pipe => {
        if ((pipe.getAttribute('data-start-conn') || '').startsWith(deletedId + ':')) {
          pipe.setAttribute('data-start-conn', '');
        }
        if ((pipe.getAttribute('data-end-conn') || '').startsWith(deletedId + ':')) {
          pipe.setAttribute('data-end-conn', '');
        }
      });
    }

    if (window.refreshOutliner) window.refreshOutliner();
  }

  // Add New Pipe Loops (Orthogonal CAD Pipe Routing)
  function addPipeLoop(colorType) {
    const container = document.getElementById('sandboxPipesContainer');
    const newId = 'pipe-' + (itemIdCounter++);
    const color = colorType === 'cold' ? '#38bdf8' : '#ef4444';
    const mainColor = colorType === 'cold' ? '#0284c7' : '#b91c1c';

    const yPos = 220 + Math.floor(Math.random() * 80);
    const dPath = generateOrthogonalPath(140, yPos, 440, yPos);

    const pipeMarkup = `
      <g id="${newId}" class="draggable-item pipe-item" data-type="pipe" data-x1="140" data-y1="${yPos}" data-x2="440" data-y2="${yPos}" data-color="${color}" data-start-conn="" data-end-conn="" data-mid-offset="">
        <path d="${dPath.d}" stroke="${mainColor}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round" class="pipe-base-path"/>
        <path d="${dPath.d}" stroke="${color}" stroke-width="2" fill="none" class="${animationsActive ? 'flow-target flow-active pipe-flow-path' : 'flow-target pipe-flow-path'}" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="140" cy="${yPos}" r="5" fill="${color}" class="pipe-handle handle-start cursor-move"/>
        <circle cx="290" cy="${yPos}" r="4.5" fill="#ffffff" stroke="${color}" stroke-width="2" class="pipe-handle handle-mid" style="display: ${dPath.hasBend ? 'block' : 'none'};"/>
        <circle cx="440" cy="${yPos}" r="5" fill="${color}" class="pipe-handle handle-end cursor-move"/>
      </g>`;

    container.insertAdjacentHTML('beforeend', pipeMarkup);
    if (window.refreshOutliner) window.refreshOutliner();
  }

  // Add New Symbols with Multi-Variant Graphic Support via CDU_COMPONENTS Registry
  function addSandboxItem(type, variant = null) {
    const container = document.getElementById('sandboxItemsContainer');
    const newId = 'item-' + (itemIdCounter++);
    const xPos = 200 + Math.floor(Math.random() * 300);
    const yPos = 220;

    let markup = '';

    // Lookup in CDU_COMPONENTS registry
    if (window.CDU_COMPONENTS) {
      // Find matching definition
      let compDef = null;
      for (const k in window.CDU_COMPONENTS) {
        const item = window.CDU_COMPONENTS[k];
        if (item.type === type && (!variant || item.variant === variant)) {
          compDef = item;
          break;
        }
      }

      if (compDef && typeof compDef.renderCanvas === 'function') {
        markup = compDef.renderCanvas(newId, xPos, yPos, 0, 1, animationsActive);
      }
    }

    // Fallback if not found in registry
    if (!markup) {
      markup = `<g id="${newId}" transform="translate(${xPos}, ${yPos}) rotate(0) scale(1)" class="draggable-item comp-item" data-type="comp" data-x="${xPos}" data-y="${yPos}" data-rot="0" data-scale="1">
        <circle cx="0" cy="0" r="16" fill="#0f172a" stroke="#3b82f6" stroke-width="1.5"/>
        <text x="0" y="26" text-anchor="middle" fill="#94a3b8" font-size="8" font-weight="bold">${type.toUpperCase()}</text>
        <circle cx="-16" cy="0" r="4.5" class="port-dot" data-port="in"/>
        <circle cx="16" cy="0" r="4.5" class="port-dot" data-port="out"/>
      </g>`;
    }

    container.insertAdjacentHTML('beforeend', markup);
    if (window.refreshOutliner) window.refreshOutliner();
  }

  function clearSandbox() {
    document.getElementById('sandboxItemsContainer').innerHTML = '';
    document.getElementById('sandboxPipesContainer').innerHTML = '';
    deselectAll();
    if (window.refreshOutliner) window.refreshOutliner();
  }

  function autoFitCanvasToViewport(force = false) {
    const viewport = document.getElementById('canvasViewport');
    if (!viewport) return;

    const vpWidth = Math.max(600, Math.floor(viewport.clientWidth));
    const vpHeight = Math.max(360, Math.floor(viewport.clientHeight));

    if (force || !isUserExpanded) {
      currentCanvasWidth = vpWidth;
      currentCanvasHeight = vpHeight;
      isUserExpanded = false;
    } else {
      currentCanvasWidth = Math.max(currentCanvasWidth, vpWidth);
      currentCanvasHeight = Math.max(currentCanvasHeight, vpHeight);
    }

    applyCanvasDimensions();
  }

  function resizeCanvas(deltaW, deltaH) {
    const viewport = document.getElementById('canvasViewport');
    const minW = viewport ? Math.max(600, Math.floor(viewport.clientWidth)) : 800;
    const minH = viewport ? Math.max(360, Math.floor(viewport.clientHeight)) : 400;

    currentCanvasWidth = Math.max(minW, Math.min(4000, currentCanvasWidth + deltaW));
    currentCanvasHeight = Math.max(minH, Math.min(3000, currentCanvasHeight + deltaH));

    isUserExpanded = (currentCanvasWidth > minW || currentCanvasHeight > minH);

    applyCanvasDimensions();
  }

  function resetCanvasSize() {
    isUserExpanded = false;
    autoFitCanvasToViewport(true);
  }

  function applyCanvasDimensions() {
    const svg = document.getElementById('sandboxCanvas');
    const bgRect = document.getElementById('gridBackgroundRect');
    const badge = document.getElementById('canvasDimensionBadge');
    if (svg) {
      svg.setAttribute('width', currentCanvasWidth);
      svg.setAttribute('height', currentCanvasHeight);
      svg.setAttribute('viewBox', `0 0 ${currentCanvasWidth} ${currentCanvasHeight}`);
      svg.style.width = `${currentCanvasWidth}px`;
      svg.style.height = `${currentCanvasHeight}px`;
    }
    if (bgRect) {
      bgRect.setAttribute('width', currentCanvasWidth);
      bgRect.setAttribute('height', currentCanvasHeight);
    }
    if (badge) {
      badge.innerText = `${currentCanvasWidth}x${currentCanvasHeight}`;
    }
  }

  function copySnippet(btn) {
    const snippet = btn.getAttribute('data-snippet');
    if (snippet) {
      navigator.clipboard.writeText(snippet).then(() => {
        showToast('SVG component code snippet copied to clipboard!');
      });
    }
  }

  function showToast(msg) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    if (!toast || !toastMsg) return;
    toastMsg.innerText = msg;
    toast.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => {
      toast.classList.add('translate-y-20', 'opacity-0');
    }, 2500);
  }

  function filterCategory(cat) {
    const cards = document.querySelectorAll('.component-card');
    const buttons = document.querySelectorAll('.cat-btn');

    buttons.forEach(btn => {
      if (btn.getAttribute('data-cat') === cat) {
        btn.className = 'cat-btn px-4 py-1.5 text-xs font-medium rounded-lg bg-blue-600 text-white transition';
      } else {
        btn.className = 'cat-btn px-4 py-1.5 text-xs font-medium rounded-lg text-[var(--muted-foreground,#94a3b8)] hover:text-white transition';
      }
    });

    cards.forEach(card => {
      if (cat === 'all' || card.classList.contains('cat-' + cat)) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  // Exports to global window
  window.initCadEngine = initCadEngine;
  window.toggleSnapGrid = toggleSnapGrid;
  window.toggleAnimations = toggleAnimations;
  window.scaleSelected = scaleSelected;
  window.scaleSelectedText = scaleSelectedText;
  window.editSelectedText = editSelectedText;
  window.rotateSelected = rotateSelected;
  window.deleteSelected = deleteSelected;
  window.addPipeLoop = addPipeLoop;
  window.addSandboxItem = addSandboxItem;
  window.clearSandbox = clearSandbox;
  window.autoFitCanvasToViewport = autoFitCanvasToViewport;
  window.resizeCanvas = resizeCanvas;
  window.resetCanvasSize = resetCanvasSize;
  window.applyCanvasDimensions = applyCanvasDimensions;
  window.copySnippet = copySnippet;
  window.showToast = showToast;
  window.filterCategory = filterCategory;
  window.generateOrthogonalPath = generateOrthogonalPath;
  window.getCanvasDimensions = () => ({ width: currentCanvasWidth, height: currentCanvasHeight });
  window.setCanvasDimensions = (w, h) => {
    currentCanvasWidth = w;
    currentCanvasHeight = h;
    applyCanvasDimensions();
  };

  // Run on DOM loaded
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initCadEngine);
  } else {
    initCadEngine();
  }

})(window);
