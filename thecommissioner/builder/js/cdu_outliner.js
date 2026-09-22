/**
 * CDU Schematic CAD Builder - Component Outliner & Z-Order Layer Manager
 * Tracks all canvas elements, handles SVG DOM z-order reordering (Bring to Front,
 * Send to Back, Move Up/Down), bi-directional selection, and visibility toggling.
 * Compatible with Windows, Linux, and macOS.
 */

(function(window) {
  'use strict';

  let isOutlinerVisible = true;

  function initOutliner() {
    refreshOutliner();
  }

  function toggleOutlinerCollapse() {
    const panel = document.getElementById('outlinerPanel');
    const toggleBtn = document.getElementById('toggleOutlinerBtn');
    if (!panel) return;

    isOutlinerVisible = !isOutlinerVisible;

    if (isOutlinerVisible) {
      panel.style.display = 'flex';
      if (toggleBtn) {
        toggleBtn.classList.add('text-sky-400');
        toggleBtn.classList.remove('text-slate-400');
      }
    } else {
      panel.style.display = 'none';
      if (toggleBtn) {
        toggleBtn.classList.remove('text-sky-400');
        toggleBtn.classList.add('text-slate-400');
      }
    }

    // When toggling panel visibility, auto-fit canvas width so it takes up newly freed space smoothly
    if (window.autoFitCanvasToViewport) {
      setTimeout(() => {
        window.autoFitCanvasToViewport(true);
      }, 50);
    }
  }

  /**
   * Scans all .draggable-item elements across pipes and components.
   * In SVG, DOM order dictates z-index:
   *  - First child in DOM is at the very back (bottom layer).
   *  - Last child in DOM is at the very front (top layer).
   * Outliner presents top layer at the top of the UI list.
   */
  function getAllCanvasItemsInZOrder() {
    const pipesContainer = document.getElementById('sandboxPipesContainer');
    const itemsContainer = document.getElementById('sandboxItemsContainer');
    const canvas = document.getElementById('sandboxCanvas');
    if (!canvas) return [];

    // Collect all draggable items currently attached to canvas containers
    const items = Array.from(canvas.querySelectorAll('.draggable-item'));
    return items;
  }

  function getElementFriendlyInfo(elem) {
    const type = elem.getAttribute('data-type'); // 'comp' or 'pipe'
    const id = elem.id || 'unknown';

    if (type === 'pipe') {
      const color = elem.getAttribute('data-color') || '';
      const isCold = color.includes('38bdf8') || color.includes('0284c7');
      return {
        id: id,
        icon: isCold ? '🌊' : '🔥',
        category: 'Pipe',
        label: isCold ? `Cold Pipe (${id})` : `Hot Pipe (${id})`,
        elem: elem
      };
    }

    // Component
    const textNodes = elem.querySelectorAll('text');
    let label = '';
    if (textNodes.length > 0) {
      label = Array.from(textNodes).map(t => t.textContent.trim()).filter(Boolean).join(' ');
    }
    if (!label) label = id;

    // Detect icon from content
    let icon = '📦';
    if (elem.querySelector('polygon') && elem.querySelector('circle')) icon = '⚙️'; // pump / check valve
    else if (elem.innerHTML.includes('HEAT_EXCHANGER') || elem.innerHTML.includes('PHE')) icon = '🔄';
    else if (elem.innerHTML.includes('VALVE') || elem.innerHTML.includes('CV-')) icon = '🔀';
    else if (elem.innerHTML.includes('TT') || elem.innerHTML.includes('PT') || elem.innerHTML.includes('DPT') || elem.innerHTML.includes('FT') || elem.innerHTML.includes('CT')) icon = '📡';
    else if (elem.innerHTML.includes('TANK') || elem.innerHTML.includes('EXP_TANK')) icon = '🛢️';
    else if (elem.innerHTML.includes('FAN')) icon = '🌀';
    else if (elem.innerHTML.includes('AIR VENT')) icon = '💨';
    else if (elem.innerHTML.includes('FILTER') || elem.innerHTML.includes('STRAINER')) icon = '⚡';
    else if (elem.innerHTML.includes('VACUUM') || elem.innerHTML.includes('CHAMBER')) icon = '🔬';
    else if (elem.innerHTML.includes('ZONE')) icon = '🔲';
    else if (textNodes.length > 0) icon = '🏷️';

    return {
      id: id,
      icon: icon,
      category: 'Component',
      label: label,
      elem: elem
    };
  }

  function refreshOutliner() {
    const listContainer = document.getElementById('outlinerList');
    const countBadge = document.getElementById('outlinerLayerCountBadge');
    const headerCount = document.getElementById('outlinerHeaderCount');
    if (!listContainer) return;

    const allItems = getAllCanvasItemsInZOrder();
    const count = allItems.length;

    if (countBadge) countBadge.innerText = count;
    if (headerCount) headerCount.innerText = `(${count})`;

    if (count === 0) {
      listContainer.innerHTML = `
        <div class="p-6 text-center text-xs text-slate-500 flex flex-col items-center gap-2">
          <span>📭</span>
          <span>No items on canvas.<br>Add components or pipes to see layers here.</span>
        </div>`;
      updateLayerActionButtons(null);
      return;
    }

    // SVG elements rendered later in DOM are visually on top.
    // Display top layer first in the Outliner list:
    const reversedItems = [...allItems].reverse();

    let html = '';
    reversedItems.forEach((elem, index) => {
      const info = getElementFriendlyInfo(elem);
      const isSelected = elem.classList.contains('selected');
      const isHidden = elem.style.display === 'none';

      html += `
        <div class="outliner-row ${isSelected ? 'selected' : ''} ${isHidden ? 'hidden-item' : ''}" 
             data-id="${info.id}" 
             onclick="handleOutlinerItemClick('${info.id}', event)">
          <div class="flex items-center gap-2 min-w-0 flex-1">
            <span class="text-sm shrink-0">${info.icon}</span>
            <span class="truncate text-xs font-mono select-none" title="${info.label}">${info.label}</span>
          </div>
          <div class="flex items-center gap-1 shrink-0 ml-1">
            <button onclick="toggleItemVisibility('${info.id}', event)" class="outliner-btn-mini" title="${isHidden ? 'Show Layer' : 'Hide Layer'}">
              ${isHidden ? '🕶️' : '👁️'}
            </button>
            <button onclick="handleOutlinerItemDelete('${info.id}', event)" class="outliner-btn-mini hover:text-red-400" title="Delete Layer">
              ✕
            </button>
          </div>
        </div>`;
    });

    listContainer.innerHTML = html;

    const selectedElem = document.querySelector('.draggable-item.selected');
    updateLayerActionButtons(selectedElem);
  }

  function handleOutlinerItemClick(id, event) {
    if (event) event.stopPropagation();
    const elem = document.getElementById(id);
    if (!elem) return;

    if (window.selectElement) {
      window.selectElement(elem);
    } else {
      document.querySelectorAll('.draggable-item').forEach(el => el.classList.remove('selected'));
      elem.classList.add('selected');
    }
    refreshOutliner();
  }

  function handleOutlinerItemDelete(id, event) {
    if (event) event.stopPropagation();
    const elem = document.getElementById(id);
    if (!elem) return;

    if (window.selectElement) window.selectElement(elem);
    if (window.deleteSelected) window.deleteSelected();
    refreshOutliner();
  }

  function toggleItemVisibility(id, event) {
    if (event) event.stopPropagation();
    const elem = document.getElementById(id);
    if (!elem) return;

    const isHidden = elem.style.display === 'none';
    elem.style.display = isHidden ? '' : 'none';
    refreshOutliner();
  }

  // ==========================================
  // Z-ORDER SHIFTING LOGIC (DOM Reordering)
  // ==========================================
  function getSelectedElement() {
    return document.querySelector('.draggable-item.selected');
  }

  function bringSelectedToFront() {
    const elem = getSelectedElement();
    if (!elem || !elem.parentNode) {
      if (window.showToast) window.showToast('Select an item first to reorder layers.');
      return;
    }
    elem.parentNode.appendChild(elem);
    refreshOutliner();
  }

  function sendSelectedToBack() {
    const elem = getSelectedElement();
    if (!elem || !elem.parentNode) {
      if (window.showToast) window.showToast('Select an item first to reorder layers.');
      return;
    }
    const parent = elem.parentNode;
    const firstChild = parent.firstChild;
    if (firstChild && firstChild !== elem) {
      parent.insertBefore(elem, firstChild);
    }
    refreshOutliner();
  }

  function moveSelectedUp() {
    const elem = getSelectedElement();
    if (!elem || !elem.parentNode) return;

    // Moving "Up" in visual z-index means moving closer to the end of DOM children
    const nextSibling = elem.nextElementSibling;
    if (nextSibling) {
      elem.parentNode.insertBefore(nextSibling, elem);
      refreshOutliner();
    }
  }

  function moveSelectedDown() {
    const elem = getSelectedElement();
    if (!elem || !elem.parentNode) return;

    // Moving "Down" in visual z-index means moving earlier in DOM children
    const prevSibling = elem.previousElementSibling;
    if (prevSibling) {
      elem.parentNode.insertBefore(elem, prevSibling);
      refreshOutliner();
    }
  }

  function updateLayerActionButtons(selectedElem) {
    const btnTop = document.getElementById('layerBtnTop');
    const btnUp = document.getElementById('layerBtnUp');
    const btnDown = document.getElementById('layerBtnDown');
    const btnBottom = document.getElementById('layerBtnBottom');

    const hasSelection = Boolean(selectedElem);
    if (btnTop) btnTop.disabled = !hasSelection;
    if (btnUp) btnUp.disabled = !hasSelection;
    if (btnDown) btnDown.disabled = !hasSelection;
    if (btnBottom) btnBottom.disabled = !hasSelection;
  }

  // Keyboard shortcuts for quick layer reordering
  window.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
    const selected = getSelectedElement();
    if (!selected) return;

    if (e.ctrlKey && e.key === ']') {
      e.preventDefault();
      if (e.shiftKey) bringSelectedToFront();
      else moveSelectedUp();
    } else if (e.ctrlKey && e.key === '[') {
      e.preventDefault();
      if (e.shiftKey) sendSelectedToBack();
      else moveSelectedDown();
    }
  });

  // Export to window
  window.initOutliner = initOutliner;
  window.refreshOutliner = refreshOutliner;
  window.handleOutlinerItemClick = handleOutlinerItemClick;
  window.handleOutlinerItemDelete = handleOutlinerItemDelete;
  window.toggleItemVisibility = toggleItemVisibility;
  window.bringSelectedToFront = bringSelectedToFront;
  window.sendSelectedToBack = sendSelectedToBack;
  window.moveSelectedUp = moveSelectedUp;
  window.moveSelectedDown = moveSelectedDown;

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initOutliner);
  } else {
    initOutliner();
  }

})(window);
