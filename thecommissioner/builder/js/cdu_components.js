/**
 * CDU Schematic Component Definitions & Registry
 * Single Source of Truth for CDU Schematic CAD Builder
 * Compatible with Windows, Linux, and macOS in both browser file:// and HTTP servers.
 */

(function(window) {
  'use strict';

  const CDU_COMPONENTS = {
    // 1. Centrifugal Pump (Cross Blades)
    pump_cross: {
      type: 'pump',
      variant: 'cross',
      name: 'Centrifugal Pump',
      category: 'pumps',
      badge: 'PUMP · V1',
      description: 'Coolant circulating pump with spinning cross blades.',
      ports: [
        { name: 'in', cx: -18, cy: 0 },
        { name: 'out', cx: 18, cy: 0 }
      ],
      renderCanvas: function(id, x, y, rot, scale, anim) {
        return `<g id="${id}" transform="translate(${x}, ${y}) rotate(${rot}) scale(${scale})" class="draggable-item comp-item" data-type="comp" data-x="${x}" data-y="${y}" data-rot="${rot}" data-scale="${scale}">
          <circle cx="0" cy="0" r="18" fill="#0f172a" stroke="#3b82f6" stroke-width="1.5"/>
          <g class="${anim ? 'spin-target spin-active' : 'spin-target'}" style="transform-origin: 0px 0px;">
            <path d="M -12 0 L 12 0 M 0 -12 L 0 12" stroke="#3b82f6" stroke-width="2"/>
          </g>
          <text x="0" y="30" text-anchor="middle" fill="#94a3b8" font-size="9" font-weight="bold">PUMP_1</text>
          <circle cx="-18" cy="0" r="4.5" class="port-dot" data-port="in"/>
          <circle cx="18" cy="0" r="4.5" class="port-dot" data-port="out"/>
        </g>`;
      },
      previewSvg: `<svg width="90" height="70" viewBox="0 0 120 100">
        <circle cx="60" cy="45" r="22" fill="#0f172a" stroke="#3b82f6" stroke-width="2" />
        <g class="spin-target spin-active" style="transform-origin: 60px 45px;">
          <path d="M 45 45 H 75 M 60 30 V 60" stroke="#3b82f6" stroke-width="2.5" />
        </g>
        <line x1="15" y1="45" x2="38" y2="45" stroke="#38bdf8" stroke-width="3" />
        <line x1="82" y1="45" x2="105" y2="45" stroke="#38bdf8" stroke-width="3" />
        <text x="60" y="84" text-anchor="middle" fill="#94a3b8" font-size="9" font-weight="bold">PUMP_1</text>
      </svg>`,
      jsxSnippet: `<g className="pump-unit" transform="translate(X, Y)"><circle r="18" fill="#0f172a" stroke="#3b82f6" strokeWidth="1.5" /><g className="pump-spin" style={{ transformOrigin: "0 0" }}><path d="M -12 0 L 12 0 M 0 -12 L 0 12" stroke="#3b82f6" strokeWidth="2" /></g><text y="30" fill="#94a3b8" fontSize="9" fontWeight="bold" fontFamily="var(--font-header)" textAnchor="middle">PUMP_1</text></g>`
    },

    // 2. Impeller Pump (Triangular Rotor)
    pump_triangular: {
      type: 'pump',
      variant: 'triangular',
      name: 'Impeller Pump',
      category: 'pumps',
      badge: 'PUMP · V2',
      description: 'Direct-drive pump with spinning triangular impeller rotor.',
      ports: [
        { name: 'in', cx: -18, cy: 0 },
        { name: 'out', cx: 18, cy: 0 }
      ],
      renderCanvas: function(id, x, y, rot, scale, anim) {
        return `<g id="${id}" transform="translate(${x}, ${y}) rotate(${rot}) scale(${scale})" class="draggable-item comp-item" data-type="comp" data-x="${x}" data-y="${y}" data-rot="${rot}" data-scale="${scale}">
          <circle cx="0" cy="0" r="18" fill="#0f172a" stroke="#3b82f6" stroke-width="1.8"/>
          <polygon points="-6,-8 -6,8 10,0" fill="#3b82f6" class="${anim ? 'spin-target spin-active' : 'spin-target'}" style="transform-origin: 0px 0px;"/>
          <text x="0" y="30" text-anchor="middle" fill="#94a3b8" font-size="9" font-weight="bold">PUMP_2</text>
          <circle cx="-18" cy="0" r="4.5" class="port-dot" data-port="in"/>
          <circle cx="18" cy="0" r="4.5" class="port-dot" data-port="out"/>
        </g>`;
      },
      previewSvg: `<svg width="90" height="70" viewBox="0 0 120 100">
        <circle cx="60" cy="45" r="22" fill="#0f172a" stroke="#3b82f6" stroke-width="2" />
        <polygon points="53,34 53,56 71,45" fill="#3b82f6" class="spin-target spin-active" style="transform-origin: 60px 45px;" />
        <line x1="15" y1="45" x2="38" y2="45" stroke="#38bdf8" stroke-width="3" />
        <line x1="82" y1="45" x2="105" y2="45" stroke="#38bdf8" stroke-width="3" />
        <text x="60" y="84" text-anchor="middle" fill="#94a3b8" font-size="9" font-weight="bold">PUMP_2</text>
      </svg>`,
      jsxSnippet: `<g className="pump-unit" transform="translate(X, Y)"><circle r="18" fill="#0f172a" stroke="#3b82f6" strokeWidth="1.8" /><polygon points="-6,-8 -6,8 10,0" fill="#3b82f6" className="pump-spin" style={{ transformOrigin: "0 0" }} /><text y="30" fill="#94a3b8" fontSize="9" fontWeight="bold" fontFamily="var(--font-header)" textAnchor="middle">PUMP_2</text></g>`
    },

    // 3. Plate Heat Exchanger (Plate & Frame Ribbed)
    phe_plate_frame: {
      type: 'phe',
      variant: 'plate_frame',
      name: 'Plate HEX (Ribbed)',
      category: 'pumps',
      badge: 'PHE · V1',
      description: 'Plate & frame ribbing pattern heat exchanger (60x240).',
      ports: [
        { name: 'p1_in', cx: -30, cy: -80 },
        { name: 'p1_out', cx: -30, cy: 80 },
        { name: 'p2_out', cx: 30, cy: -80 },
        { name: 'p2_in', cx: 30, cy: 80 }
      ],
      renderCanvas: function(id, x, y, rot, scale) {
        return `<g id="${id}" transform="translate(${x}, ${y}) rotate(${rot}) scale(${scale})" class="draggable-item comp-item" data-type="comp" data-x="${x}" data-y="${y}" data-rot="${rot}" data-scale="${scale}">
          <rect x="-30" y="-120" width="60" height="240" fill="#0f172a" opacity="0.1" stroke="#3b82f6" stroke-width="1"/>
          <path d="M -30 -80 L 30 -60 M -30 -40 L 30 -20 M -30 0 L 30 20 M -30 40 L 30 60 M -30 80 L 30 100" stroke="#3b82f6" stroke-width="0.5" opacity="0.4"/>
          <text x="0" y="0" fill="#3b82f6" font-size="9" font-weight="bold" font-family="sans-serif" text-anchor="middle" dominant-baseline="central" transform="rotate(-90 0 0)">HEAT_EXCHANGER</text>
          <circle cx="-30" cy="-80" r="4.5" class="port-dot" data-port="p1_in"/>
          <circle cx="-30" cy="80" r="4.5" class="port-dot" data-port="p1_out"/>
          <circle cx="30" cy="-80" r="4.5" class="port-dot" data-port="p2_out"/>
          <circle cx="30" cy="80" r="4.5" class="port-dot" data-port="p2_in"/>
        </g>`;
      },
      previewSvg: `<svg width="70" height="85" viewBox="0 0 80 120">
        <rect x="25" y="10" width="30" height="100" fill="#0f172a" opacity="0.1" stroke="#f59e0b" stroke-width="1.5" />
        <path d="M 25 25 L 55 35 M 25 45 L 55 55 M 25 65 L 55 75 M 25 85 L 55 95" stroke="#f59e0b" stroke-width="0.8" opacity="0.4" />
        <text x="40" y="60" fill="#f59e0b" font-size="7" font-weight="bold" font-family="sans-serif" text-anchor="middle" dominant-baseline="central" transform="rotate(-90 40 60)">HEAT_EXCHANGER</text>
      </svg>`,
      jsxSnippet: `<g transform="translate(X, Y)"><rect x="0" y="0" width="60" height="240" fill="#0f172a" opacity="0.05" stroke="#3b82f6" strokeWidth="1" /><path d="M 0 40 L 60 60 M 0 80 L 60 100 M 0 120 L 60 140 M 0 160 L 60 180 M 0 200 L 60 220" stroke="#3b82f6" strokeWidth="0.5" opacity="0.3" /><text x="30" y="120" fill="#3b82f6" fontSize="9" fontWeight="bold" fontFamily="var(--font-header)" textAnchor="middle" dominantBaseline="central" transform="rotate(-90 30 120)">HEAT_EXCHANGER</text></g>`
    },

    // 4. Compact Brazed PHE (Chevron Pattern)
    phe_compact: {
      type: 'phe',
      variant: 'compact',
      name: 'Compact Brazed PHE',
      category: 'pumps',
      badge: 'PHE · V2',
      description: 'Compact Brazed Plate HEX with chevron corrugation lines.',
      ports: [
        { name: 'p1_in', cx: -22, cy: -14 },
        { name: 'p1_out', cx: -22, cy: 14 },
        { name: 'p2_out', cx: 22, cy: -14 },
        { name: 'p2_in', cx: 22, cy: 14 }
      ],
      renderCanvas: function(id, x, y, rot, scale) {
        return `<g id="${id}" transform="translate(${x}, ${y}) rotate(${rot}) scale(${scale})" class="draggable-item comp-item" data-type="comp" data-x="${x}" data-y="${y}" data-rot="${rot}" data-scale="${scale}">
          <rect x="-22" y="-28" width="44" height="56" rx="4" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>
          <path d="M -14 -16 L 0 -6 L 14 -16 M -14 -4 L 0 6 L 14 -4 M -14 8 L 0 18 L 14 8" fill="none" stroke="#f59e0b" stroke-width="1.8"/>
          <text x="0" y="38" fill="#f59e0b" font-size="8" font-weight="bold" font-family="sans-serif" text-anchor="middle">PHE_COMPACT</text>
          <circle cx="-22" cy="-14" r="4.5" class="port-dot" data-port="p1_in"/>
          <circle cx="-22" cy="14" r="4.5" class="port-dot" data-port="p1_out"/>
          <circle cx="22" cy="-14" r="4.5" class="port-dot" data-port="p2_out"/>
          <circle cx="22" cy="14" r="4.5" class="port-dot" data-port="p2_in"/>
        </g>`;
      },
      previewSvg: `<svg width="70" height="85" viewBox="0 0 80 120">
        <rect x="18" y="20" width="44" height="65" rx="4" fill="#0f172a" stroke="#f59e0b" stroke-width="2" />
        <path d="M 26 35 L 40 46 L 54 35 M 26 50 L 40 61 L 54 50 M 26 65 L 40 76 L 54 65" fill="none" stroke="#f59e0b" stroke-width="1.8" />
        <text x="40" y="100" fill="#f59e0b" font-size="8" font-weight="bold" font-family="sans-serif" text-anchor="middle">PHE_COMPACT</text>
      </svg>`,
      jsxSnippet: `<g transform="translate(X, Y)"><rect x="-22" y="-28" width="44" height="56" rx="4" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/><path d="M -14 -16 L 0 -6 L 14 -16 M -14 -4 L 0 6 L 14 -4 M -14 8 L 0 18 L 14 8" fill="none" stroke="#f59e0b" stroke-width="1.8"/><text x="0" y="38" fill="#f59e0b" font-size="8" font-weight="bold" text-anchor="middle">PHE_COMPACT</text></g>`
    },

    // 5. 2-Way Control Valve (Motorized)
    valve_motorized: {
      type: 'valve',
      variant: 'motorized',
      name: '2-Way Control Valve',
      category: 'valves',
      badge: '2-WAY · V1',
      description: 'Motorized proportional control valve with actuator.',
      ports: [
        { name: 'in', cx: -20, cy: 0 },
        { name: 'out', cx: 20, cy: 0 }
      ],
      renderCanvas: function(id, x, y, rot, scale) {
        return `<g id="${id}" transform="translate(${x}, ${y}) rotate(${rot}) scale(${scale})" class="draggable-item comp-item" data-type="comp" data-x="${x}" data-y="${y}" data-rot="${rot}" data-scale="${scale}">
          <rect x="-10" y="-30" width="20" height="16" rx="2" fill="#0f172a" stroke="#10b981" stroke-width="1.5"/>
          <line x1="0" y1="-14" x2="0" y2="0" stroke="#10b981" stroke-width="2"/>
          <polygon points="-20,-10 0,0 -20,10" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
          <polygon points="20,-10 0,0 20,10" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
          <text x="0" y="24" text-anchor="middle" fill="#94a3b8" font-size="9" font-weight="bold">CV-101</text>
          <circle cx="-20" cy="0" r="4.5" class="port-dot" data-port="in"/>
          <circle cx="20" cy="0" r="4.5" class="port-dot" data-port="out"/>
        </g>`;
      },
      previewSvg: `<svg width="90" height="70" viewBox="0 0 120 100">
        <rect x="48" y="15" width="24" height="20" rx="2" fill="#0f172a" stroke="#10b981" stroke-width="1.5" />
        <line x1="60" y1="35" x2="60" y2="50" stroke="#10b981" stroke-width="2" />
        <text x="60" y="29" text-anchor="middle" fill="#10b981" font-size="8" font-weight="bold">M</text>
        <polygon points="35,38 60,50 35,62" fill="#0f172a" stroke="#10b981" stroke-width="2" />
        <polygon points="85,38 60,50 85,62" fill="#0f172a" stroke="#10b981" stroke-width="2" />
        <line x1="10" y1="50" x2="35" y2="50" stroke="#38bdf8" stroke-width="3" />
        <line x1="85" y1="50" x2="110" y2="50" stroke="#38bdf8" stroke-width="3" />
        <text x="60" y="78" text-anchor="middle" fill="#94a3b8" font-size="9" font-weight="bold">CV-101</text>
      </svg>`,
      jsxSnippet: `<g transform="translate(X, Y)"><rect x="-12" y="-35" width="24" height="20" rx="2" fill="#0f172a" stroke="#10b981" stroke-width="1.5"/><line x1="0" y1="-15" x2="0" y2="0" stroke="#10b981" stroke-width="2"/><text x="0" y="-21" text-anchor="middle" fill="#10b981" font-size="8" font-weight="bold">M</text><polygon points="-25,-12 0,0 -25,12" fill="#0f172a" stroke="#10b981" stroke-width="2"/><polygon points="25,-12 0,0 25,12" fill="#0f172a" stroke="#10b981" stroke-width="2"/><line x1="-50" y1="0" x2="-25" y2="0" stroke="#38bdf8" stroke-width="3"/><line x1="25" y1="0" x2="50" y2="0" stroke="#38bdf8" stroke-width="3"/><text x="0" y="28" text-anchor="middle" fill="#94a3b8" font-size="9">CV_1</text></g>`
    },

    // 6. Bypass Valve (Bow-tie Symbol)
    valve_bowtie: {
      type: 'valve',
      variant: 'bowtie',
      name: 'Bypass Valve',
      category: 'valves',
      badge: 'BYPASS · V2',
      description: 'Standard bow-tie bypass valve from 100kW schematic.',
      ports: [
        { name: 'in', cx: -10, cy: 0 },
        { name: 'out', cx: 10, cy: 0 }
      ],
      renderCanvas: function(id, x, y, rot, scale) {
        return `<g id="${id}" transform="translate(${x}, ${y}) rotate(${rot}) scale(${scale})" class="draggable-item comp-item" data-type="comp" data-x="${x}" data-y="${y}" data-rot="${rot}" data-scale="${scale}">
          <path d="M -10 -15 L 10 15 L -10 15 L 10 -15 Z" fill="#1e293b" stroke="#10b981" stroke-width="1.5"/>
          <line x1="0" y1="-15" x2="0" y2="-20" stroke="#10b981" stroke-width="1.5"/>
          <line x1="-5" y1="-20" x2="5" y2="-20" stroke="#10b981" stroke-width="1.5"/>
          <text x="0" y="24" text-anchor="middle" fill="#94a3b8" font-size="8" font-weight="bold">BYPASS</text>
          <circle cx="-10" cy="0" r="4.5" class="port-dot" data-port="in"/>
          <circle cx="10" cy="0" r="4.5" class="port-dot" data-port="out"/>
        </g>`;
      },
      previewSvg: `<svg width="90" height="70" viewBox="0 0 120 100">
        <path d="M 50 35 L 70 65 L 50 65 L 70 35 Z" fill="#1e293b" stroke="#10b981" stroke-width="1.5" />
        <line x1="60" y1="35" x2="60" y2="28" stroke="#10b981" stroke-width="1.5" />
        <line x1="55" y1="28" x2="65" y2="28" stroke="#10b981" stroke-width="1.5" />
        <text x="60" y="82" text-anchor="middle" fill="#94a3b8" font-size="8.5" font-weight="bold">BYPASS</text>
      </svg>`,
      jsxSnippet: `<g transform="translate(X, Y)"><path d="M -10 -15 L 10 15 L -10 15 L 10 -15 Z" fill="#1e293b" stroke="#10b981" strokeWidth="1.5" /><line x1="0" y1="-15" x2="0" y2="-20" stroke="#10b981" strokeWidth="1.5" /><line x1="-5" y1="-20" x2="5" y2="-20" stroke="#10b981" strokeWidth="1.5" /><text x="15" y="5" fill="#94a3b8" fontSize="7" fontFamily="var(--font-header)">BYPASS</text></g>`
    },

    // 7. 3-Way Mixing Valve
    valve3way: {
      type: 'valve3way',
      variant: 'default',
      name: '3-Way Valve',
      category: 'valves',
      badge: '3-WAY',
      description: 'Proportional mixing & bypass diverting valve.',
      ports: [
        { name: 'in_a', cx: -18, cy: 0 },
        { name: 'out', cx: 18, cy: 0 },
        { name: 'in_b', cx: 0, cy: 18 }
      ],
      renderCanvas: function(id, x, y, rot, scale) {
        return `<g id="${id}" transform="translate(${x}, ${y}) rotate(${rot}) scale(${scale})" class="draggable-item comp-item" data-type="comp" data-x="${x}" data-y="${y}" data-rot="${rot}" data-scale="${scale}">
          <rect x="-8" y="-32" width="16" height="14" rx="2" fill="#0f172a" stroke="#14b8a6" stroke-width="1.5"/>
          <line x1="0" y1="-18" x2="0" y2="0" stroke="#14b8a6" stroke-width="2"/>
          <polygon points="-18,-10 0,0 -18,10" fill="#0f172a" stroke="#14b8a6" stroke-width="2"/>
          <polygon points="18,-10 0,0 18,10" fill="#0f172a" stroke="#14b8a6" stroke-width="2"/>
          <polygon points="-10,18 0,0 10,18" fill="#0f172a" stroke="#14b8a6" stroke-width="2"/>
          <text x="0" y="30" text-anchor="middle" fill="#94a3b8" font-size="8" font-weight="bold">3-WAY</text>
          <circle cx="-18" cy="0" r="4.5" class="port-dot" data-port="in_a"/>
          <circle cx="18" cy="0" r="4.5" class="port-dot" data-port="out"/>
          <circle cx="0" cy="18" r="4.5" class="port-dot" data-port="in_b"/>
        </g>`;
      },
      previewSvg: `<svg width="90" height="70" viewBox="0 0 120 100">
        <rect x="48" y="10" width="24" height="18" rx="2" fill="#0f172a" stroke="#14b8a6" stroke-width="1.5" />
        <line x1="60" y1="28" x2="60" y2="45" stroke="#14b8a6" stroke-width="2" />
        <polygon points="35,33 60,45 35,57" fill="#0f172a" stroke="#14b8a6" stroke-width="2" />
        <polygon points="85,33 60,45 85,57" fill="#0f172a" stroke="#14b8a6" stroke-width="2" />
        <polygon points="48,70 60,45 72,70" fill="#0f172a" stroke="#14b8a6" stroke-width="2" />
        <text x="60" y="88" text-anchor="middle" fill="#94a3b8" font-size="9" font-weight="bold">TV-102</text>
      </svg>`,
      jsxSnippet: `<g transform="translate(X, Y)"><rect x="-12" y="-35" width="24" height="18" rx="2" fill="#0f172a" stroke="#14b8a6" stroke-width="1.5"/><line x1="0" y1="-17" x2="0" y2="0" stroke="#14b8a6" stroke-width="2"/><polygon points="-25,-12 0,0 -25,12" fill="#0f172a" stroke="#14b8a6" stroke-width="2"/><polygon points="25,-12 0,0 25,12" fill="#0f172a" stroke="#14b8a6" stroke-width="2"/><polygon points="-12,25 0,0 12,25" fill="#0f172a" stroke="#14b8a6" stroke-width="2"/><text x="0" y="40" text-anchor="middle" fill="#94a3b8" font-size="9">TV_1</text></g>`
    },

    // 8. Check Valve (Triangular Flapper)
    checkvalve_flapper: {
      type: 'checkvalve',
      variant: 'flapper',
      name: 'Check Valve (Flapper)',
      category: 'valves',
      badge: 'CHECK · V1',
      description: 'Prevents reverse flow (triangular flapper & bar).',
      ports: [
        { name: 'in', cx: -6, cy: 0 },
        { name: 'out', cx: 6, cy: 0 }
      ],
      renderCanvas: function(id, x, y, rot, scale) {
        return `<g id="${id}" transform="translate(${x}, ${y}) rotate(${rot}) scale(${scale})" class="draggable-item comp-item" data-type="comp" data-x="${x}" data-y="${y}" data-rot="${rot}" data-scale="${scale}">
          <polygon points="6,-6 6,6 -6,0" fill="#0f172a" stroke="#3b82f6" stroke-width="1.5"/>
          <line x1="-6" y1="-6" x2="-6" y2="6" stroke="#3b82f6" stroke-width="1.5"/>
          <text x="0" y="18" text-anchor="middle" fill="#94a3b8" font-size="8" font-weight="bold">CKV-101</text>
          <circle cx="-6" cy="0" r="4.5" class="port-dot" data-port="in"/>
          <circle cx="6" cy="0" r="4.5" class="port-dot" data-port="out"/>
        </g>`;
      },
      previewSvg: `<svg width="90" height="70" viewBox="0 0 120 100">
        <polygon points="68,36 68,64 48,50" fill="#0f172a" stroke="#3b82f6" stroke-width="2.5" />
        <line x1="48" y1="36" x2="48" y2="64" stroke="#3b82f6" stroke-width="2.5" />
        <line x1="15" y1="50" x2="48" y2="50" stroke="#38bdf8" stroke-width="3" />
        <line x1="68" y1="50" x2="105" y2="50" stroke="#38bdf8" stroke-width="3" />
        <text x="60" y="86" text-anchor="middle" fill="#94a3b8" font-size="9" font-weight="bold">CKV-101</text>
      </svg>`,
      jsxSnippet: `<g transform="translate(X, Y)"><polygon points="6,-6 6,6 -6,0" fill="#0f172a" stroke="#3b82f6" strokeWidth="1.5" /><line x1="-6" y1="-6" x2="-6" y2="6" stroke="#3b82f6" strokeWidth="1.5" /></g>`
    },

    // 9. Check Valve (Circular Disc)
    checkvalve_disc: {
      type: 'checkvalve',
      variant: 'disc_circle',
      name: 'Check Valve (Disc)',
      category: 'valves',
      badge: 'CHECK · V2',
      description: 'Circular body non-return valve with internal disc stop.',
      ports: [
        { name: 'in', cx: -14, cy: 0 },
        { name: 'out', cx: 14, cy: 0 }
      ],
      renderCanvas: function(id, x, y, rot, scale) {
        return `<g id="${id}" transform="translate(${x}, ${y}) rotate(${rot}) scale(${scale})" class="draggable-item comp-item" data-type="comp" data-x="${x}" data-y="${y}" data-rot="${rot}" data-scale="${scale}">
          <circle cx="0" cy="0" r="14" fill="#0f172a" stroke="#34d399" stroke-width="2"/>
          <polygon points="-6,-6 -6,6 6,0" fill="#34d399"/>
          <line x1="6" y1="-7" x2="6" y2="7" stroke="#34d399" stroke-width="2"/>
          <text x="0" y="24" text-anchor="middle" fill="#94a3b8" font-size="8" font-weight="bold">CHECK</text>
          <circle cx="-14" cy="0" r="4.5" class="port-dot" data-port="in"/>
          <circle cx="14" cy="0" r="4.5" class="port-dot" data-port="out"/>
        </g>`;
      },
      previewSvg: `<svg width="90" height="70" viewBox="0 0 120 100">
        <circle cx="60" cy="45" r="20" fill="#0f172a" stroke="#34d399" stroke-width="2.5" />
        <polygon points="50,35 50,55 68,45" fill="#34d399" />
        <line x1="68" y1="33" x2="68" y2="57" stroke="#34d399" stroke-width="2.8" />
        <text x="60" y="84" text-anchor="middle" fill="#94a3b8" font-size="9" font-weight="bold">CHECK</text>
      </svg>`,
      jsxSnippet: `<g transform="translate(X, Y)"><circle cx="0" cy="0" r="14" fill="#0f172a" stroke="#34d399" stroke-width="2"/><polygon points="-6,-6 -6,6 6,0" fill="#34d399"/><line x1="6" y1="-7" x2="6" y2="7" stroke="#34d399" stroke-width="2"/><text x="0" y="24" text-anchor="middle" fill="#94a3b8" font-size="8">CHECK</text></g>`
    },

    // 10. Cooling Fan (Impeller)
    fan_impeller: {
      type: 'fan',
      variant: 'impeller',
      name: 'Cooling Fan (Impeller)',
      category: 'vessels',
      badge: 'FAN · V1',
      description: '8-blade impeller fan with center hub.',
      ports: [],
      renderCanvas: function(id, x, y, rot, scale, anim) {
        return `<g id="${id}" transform="translate(${x}, ${y}) rotate(${rot}) scale(${scale})" class="draggable-item comp-item" data-type="comp" data-x="${x}" data-y="${y}" data-rot="${rot}" data-scale="${scale}">
          <circle cx="0" cy="0" r="16" fill="#0f172a" stroke="#3b82f6" stroke-width="1.5"/>
          <g class="${anim ? 'spin-target spin-active' : 'spin-target'}" style="transform-origin: 0px 0px;">
            <g fill="#3b82f6" opacity="0.85">
              <path d="M 0,-4 C 3,-9 7,-12 3,-14 C 0,-13 -1,-8 0,-4 Z" />
              <path d="M 0,-4 C 3,-9 7,-12 3,-14 C 0,-13 -1,-8 0,-4 Z" transform="rotate(45)" />
              <path d="M 0,-4 C 3,-9 7,-12 3,-14 C 0,-13 -1,-8 0,-4 Z" transform="rotate(90)" />
              <path d="M 0,-4 C 3,-9 7,-12 3,-14 C 0,-13 -1,-8 0,-4 Z" transform="rotate(135)" />
              <path d="M 0,-4 C 3,-9 7,-12 3,-14 C 0,-13 -1,-8 0,-4 Z" transform="rotate(180)" />
              <path d="M 0,-4 C 3,-9 7,-12 3,-14 C 0,-13 -1,-8 0,-4 Z" transform="rotate(225)" />
              <path d="M 0,-4 C 3,-9 7,-12 3,-14 C 0,-13 -1,-8 0,-4 Z" transform="rotate(270)" />
              <path d="M 0,-4 C 3,-9 7,-12 3,-14 C 0,-13 -1,-8 0,-4 Z" transform="rotate(315)" />
            </g>
            <circle cx="0" cy="0" r="4.5" fill="#1e293b" stroke="#3b82f6" stroke-width="1.5"/>
            <circle cx="0" cy="0" r="2" fill="#3b82f6"/>
          </g>
          <text x="0" y="28" text-anchor="middle" fill="#94a3b8" font-size="8" font-weight="bold">FAN</text>
        </g>`;
      },
      previewSvg: `<svg width="90" height="70" viewBox="0 0 120 100">
        <circle cx="60" cy="45" r="22" fill="#0f172a" stroke="#3b82f6" stroke-width="2" />
        <g class="spin-target spin-active" style="transform-origin: 60px 45px;">
          <g transform="translate(60, 45)" fill="#3b82f6" opacity="0.9">
            <path d="M 0,-5 C 4,-12 10,-16 4,-19 C 0,-18 -1,-11 0,-5 Z" />
            <path d="M 0,-5 C 4,-12 10,-16 4,-19 C 0,-18 -1,-11 0,-5 Z" transform="rotate(45)" />
            <path d="M 0,-5 C 4,-12 10,-16 4,-19 C 0,-18 -1,-11 0,-5 Z" transform="rotate(90)" />
            <path d="M 0,-5 C 4,-12 10,-16 4,-19 C 0,-18 -1,-11 0,-5 Z" transform="rotate(135)" />
            <path d="M 0,-5 C 4,-12 10,-16 4,-19 C 0,-18 -1,-11 0,-5 Z" transform="rotate(180)" />
            <path d="M 0,-5 C 4,-12 10,-16 4,-19 C 0,-18 -1,-11 0,-5 Z" transform="rotate(225)" />
            <path d="M 0,-5 C 4,-12 10,-16 4,-19 C 0,-18 -1,-11 0,-5 Z" transform="rotate(270)" />
            <path d="M 0,-5 C 4,-12 10,-16 4,-19 C 0,-18 -1,-11 0,-5 Z" transform="rotate(315)" />
          </g>
          <circle cx="60" cy="45" r="6" fill="#1e293b" stroke="#3b82f6" stroke-width="1.8" />
          <circle cx="60" cy="45" r="2.5" fill="#3b82f6" />
        </g>
        <text x="60" y="86" text-anchor="middle" fill="#94a3b8" font-size="9" font-weight="bold">FAN</text>
      </svg>`,
      jsxSnippet: `<g transform="translate(X, Y)"><circle r="16" fill="#0f172a" stroke="#3b82f6" strokeWidth="1.5" /><g className="fan-spin" style={{ transformOrigin: "0 0" }}><g fill="#3b82f6" opacity="0.85"><path d="M 0,-4 C 3,-9 7,-12 3,-14 C 0,-13 -1,-8 0,-4 Z" /><path d="M 0,-4 C 3,-9 7,-12 3,-14 C 0,-13 -1,-8 0,-4 Z" transform="rotate(45)" /><path d="M 0,-4 C 3,-9 7,-12 3,-14 C 0,-13 -1,-8 0,-4 Z" transform="rotate(90)" /><path d="M 0,-4 C 3,-9 7,-12 3,-14 C 0,-13 -1,-8 0,-4 Z" transform="rotate(135)" /><path d="M 0,-4 C 3,-9 7,-12 3,-14 C 0,-13 -1,-8 0,-4 Z" transform="rotate(180)" /><path d="M 0,-4 C 3,-9 7,-12 3,-14 C 0,-13 -1,-8 0,-4 Z" transform="rotate(225)" /><path d="M 0,-4 C 3,-9 7,-12 3,-14 C 0,-13 -1,-8 0,-4 Z" transform="rotate(270)" /><path d="M 0,-4 C 3,-9 7,-12 3,-14 C 0,-13 -1,-8 0,-4 Z" transform="rotate(315)" /></g><circle r="4.5" fill="#1e293b" stroke="#3b82f6" strokeWidth="1.5" /><circle r="2" fill="#3b82f6" /></g></g>`
    },

    // 11. Radiator Fan Matrix (Dual Array)
    fan_matrix: {
      type: 'fan',
      variant: 'array',
      name: 'Radiator Fan Matrix',
      category: 'vessels',
      badge: 'FAN · V2',
      description: 'Liquid-to-Air dual radiator cooling matrix.',
      ports: [
        { name: 'in', cx: -35, cy: -35 },
        { name: 'out', cx: -35, cy: 35 }
      ],
      renderCanvas: function(id, x, y, rot, scale, anim) {
        return `<g id="${id}" transform="translate(${x}, ${y}) rotate(${rot}) scale(${scale})" class="draggable-item comp-item" data-type="comp" data-x="${x}" data-y="${y}" data-rot="${rot}" data-scale="${scale}">
          <rect x="-35" y="-70" width="70" height="140" rx="6" fill="#0f172a" stroke="#84cc16" stroke-width="2"/>
          <g class="${anim ? 'spin-target spin-active' : 'spin-target'}" style="transform-origin: 0px -35px;">
            <circle cx="0" cy="-35" r="16" fill="#84cc16" opacity="0.6"/>
            <circle cx="0" cy="-35" r="4" fill="#84cc16"/>
          </g>
          <g class="${anim ? 'spin-target spin-active' : 'spin-target'}" style="transform-origin: 0px 35px;">
            <circle cx="0" cy="35" r="16" fill="#84cc16" opacity="0.6"/>
            <circle cx="0" cy="35" r="4" fill="#84cc16"/>
          </g>
          <text x="0" y="86" text-anchor="middle" fill="#84cc16" font-size="8" font-weight="bold">FAN_MATRIX</text>
          <circle cx="-35" cy="-35" r="4.5" class="port-dot" data-port="in"/>
          <circle cx="-35" cy="35" r="4.5" class="port-dot" data-port="out"/>
        </g>`;
      },
      previewSvg: `<svg width="70" height="85" viewBox="0 0 80 120">
        <rect x="15" y="10" width="50" height="90" rx="4" fill="#0f172a" stroke="#84cc16" stroke-width="2" />
        <g class="spin-target spin-active" style="transform-origin: 40px 32px;"><circle cx="40" cy="32" r="14" fill="#84cc16" opacity="0.6"/></g>
        <g class="spin-target spin-active" style="transform-origin: 40px 72px;"><circle cx="40" cy="72" r="14" fill="#84cc16" opacity="0.6"/></g>
        <text x="40" y="112" text-anchor="middle" fill="#84cc16" font-size="7.5" font-weight="bold">FAN_MATRIX</text>
      </svg>`,
      jsxSnippet: `<g transform="translate(X, Y)"><rect x="-35" y="-70" width="70" height="140" rx="6" fill="#0f172a" stroke="#84cc16" stroke-width="2"/><g className="fan-spin" style={{ transformOrigin: "0 -35px" }}><circle cx="0" cy="-35" r="16" fill="#84cc16" opacity="0.6"/></g><g className="fan-spin" style={{ transformOrigin: "0 35px" }}><circle cx="0" cy="35" r="16" fill="#84cc16" opacity="0.6"/></g><text x="0" y="86" text-anchor="middle" fill="#84cc16" font-size="8">FAN_MATRIX</text></g>`
    },

    // 12. Water Tank (Wave Fluid Level)
    watertank_wave: {
      type: 'watertank',
      variant: 'wave',
      name: 'Water Tank (Wave)',
      category: 'vessels',
      badge: 'TANK · V1',
      description: 'Atmospheric buffer tank with fluid level wave pattern.',
      ports: [
        { name: 'in', cx: -50, cy: 15 },
        { name: 'out', cx: 50, cy: 15 },
        { name: 'top_fill', cx: 0, cy: -45 },
        { name: 'drain', cx: 0, cy: 45 }
      ],
      renderCanvas: function(id, x, y, rot, scale) {
        return `<g id="${id}" transform="translate(${x}, ${y}) rotate(${rot}) scale(${scale})" class="draggable-item comp-item" data-type="comp" data-x="${x}" data-y="${y}" data-rot="${rot}" data-scale="${scale}">
          <rect x="-50" y="-45" width="100" height="90" rx="4" fill="#0f172a" stroke="#3b82f6" stroke-width="1.5"/>
          <rect x="-48" y="-5" width="96" height="48" fill="#3b82f6" opacity="0.1"/>
          <path d="M -48 -5 Q -25 -7, 0 -5 T 48 -5" fill="none" stroke="#3b82f6" stroke-width="1" opacity="0.3"/>
          <text x="0" y="-22" text-anchor="middle" fill="#3b82f6" font-size="8" font-weight="bold">WATER_TANK</text>
          <circle cx="-50" cy="15" r="4.5" class="port-dot" data-port="in"/>
          <circle cx="50" cy="15" r="4.5" class="port-dot" data-port="out"/>
          <circle cx="0" cy="-45" r="4.5" class="port-dot" data-port="top_fill"/>
          <circle cx="0" cy="45" r="4.5" class="port-dot" data-port="drain"/>
        </g>`;
      },
      previewSvg: `<svg width="90" height="70" viewBox="0 0 120 100">
        <rect x="20" y="15" width="80" height="70" rx="4" fill="#0f172a" stroke="#3b82f6" stroke-width="1.5" />
        <rect x="22" y="45" width="76" height="38" fill="#3b82f6" opacity="0.1" />
        <path d="M 22 45 Q 40 43, 60 45 T 98 45" fill="none" stroke="#3b82f6" stroke-width="1" opacity="0.4" />
        <text x="60" y="32" text-anchor="middle" fill="#3b82f6" font-size="8" font-weight="bold">WATER_TANK</text>
      </svg>`,
      jsxSnippet: `<g transform="translate(X, Y)"><rect width="100" height="90" rx="4" fill="#0f172a" stroke="#3b82f6" strokeWidth="1.5" /><rect x="2" y="40" width="96" height="48" fill="#3b82f6" opacity="0.1" /><path d="M 2 40 Q 25 38, 50 40 T 98 40" fill="none" stroke="#3b82f6" strokeWidth="1" opacity="0.3" /><text x="50" y="25" fill="#3b82f6" fontSize="9" fontWeight="bold" fontFamily="var(--font-header)" textAnchor="middle">WATER_TANK</text></g>`
    },

    // 13. Expansion Tank (Compact Inline)
    expansion_compact: {
      type: 'expansion',
      variant: 'compact',
      name: 'Exp Tank (Inline)',
      category: 'vessels',
      badge: 'EXP · V1',
      description: 'Standard inline expansion vessel from 100kW schematic.',
      ports: [
        { name: 'conn', cx: 0, cy: 0 }
      ],
      renderCanvas: function(id, x, y, rot, scale) {
        return `<g id="${id}" transform="translate(${x}, ${y}) rotate(${rot}) scale(${scale})" class="draggable-item comp-item" data-type="comp" data-x="${x}" data-y="${y}" data-rot="${rot}" data-scale="${scale}">
          <line x1="0" y1="0" x2="0" y2="10" stroke="#818cf8" stroke-width="1.5"/>
          <rect x="-9" y="10" width="18" height="25" rx="9" fill="#0f172a" stroke="#818cf8" stroke-width="1.2"/>
          <line x1="-6" y1="20" x2="6" y2="20" stroke="#818cf8" stroke-width="0.8" stroke-dasharray="1.5 1" opacity="0.6"/>
          <text x="0" y="45" text-anchor="middle" fill="#818cf8" font-size="7" font-weight="bold">EXP_TANK</text>
          <circle cx="0" cy="0" r="4.5" class="port-dot" data-port="conn"/>
        </g>`;
      },
      previewSvg: `<svg width="90" height="70" viewBox="0 0 120 100">
        <line x1="60" y1="20" x2="60" y2="35" stroke="#818cf8" stroke-width="2" />
        <rect x="48" y="35" width="24" height="34" rx="10" fill="#0f172a" stroke="#818cf8" stroke-width="2" />
        <line x1="50" y1="52" x2="70" y2="52" stroke="#818cf8" stroke-width="1.2" stroke-dasharray="2 1.5" />
        <text x="60" y="85" text-anchor="middle" fill="#818cf8" font-size="8" font-weight="bold">EXP_TANK</text>
      </svg>`,
      jsxSnippet: `<g transform="translate(X, Y)"><line x1="0" y1="0" x2="0" y2="10" stroke="#818cf8" strokeWidth="1.5" /><rect x="-9" y="10" width="18" height="25" rx="9" fill="#0f172a" stroke="#818cf8" strokeWidth="1.2" /><line x1="-6" y1="20" x2="6" y2="20" stroke="#818cf8" strokeWidth="0.8" strokeDasharray="1.5 1" opacity="0.6" /><text x="0" y="45" textAnchor="middle" fill="#818cf8" fontSize="7" fontWeight="bold" fontFamily="var(--font-header)">EXP_TANK</text></g>`
    },

    // 14. Expansion Tank (Dual Chamber Large)
    expansion_dual: {
      type: 'expansion',
      variant: 'dual',
      name: 'Exp Tank (Dual)',
      category: 'vessels',
      badge: 'EXP · V2',
      description: 'Regulates loop static pressure with air/fluid chambers.',
      ports: [
        { name: 'conn', cx: 0, cy: 28 }
      ],
      renderCanvas: function(id, x, y, rot, scale) {
        return `<g id="${id}" transform="translate(${x}, ${y}) rotate(${rot}) scale(${scale})" class="draggable-item comp-item" data-type="comp" data-x="${x}" data-y="${y}" data-rot="${rot}" data-scale="${scale}">
          <rect x="-18" y="-28" width="36" height="56" rx="14" fill="#0f172a" stroke="#f97316" stroke-width="2"/>
          <line x1="-18" y1="0" x2="18" y2="0" stroke="#f97316" stroke-width="1.5" stroke-dasharray="3 2"/>
          <text x="0" y="-8" text-anchor="middle" fill="#f97316" font-size="8" font-weight="bold">AIR</text>
          <text x="0" y="12" text-anchor="middle" fill="#38bdf8" font-size="8" font-weight="bold">FLUID</text>
          <text x="0" y="42" text-anchor="middle" fill="#94a3b8" font-size="8" font-weight="bold">EXP TANK</text>
          <circle cx="0" cy="28" r="4.5" class="port-dot" data-port="conn"/>
        </g>`;
      },
      previewSvg: `<svg width="90" height="70" viewBox="0 0 120 100">
        <rect x="42" y="15" width="36" height="60" rx="14" fill="#0f172a" stroke="#f97316" stroke-width="2.5" />
        <line x1="42" y1="45" x2="78" y2="45" stroke="#f97316" stroke-width="1.5" stroke-dasharray="3 2" />
        <line x1="60" y1="75" x2="60" y2="90" stroke="#38bdf8" stroke-width="3" />
        <text x="60" y="34" text-anchor="middle" fill="#f97316" font-size="8" font-weight="bold">AIR</text>
        <text x="60" y="60" text-anchor="middle" fill="#38bdf8" font-size="8" font-weight="bold">FLUID</text>
      </svg>`,
      jsxSnippet: `<g transform="translate(X, Y)"><rect x="-18" y="-30" width="36" height="60" rx="14" fill="#0f172a" stroke="#f97316" stroke-width="2.5"/><line x1="-18" y1="0" x2="18" y2="0" stroke="#f97316" stroke-width="1.5" stroke-dasharray="3 2"/><text x="0" y="-10" text-anchor="middle" fill="#f97316" font-size="8" font-weight="bold">AIR</text><text x="0" y="15" text-anchor="middle" fill="#38bdf8" font-size="8" font-weight="bold">FLUID</text></g>`
    },

    // 15. In-line Mesh Filter
    filter: {
      type: 'filter',
      variant: 'default',
      name: 'Mesh Filter',
      category: 'vessels',
      badge: 'FILTER',
      description: 'Cross-mesh particulate filter for coolant piping.',
      ports: [
        { name: 'in', cx: -15, cy: 0 },
        { name: 'out', cx: 15, cy: 0 }
      ],
      renderCanvas: function(id, x, y, rot, scale) {
        return `<g id="${id}" transform="translate(${x}, ${y}) rotate(${rot}) scale(${scale})" class="draggable-item comp-item" data-type="comp" data-x="${x}" data-y="${y}" data-rot="${rot}" data-scale="${scale}">
          <rect x="-15" y="-12" width="30" height="24" rx="2" fill="#0f172a" stroke="#3b82f6" stroke-width="1"/>
          <line x1="-15" y1="-12" x2="15" y2="12" stroke="#3b82f6" stroke-width="0.75" opacity="0.5"/>
          <line x1="-15" y1="12" x2="15" y2="-12" stroke="#3b82f6" stroke-width="0.75" opacity="0.5"/>
          <text x="0" y="22" text-anchor="middle" fill="#3b82f6" font-size="7" font-weight="bold">FILTER</text>
          <circle cx="-15" cy="0" r="4.5" class="port-dot" data-port="in"/>
          <circle cx="15" cy="0" r="4.5" class="port-dot" data-port="out"/>
        </g>`;
      },
      previewSvg: `<svg width="90" height="70" viewBox="0 0 120 100">
        <rect x="40" y="32" width="40" height="32" rx="2" fill="#0f172a" stroke="#3b82f6" stroke-width="1.5" />
        <line x1="40" y1="32" x2="80" y2="64" stroke="#3b82f6" stroke-width="1" opacity="0.6" />
        <line x1="40" y1="64" x2="80" y2="32" stroke="#3b82f6" stroke-width="1" opacity="0.6" />
        <line x1="15" y1="48" x2="40" y2="48" stroke="#38bdf8" stroke-width="3" />
        <line x1="80" y1="48" x2="105" y2="48" stroke="#38bdf8" stroke-width="3" />
        <text x="60" y="82" text-anchor="middle" fill="#3b82f6" font-size="8.5" font-weight="bold">FILTER</text>
      </svg>`,
      jsxSnippet: `<g transform="translate(X, Y)"><rect x="-15" y="-12" width="30" height="24" rx="2" fill="#0f172a" stroke="#3b82f6" strokeWidth="1" /><line x1="-15" y1="-12" x2="15" y2="12" stroke="#3b82f6" strokeWidth="0.75" opacity="0.5" /><line x1="-15" y1="12" x2="15" y2="-12" stroke="#3b82f6" strokeWidth="0.75" opacity="0.5" /><text x="0" y="20" fill="#3b82f6" fontSize="7" fontWeight="bold" fontFamily="var(--font-header)" textAnchor="middle">FILTER</text></g>`
    },

    // 16. Y-Strainer Filter
    strainer: {
      type: 'strainer',
      variant: 'default',
      name: 'Y-Strainer Filter',
      category: 'vessels',
      badge: 'STRAINER',
      description: 'Captures coarse debris before HEX & pumps.',
      ports: [
        { name: 'in', cx: -20, cy: -10 },
        { name: 'out', cx: 20, cy: -10 },
        { name: 'blowdown', cx: 0, cy: 15 }
      ],
      renderCanvas: function(id, x, y, rot, scale) {
        return `<g id="${id}" transform="translate(${x}, ${y}) rotate(${rot}) scale(${scale})" class="draggable-item comp-item" data-type="comp" data-x="${x}" data-y="${y}" data-rot="${rot}" data-scale="${scale}">
          <path d="M -20 -10 L 20 -10 L 0 15 Z" fill="#0f172a" stroke="#eab308" stroke-width="2"/>
          <line x1="-12" y1="-3" x2="0" y2="10" stroke="#eab308" stroke-width="1.5" stroke-dasharray="2 2"/>
          <text x="0" y="28" text-anchor="middle" fill="#94a3b8" font-size="8" font-weight="bold">STRAINER</text>
          <circle cx="-20" cy="-10" r="4.5" class="port-dot" data-port="in"/>
          <circle cx="20" cy="-10" r="4.5" class="port-dot" data-port="out"/>
          <circle cx="0" cy="15" r="4.5" class="port-dot" data-port="blowdown"/>
        </g>`;
      },
      previewSvg: `<svg width="90" height="70" viewBox="0 0 120 100">
        <path d="M 30 35 L 90 35 L 60 70 Z" fill="#0f172a" stroke="#eab308" stroke-width="2.5" />
        <line x1="42" y1="45" x2="60" y2="65" stroke="#eab308" stroke-width="1.5" stroke-dasharray="2 2" />
        <line x1="10" y1="35" x2="30" y2="35" stroke="#38bdf8" stroke-width="4" />
        <line x1="90" y1="35" x2="110" y2="35" stroke="#38bdf8" stroke-width="4" />
        <text x="60" y="88" text-anchor="middle" fill="#94a3b8" font-size="9" font-weight="bold">STRAINER</text>
      </svg>`,
      jsxSnippet: `<g transform="translate(X, Y)"><path d="M -30 -15 L 30 -15 L 0 20 Z" fill="#0f172a" stroke="#eab308" stroke-width="2.5"/><line x1="-18" y1="-5" x2="0" y2="15" stroke="#eab308" stroke-width="1.5" stroke-dasharray="2 2"/><text x="0" y="35" text-anchor="middle" fill="#94a3b8" font-size="9">STRAINER</text></g>`
    },

    // 17. Temp Sensor (TT)
    sensor: {
      type: 'sensor',
      variant: 'default',
      name: 'Temp Sensor (TT)',
      category: 'sensors',
      badge: 'TT',
      description: 'Immersion RTD thermocouple sensor.',
      ports: [
        { name: 'tap', cx: 0, cy: 30 }
      ],
      renderCanvas: function(id, x, y, rot, scale) {
        return `<g id="${id}" transform="translate(${x}, ${y}) rotate(${rot}) scale(${scale})" class="draggable-item comp-item" data-type="comp" data-x="${x}" data-y="${y}" data-rot="${rot}" data-scale="${scale}">
          <line x1="0" y1="10" x2="0" y2="30" stroke="#a855f7" stroke-width="2"/>
          <circle cx="0" cy="0" r="14" fill="#0f172a" stroke="#a855f7" stroke-width="2"/>
          <line x1="-14" y1="0" x2="14" y2="0" stroke="#a855f7" stroke-width="1"/>
          <text x="0" y="-4" text-anchor="middle" fill="#a855f7" font-size="8" font-weight="bold">TT</text>
          <text x="0" y="8" text-anchor="middle" fill="#f8fafc" font-size="7">101</text>
          <circle cx="0" cy="30" r="4.5" class="port-dot" data-port="tap"/>
        </g>`;
      },
      previewSvg: `<svg width="90" height="70" viewBox="0 0 120 100">
        <line x1="60" y1="42" x2="60" y2="70" stroke="#a855f7" stroke-width="2.5" />
        <circle cx="60" cy="26" r="18" fill="#0f172a" stroke="#a855f7" stroke-width="2.5" />
        <line x1="42" y1="26" x2="78" y2="26" stroke="#a855f7" stroke-width="1.5" />
        <text x="60" y="21" text-anchor="middle" fill="#a855f7" font-size="10" font-weight="bold">TT</text>
        <text x="60" y="36" text-anchor="middle" fill="#f8fafc" font-size="9">101</text>
        <line x1="20" y1="70" x2="100" y2="70" stroke="#38bdf8" stroke-width="4" />
      </svg>`,
      jsxSnippet: `<g transform="translate(X, Y)"><line x1="0" y1="16" x2="0" y2="44" stroke="#a855f7" stroke-width="2.5"/><circle cx="0" cy="0" r="18" fill="#0f172a" stroke="#a855f7" stroke-width="2.5"/><line x1="-18" y1="0" x2="18" y2="0" stroke="#a855f7" stroke-width="1.5"/><text x="0" y="-5" text-anchor="middle" fill="#a855f7" font-size="10" font-weight="bold">TT</text><text x="0" y="10" text-anchor="middle" fill="#f8fafc" font-size="9">101</text></g>`
    },

    // 18. Pressure Sensor (PT)
    pressure: {
      type: 'pressure',
      variant: 'default',
      name: 'Press Sensor (PT)',
      category: 'sensors',
      badge: 'PT',
      description: 'Gauge pressure loop transducer.',
      ports: [
        { name: 'tap', cx: 0, cy: 30 }
      ],
      renderCanvas: function(id, x, y, rot, scale) {
        return `<g id="${id}" transform="translate(${x}, ${y}) rotate(${rot}) scale(${scale})" class="draggable-item comp-item" data-type="comp" data-x="${x}" data-y="${y}" data-rot="${rot}" data-scale="${scale}">
          <line x1="0" y1="10" x2="0" y2="30" stroke="#38bdf8" stroke-width="2"/>
          <circle cx="0" cy="0" r="14" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
          <line x1="-14" y1="0" x2="14" y2="0" stroke="#38bdf8" stroke-width="1"/>
          <text x="0" y="-4" text-anchor="middle" fill="#38bdf8" font-size="8" font-weight="bold">PT</text>
          <text x="0" y="8" text-anchor="middle" fill="#f8fafc" font-size="7">P1</text>
          <circle cx="0" cy="30" r="4.5" class="port-dot" data-port="tap"/>
        </g>`;
      },
      previewSvg: `<svg width="90" height="70" viewBox="0 0 120 100">
        <line x1="60" y1="42" x2="60" y2="70" stroke="#38bdf8" stroke-width="2.5" />
        <circle cx="60" cy="26" r="18" fill="#0f172a" stroke="#38bdf8" stroke-width="2.5" />
        <line x1="42" y1="26" x2="78" y2="26" stroke="#38bdf8" stroke-width="1.5" />
        <text x="60" y="21" text-anchor="middle" fill="#38bdf8" font-size="10" font-weight="bold">PT</text>
        <text x="60" y="36" text-anchor="middle" fill="#f8fafc" font-size="9">P1</text>
        <line x1="20" y1="70" x2="100" y2="70" stroke="#38bdf8" stroke-width="4" />
      </svg>`,
      jsxSnippet: `<g transform="translate(X, Y)"><line x1="0" y1="16" x2="0" y2="44" stroke="#38bdf8" stroke-width="2.5"/><circle cx="0" cy="0" r="18" fill="#0f172a" stroke="#38bdf8" stroke-width="2.5"/><line x1="-18" y1="0" x2="18" y2="0" stroke="#38bdf8" stroke-width="1.5"/><text x="0" y="-5" text-anchor="middle" fill="#38bdf8" font-size="10" font-weight="bold">PT</text><text x="0" y="10" text-anchor="middle" fill="#f8fafc" font-size="9">P1</text></g>`
    },

    // 19. Differential Pressure (DPT)
    diffpressure: {
      type: 'diffpressure',
      variant: 'default',
      name: 'Diff Press (DPT)',
      category: 'sensors',
      badge: 'DPT',
      description: 'Pressure drop (ΔP) across filter & HEX.',
      ports: [
        { name: 'high', cx: -10, cy: 25 },
        { name: 'low', cx: 10, cy: 25 }
      ],
      renderCanvas: function(id, x, y, rot, scale) {
        return `<g id="${id}" transform="translate(${x}, ${y}) rotate(${rot}) scale(${scale})" class="draggable-item comp-item" data-type="comp" data-x="${x}" data-y="${y}" data-rot="${rot}" data-scale="${scale}">
          <circle cx="0" cy="0" r="16" fill="#0f172a" stroke="#0ea5e9" stroke-width="2"/>
          <line x1="-16" y1="0" x2="16" y2="0" stroke="#0ea5e9" stroke-width="1"/>
          <text x="0" y="-3" text-anchor="middle" fill="#0ea5e9" font-size="8" font-weight="bold">DPT</text>
          <text x="0" y="9" text-anchor="middle" fill="#f8fafc" font-size="7">ΔP</text>
          <line x1="-10" y1="12" x2="-10" y2="25" stroke="#0ea5e9" stroke-width="1.5"/>
          <line x1="10" y1="12" x2="10" y2="25" stroke="#0ea5e9" stroke-width="1.5"/>
          <circle cx="-10" cy="25" r="4.5" class="port-dot" data-port="high"/>
          <circle cx="10" cy="25" r="4.5" class="port-dot" data-port="low"/>
        </g>`;
      },
      previewSvg: `<svg width="90" height="70" viewBox="0 0 120 100">
        <circle cx="60" cy="30" r="20" fill="#0f172a" stroke="#0ea5e9" stroke-width="2.5" />
        <line x1="40" y1="30" x2="80" y2="30" stroke="#0ea5e9" stroke-width="1.5" />
        <text x="60" y="25" text-anchor="middle" fill="#0ea5e9" font-size="10" font-weight="bold">DPT</text>
        <text x="60" y="41" text-anchor="middle" fill="#f8fafc" font-size="9">ΔP</text>
        <line x1="48" y1="50" x2="48" y2="70" stroke="#0ea5e9" stroke-width="2" />
        <line x1="72" y1="50" x2="72" y2="70" stroke="#0ea5e9" stroke-width="2" />
      </svg>`,
      jsxSnippet: `<g transform="translate(X, Y)"><circle cx="0" cy="0" r="20" fill="#0f172a" stroke="#0ea5e9" stroke-width="2.5"/><line x1="-20" y1="0" x2="20" y2="0" stroke="#0ea5e9" stroke-width="1.5"/><text x="0" y="-5" text-anchor="middle" fill="#0ea5e9" font-size="10" font-weight="bold">DPT</text><text x="0" y="11" text-anchor="middle" fill="#f8fafc" font-size="9">ΔP</text></g>`
    },

    // 20. Flow Meter (FT)
    flowmeter: {
      type: 'flowmeter',
      variant: 'default',
      name: 'Flow Meter (FT)',
      category: 'sensors',
      badge: 'FT',
      description: 'Inline electromagnetic flow rate sensor.',
      ports: [
        { name: 'in', cx: -18, cy: 14 },
        { name: 'out', cx: 18, cy: 14 }
      ],
      renderCanvas: function(id, x, y, rot, scale) {
        return `<g id="${id}" transform="translate(${x}, ${y}) rotate(${rot}) scale(${scale})" class="draggable-item comp-item" data-type="comp" data-x="${x}" data-y="${y}" data-rot="${rot}" data-scale="${scale}">
          <circle cx="0" cy="-14" r="13" fill="#0f172a" stroke="#6366f1" stroke-width="2"/>
          <text x="0" y="-10" text-anchor="middle" fill="#6366f1" font-size="8" font-weight="bold">FT</text>
          <line x1="0" y1="-1" x2="0" y2="12" stroke="#6366f1" stroke-width="2"/>
          <rect x="-18" y="10" width="36" height="8" rx="2" fill="#0f172a" stroke="#818cf8" stroke-width="1.5"/>
          <path d="M -10 14 Q 0 10 10 14" fill="none" stroke="#6366f1" stroke-width="1.5"/>
          <text x="0" y="30" text-anchor="middle" fill="#94a3b8" font-size="8" font-weight="bold">FLOW</text>
          <circle cx="-18" cy="14" r="4.5" class="port-dot" data-port="in"/>
          <circle cx="18" cy="14" r="4.5" class="port-dot" data-port="out"/>
        </g>`;
      },
      previewSvg: `<svg width="90" height="70" viewBox="0 0 120 100">
        <circle cx="60" cy="24" r="16" fill="#0f172a" stroke="#6366f1" stroke-width="2.5" />
        <text x="60" y="29" text-anchor="middle" fill="#6366f1" font-size="10" font-weight="bold">FT</text>
        <line x1="60" y1="40" x2="60" y2="55" stroke="#6366f1" stroke-width="2.5" />
        <rect x="36" y="55" width="48" height="12" rx="3" fill="#0f172a" stroke="#818cf8" stroke-width="2" />
        <line x1="10" y1="61" x2="36" y2="61" stroke="#38bdf8" stroke-width="4" />
        <line x1="84" y1="61" x2="110" y2="61" stroke="#38bdf8" stroke-width="4" />
      </svg>`,
      jsxSnippet: `<g transform="translate(X, Y)"><circle cx="0" cy="-20" r="16" fill="#0f172a" stroke="#6366f1" stroke-width="2.5"/><text x="0" y="-15" text-anchor="middle" fill="#6366f1" font-size="10" font-weight="bold">FT</text><line x1="0" y1="-4" x2="0" y2="10" stroke="#6366f1" stroke-width="2.5"/><rect x="-24" y="10" width="48" height="12" rx="3" fill="#0f172a" stroke="#818cf8" stroke-width="2"/></g>`
    },

    // 21. Conductivity Sensor (CT)
    conductivity: {
      type: 'conductivity',
      variant: 'default',
      name: 'Cond Sensor (CT)',
      category: 'sensors',
      badge: 'CT',
      description: 'Coolant purity & contamination monitor.',
      ports: [
        { name: 'tap', cx: 0, cy: 28 }
      ],
      renderCanvas: function(id, x, y, rot, scale) {
        return `<g id="${id}" transform="translate(${x}, ${y}) rotate(${rot}) scale(${scale})" class="draggable-item comp-item" data-type="comp" data-x="${x}" data-y="${y}" data-rot="${rot}" data-scale="${scale}">
          <line x1="0" y1="10" x2="0" y2="28" stroke="#8b5cf6" stroke-width="2"/>
          <circle cx="0" cy="0" r="14" fill="#0f172a" stroke="#8b5cf6" stroke-width="2"/>
          <line x1="-14" y1="0" x2="14" y2="0" stroke="#8b5cf6" stroke-width="1"/>
          <text x="0" y="-3" text-anchor="middle" fill="#8b5cf6" font-size="8" font-weight="bold">CT</text>
          <text x="0" y="8" text-anchor="middle" fill="#f8fafc" font-size="7">COND</text>
          <circle cx="0" cy="28" r="4.5" class="port-dot" data-port="tap"/>
        </g>`;
      },
      previewSvg: `<svg width="90" height="70" viewBox="0 0 120 100">
        <line x1="60" y1="42" x2="60" y2="70" stroke="#8b5cf6" stroke-width="2.5" />
        <circle cx="60" cy="26" r="18" fill="#0f172a" stroke="#8b5cf6" stroke-width="2.5" />
        <line x1="42" y1="26" x2="78" y2="26" stroke="#8b5cf6" stroke-width="1.5" />
        <text x="60" y="21" text-anchor="middle" fill="#8b5cf6" font-size="10" font-weight="bold">CT</text>
        <text x="60" y="36" text-anchor="middle" fill="#f8fafc" font-size="9">COND</text>
        <line x1="20" y1="70" x2="100" y2="70" stroke="#38bdf8" stroke-width="4" />
      </svg>`,
      jsxSnippet: `<g transform="translate(X, Y)"><line x1="0" y1="16" x2="0" y2="44" stroke="#8b5cf6" stroke-width="2.5"/><circle cx="0" cy="0" r="18" fill="#0f172a" stroke="#8b5cf6" stroke-width="2.5"/><line x1="-18" y1="0" x2="18" y2="0" stroke="#8b5cf6" stroke-width="1.5"/><text x="0" y="-5" text-anchor="middle" fill="#8b5cf6" font-size="10" font-weight="bold">CT</text><text x="0" y="10" text-anchor="middle" fill="#f8fafc" font-size="9">COND</text></g>`
    },

    // 22. Automatic Air Vent Valve
    airvent: {
      type: 'airvent',
      variant: 'default',
      name: 'Air Vent Valve',
      category: 'vessels',
      badge: 'AIR VENT',
      description: 'Releases trapped air pockets from piping loops.',
      ports: [
        { name: 'conn', cx: 0, cy: 20 }
      ],
      renderCanvas: function(id, x, y, rot, scale) {
        return `<g id="${id}" transform="translate(${x}, ${y}) rotate(${rot}) scale(${scale})" class="draggable-item comp-item" data-type="comp" data-x="${x}" data-y="${y}" data-rot="${rot}" data-scale="${scale}">
          <line x1="0" y1="5" x2="0" y2="20" stroke="#f43f5e" stroke-width="2"/>
          <polygon points="-8,5 8,5 0,-12" fill="#0f172a" stroke="#f43f5e" stroke-width="2"/>
          <path d="M -4 -16 L 0 -22 L 4 -16" fill="none" stroke="#f43f5e" stroke-width="1.5"/>
          <text x="0" y="32" text-anchor="middle" fill="#94a3b8" font-size="8" font-weight="bold">AIR VENT</text>
          <circle cx="0" cy="20" r="4.5" class="port-dot" data-port="conn"/>
        </g>`;
      },
      previewSvg: `<svg width="90" height="70" viewBox="0 0 120 100">
        <line x1="60" y1="55" x2="60" y2="75" stroke="#f43f5e" stroke-width="2.5" />
        <polygon points="48,55 72,55 60,32" fill="#0f172a" stroke="#f43f5e" stroke-width="2.5" />
        <path d="M 54 26 L 60 18 L 66 26" fill="none" stroke="#f43f5e" stroke-width="2" />
        <line x1="20" y1="75" x2="100" y2="75" stroke="#38bdf8" stroke-width="4" />
        <text x="60" y="93" text-anchor="middle" fill="#94a3b8" font-size="9" font-weight="bold">AIR VENT</text>
      </svg>`,
      jsxSnippet: `<g transform="translate(X, Y)"><line x1="0" y1="5" x2="0" y2="25" stroke="#f43f5e" stroke-width="2.5"/><polygon points="-12,5 12,5 0,-18" fill="#0f172a" stroke="#f43f5e" stroke-width="2.5"/><path d="M -6 -24 L 0 -32 L 6 -24" fill="none" stroke="#f43f5e" stroke-width="2"/><text x="0" y="40" text-anchor="middle" fill="#94a3b8" font-size="9">AIR VENT</text></g>`
    },

    // 23. Manual Hand Valve
    handvalve: {
      type: 'handvalve',
      variant: 'default',
      name: 'Hand Valve',
      category: 'valves',
      badge: 'MANUAL',
      description: 'Manual ball/gate shut-off isolation valve.',
      ports: [
        { name: 'in', cx: -10, cy: 0 },
        { name: 'out', cx: 10, cy: 0 }
      ],
      renderCanvas: function(id, x, y, rot, scale) {
        return `<g id="${id}" transform="translate(${x}, ${y}) rotate(${rot}) scale(${scale})" class="draggable-item comp-item" data-type="comp" data-x="${x}" data-y="${y}" data-rot="${rot}" data-scale="${scale}">
          <path d="M -10 -10 L 10 10 L -10 10 L 10 -10 Z" fill="#0f172a" stroke="#94a3b8" stroke-width="1.8"/>
          <line x1="0" y1="-10" x2="0" y2="-16" stroke="#94a3b8" stroke-width="1.8"/>
          <line x1="-6" y1="-16" x2="6" y2="-16" stroke="#94a3b8" stroke-width="1.8"/>
          <text x="0" y="24" text-anchor="middle" fill="#94a3b8" font-size="8" font-weight="bold">HAND VALVE</text>
          <circle cx="-10" cy="0" r="4.5" class="port-dot" data-port="in"/>
          <circle cx="10" cy="0" r="4.5" class="port-dot" data-port="out"/>
        </g>`;
      },
      previewSvg: `<svg width="90" height="70" viewBox="0 0 120 100">
        <polygon points="40,38 80,62 40,62 80,38" fill="#0f172a" stroke="#94a3b8" stroke-width="2" />
        <line x1="60" y1="38" x2="60" y2="24" stroke="#94a3b8" stroke-width="2" />
        <line x1="48" y1="24" x2="72" y2="24" stroke="#94a3b8" stroke-width="2" />
        <line x1="15" y1="50" x2="40" y2="50" stroke="#38bdf8" stroke-width="3" />
        <line x1="80" y1="50" x2="105" y2="50" stroke="#38bdf8" stroke-width="3" />
        <text x="60" y="86" text-anchor="middle" fill="#94a3b8" font-size="9" font-weight="bold">HAND VALVE</text>
      </svg>`,
      jsxSnippet: `<g transform="translate(X, Y)"><path d="M -10 -10 L 10 10 L -10 10 L 10 -10 Z" fill="#0f172a" stroke="#94a3b8" stroke-width="1.8"/><line x1="0" y1="-10" x2="0" y2="-16" stroke="#94a3b8" stroke-width="1.8"/><line x1="-6" y1="-16" x2="6" y2="-16" stroke="#94a3b8" stroke-width="1.8"/><text x="0" y="24" text-anchor="middle" fill="#94a3b8" font-size="8">HAND VALVE</text></g>`
    },

    // 24. Nitrogen (N2) Supply Bottle
    n2bottle: {
      type: 'n2bottle',
      variant: 'default',
      name: 'N2 Bottle',
      category: 'vessels',
      badge: 'GAS',
      description: 'High-pressure N2 purge/charging cylinder.',
      ports: [
        { name: 'out', cx: 0, cy: -40 }
      ],
      renderCanvas: function(id, x, y, rot, scale) {
        return `<g id="${id}" transform="translate(${x}, ${y}) rotate(${rot}) scale(${scale})" class="draggable-item comp-item" data-type="comp" data-x="${x}" data-y="${y}" data-rot="${rot}" data-scale="${scale}">
          <rect x="-18" y="-30" width="36" height="70" rx="8" fill="#0f172a" stroke="#ffde59" stroke-width="2"/>
          <path d="M -18 -15 C -18 -35, 18 -35, 18 -15" fill="#0f172a" stroke="#ffde59" stroke-width="2"/>
          <rect x="-8" y="-40" width="16" height="10" fill="#0f172a" stroke="#ffde59" stroke-width="1.5"/>
          <text x="0" y="8" fill="#ffde59" font-size="7.5" font-weight="bold" text-anchor="middle" transform="rotate(-90 0 8)">NITROGEN_N2</text>
          <circle cx="0" cy="-40" r="4.5" class="port-dot" data-port="out"/>
        </g>`;
      },
      previewSvg: `<svg width="90" height="70" viewBox="0 0 120 100">
        <rect x="42" y="24" width="36" height="65" rx="8" fill="#0f172a" stroke="#ffde59" stroke-width="2" />
        <path d="M 42 38 C 42 16, 78 16, 78 38" fill="#0f172a" stroke="#ffde59" stroke-width="2" />
        <rect x="52" y="10" width="16" height="10" fill="#0f172a" stroke="#ffde59" stroke-width="1.5" />
        <text x="60" y="58" fill="#ffde59" font-size="8" font-weight="bold" text-anchor="middle" transform="rotate(-90 60 58)">NITROGEN_N2</text>
      </svg>`,
      jsxSnippet: `<g transform="translate(X, Y)"><rect x="-18" y="-30" width="36" height="70" rx="8" fill="#0f172a" stroke="#ffde59" stroke-width="2"/><path d="M -18 -15 C -18 -35, 18 -35, 18 -15" fill="#0f172a" stroke="#ffde59" stroke-width="2"/><rect x="-8" y="-40" width="16" height="10" fill="#0f172a" stroke="#ffde59" stroke-width="1.5"/><text x="0" y="8" fill="#ffde59" font-size="7.5" font-weight="bold" text-anchor="middle" transform="rotate(-90 0 8)">NITROGEN_N2</text></g>`
    },

    // 25. Water Quality Sensor Grid
    wqgrid: {
      type: 'wqgrid',
      variant: 'default',
      name: 'Quality Grid',
      category: 'sensors',
      badge: 'QUALITY',
      description: 'Integrated pH, EC, ORP & turbidity telemetry.',
      ports: [
        { name: 'tap', cx: 0, cy: 14 }
      ],
      renderCanvas: function(id, x, y, rot, scale) {
        return `<g id="${id}" transform="translate(${x}, ${y}) rotate(${rot}) scale(${scale})" class="draggable-item comp-item" data-type="comp" data-x="${x}" data-y="${y}" data-rot="${rot}" data-scale="${scale}">
          <rect x="-45" y="-14" width="90" height="28" rx="3" fill="#0f172a" stroke="#10b981" stroke-width="1.5"/>
          <text x="-25" y="-2" fill="#f8fafc" font-size="6.5">pH: <tspan fill="#10b981" font-weight="bold">7.3</tspan></text>
          <text x="12" y="-2" fill="#f8fafc" font-size="6.5">EC: <tspan fill="#10b981" font-weight="bold">118</tspan></text>
          <text x="-25" y="8" fill="#f8fafc" font-size="6.5">ORP: <tspan fill="#10b981" font-weight="bold">245</tspan></text>
          <text x="12" y="8" fill="#f8fafc" font-size="6.5">TU: <tspan fill="#10b981" font-weight="bold">0.3</tspan></text>
          <text x="0" y="24" text-anchor="middle" fill="#94a3b8" font-size="7" font-weight="bold">QUALITY_GRID</text>
          <circle cx="0" cy="14" r="4.5" class="port-dot" data-port="tap"/>
        </g>`;
      },
      previewSvg: `<svg width="90" height="70" viewBox="0 0 140 100">
        <rect x="15" y="24" width="110" height="38" rx="3" fill="#0f172a" stroke="#10b981" stroke-width="1.5" />
        <text x="35" y="42" fill="#f8fafc" font-size="9">pH: <tspan fill="#10b981" font-weight="bold">7.3</tspan></text>
        <text x="80" y="42" fill="#f8fafc" font-size="9">EC: <tspan fill="#10b981" font-weight="bold">118</tspan></text>
        <text x="35" y="55" fill="#f8fafc" font-size="9">ORP: <tspan fill="#10b981" font-weight="bold">245</tspan></text>
        <text x="80" y="55" fill="#f8fafc" font-size="9">TU: <tspan fill="#10b981" font-weight="bold">0.3</tspan></text>
        <text x="70" y="80" text-anchor="middle" fill="#94a3b8" font-size="8.5" font-weight="bold">QUALITY_GRID</text>
      </svg>`,
      jsxSnippet: `<g transform="translate(X, Y)"><rect x="-45" y="-14" width="90" height="28" rx="3" fill="#0f172a" stroke="#10b981" stroke-width="1.5"/><text x="-25" y="-2" fill="#f8fafc" font-size="6.5">pH: <tspan fill="#10b981" font-weight="bold">7.3</tspan></text><text x="12" y="-2" fill="#f8fafc" font-size="6.5">EC: <tspan fill="#10b981" font-weight="bold">118</tspan></text><text x="-25" y="8" fill="#f8fafc" font-size="6.5">ORP: <tspan fill="#10b981" font-weight="bold">245</tspan></text><text x="12" y="8" fill="#f8fafc" font-size="6.5">TU: <tspan fill="#10b981" font-weight="bold">0.3</tspan></text><text x="0" y="24" text-anchor="middle" fill="#94a3b8" font-size="7">QUALITY_GRID</text></g>`
    },

    // 26. Vacuum Pump Unit
    vacpump: {
      type: 'vacpump',
      variant: 'default',
      name: 'Vacuum Pump',
      category: 'pumps',
      badge: 'VACUUM',
      description: 'Negative pressure gas/liquid evacuator.',
      ports: [
        { name: 'in', cx: -18, cy: 0 },
        { name: 'out', cx: 18, cy: 0 }
      ],
      renderCanvas: function(id, x, y, rot, scale, anim) {
        return `<g id="${id}" transform="translate(${x}, ${y}) rotate(${rot}) scale(${scale})" class="draggable-item comp-item" data-type="comp" data-x="${x}" data-y="${y}" data-rot="${rot}" data-scale="${scale}">
          <circle cx="0" cy="0" r="18" fill="#0f172a" stroke="#818cf8" stroke-width="2"/>
          <g class="${anim ? 'spin-target spin-active' : 'spin-target'}" style="transform-origin: 0px 0px;">
            <path d="M -10 0 L 10 0 M 0 -10 L 0 10" stroke="#818cf8" stroke-width="2"/>
          </g>
          <text x="0" y="30" text-anchor="middle" fill="#94a3b8" font-size="8" font-weight="bold">VAC_PUMP</text>
          <circle cx="-18" cy="0" r="4.5" class="port-dot" data-port="in"/>
          <circle cx="18" cy="0" r="4.5" class="port-dot" data-port="out"/>
        </g>`;
      },
      previewSvg: `<svg width="90" height="70" viewBox="0 0 120 100">
        <circle cx="60" cy="45" r="22" fill="#0f172a" stroke="#818cf8" stroke-width="2" />
        <g class="spin-target spin-active" style="transform-origin: 60px 45px;">
          <path d="M 48 45 H 72 M 60 33 V 57" stroke="#818cf8" stroke-width="2.5" />
        </g>
        <line x1="15" y1="45" x2="38" y2="45" stroke="#38bdf8" stroke-width="3" />
        <line x1="82" y1="45" x2="105" y2="45" stroke="#38bdf8" stroke-width="3" />
        <text x="60" y="84" text-anchor="middle" fill="#94a3b8" font-size="9" font-weight="bold">VAC_PUMP</text>
      </svg>`,
      jsxSnippet: `<g transform="translate(X, Y)"><circle cx="0" cy="0" r="18" fill="#0f172a" stroke="#818cf8" stroke-width="2"/><g><path d="M -10 0 L 10 0 M 0 -10 L 0 10" stroke="#818cf8" stroke-width="2"/></g><text x="0" y="30" text-anchor="middle" fill="#94a3b8" font-size="8">VAC_PUMP</text></g>`
    },

    // 27. Vacuum Chamber
    vacchamber: {
      type: 'vacchamber',
      variant: 'default',
      name: 'Vacuum Chamber',
      category: 'vessels',
      badge: 'CHAMBER',
      description: 'Sealed vacuum vessel with interior agitator.',
      ports: [
        { name: 'in', cx: -65, cy: 0 },
        { name: 'out', cx: 65, cy: 0 },
        { name: 'top', cx: 0, cy: -90 },
        { name: 'bottom', cx: 0, cy: 90 }
      ],
      renderCanvas: function(id, x, y, rot, scale, anim) {
        return `<g id="${id}" transform="translate(${x}, ${y}) rotate(${rot}) scale(${scale})" class="draggable-item comp-item" data-type="comp" data-x="${x}" data-y="${y}" data-rot="${rot}" data-scale="${scale}">
          <rect x="-65" y="-90" width="130" height="180" rx="8" fill="#0f172a" stroke="#818cf8" stroke-width="1.5"/>
          <rect x="-57" y="-82" width="114" height="164" rx="4" fill="none" stroke="#818cf8" stroke-width="0.8" opacity="0.5"/>
          <circle cx="0" cy="0" r="25" stroke="#818cf8" stroke-width="1" stroke-dasharray="4 2" fill="none"/>
          <g class="${anim ? 'spin-target spin-active' : 'spin-target'}" style="transform-origin: 0px 0px;">
            <path d="M 0 -20 L 0 20 M -20 0 L 20 0" stroke="#818cf8" stroke-width="2"/>
          </g>
          <text x="0" y="-55" fill="#818cf8" font-size="10" font-weight="bold" font-family="sans-serif" text-anchor="middle">VACUUM_CHAMBER</text>
          <circle cx="-65" cy="0" r="4.5" class="port-dot" data-port="in"/>
          <circle cx="65" cy="0" r="4.5" class="port-dot" data-port="out"/>
          <circle cx="0" cy="-90" r="4.5" class="port-dot" data-port="top"/>
          <circle cx="0" cy="90" r="4.5" class="port-dot" data-port="bottom"/>
        </g>`;
      },
      previewSvg: `<svg width="90" height="70" viewBox="0 0 140 100">
        <rect x="25" y="10" width="90" height="75" rx="6" fill="#0f172a" stroke="#818cf8" stroke-width="1.8" />
        <rect x="31" y="16" width="78" height="63" rx="4" fill="none" stroke="#818cf8" stroke-width="0.8" opacity="0.4" />
        <circle cx="70" cy="48" r="18" stroke="#818cf8" stroke-width="1" stroke-dasharray="3 2" fill="none" />
        <g class="spin-target spin-active" style="transform-origin: 70px 48px;">
          <path d="M 70 34 L 70 62 M 56 48 L 84 48" stroke="#818cf8" stroke-width="2" />
        </g>
        <text x="70" y="30" text-anchor="middle" fill="#818cf8" font-size="7.5" font-weight="bold">VACUUM_CHAMBER</text>
      </svg>`,
      jsxSnippet: `<g transform="translate(X, Y)"><rect x="0" y="0" width="130" height="180" rx="8" fill="#0f172a" stroke="#818cf8" stroke-width="1.5" /><rect x="8" y="8" width="114" height="164" rx="4" fill="none" stroke="#818cf8" stroke-width="0.8" opacity="0.5" /><circle cx="65" cy="90" r="25" stroke="#818cf8" stroke-width="1" stroke-dasharray="4 2" fill="none" /><g class="spin-target spin-active" style="transform-origin: 65px 90px;"><path d="M 65 70 L 65 110 M 45 90 L 85 90" stroke="#818cf8" stroke-width="2" /></g><text x="65" y="40" fill="#818cf8" fontSize="10" fontWeight="bold" textAnchor="middle">VACUUM_CHAMBER</text></g>`
    },

    // 28. Static Header Text Label
    text_header: {
      type: 'text',
      variant: 'header',
      name: 'Loop Header Text',
      category: 'labels',
      badge: 'HEADER',
      description: 'System loop title & header annotation.',
      ports: [],
      renderCanvas: function(id, x, y, rot, scale) {
        return `<g id="${id}" transform="translate(${x}, ${y}) rotate(${rot}) scale(${scale})" class="draggable-item comp-item" data-type="comp" data-x="${x}" data-y="${y}" data-rot="${rot}" data-scale="${scale}">
          <text x="0" y="0" fill="#94a3b8" font-size="11" font-weight="bold" font-family="sans-serif" text-anchor="middle" dominant-baseline="central">PRIMARY_LOOP</text>
        </g>`;
      },
      previewSvg: `<svg width="110" height="70" viewBox="0 0 160 80">
        <text x="80" y="45" fill="#94a3b8" font-size="12" font-weight="bold" font-family="sans-serif" text-anchor="middle">PRIMARY_LOOP</text>
      </svg>`,
      jsxSnippet: `<text x="X" y="Y" fill="#94a3b8" font-size="11" font-weight="bold" font-family="sans-serif" text-anchor="middle">PRIMARY_LOOP</text>`
    },

    // 29. Telemetry Reading Callout Badge
    text_telemetry: {
      type: 'text',
      variant: 'telemetry',
      name: 'Telemetry Badge',
      category: 'labels',
      badge: 'TELEMETRY',
      description: 'Dual Temp/Pressure HUD telemetry callout.',
      ports: [],
      renderCanvas: function(id, x, y, rot, scale) {
        return `<g id="${id}" transform="translate(${x}, ${y}) rotate(${rot}) scale(${scale})" class="draggable-item comp-item" data-type="comp" data-x="${x}" data-y="${y}" data-rot="${rot}" data-scale="${scale}">
          <rect x="-45" y="-22" width="90" height="44" rx="3" fill="rgba(15,23,42,0.9)" stroke="#38bdf8" stroke-width="1.2"/>
          <text x="0" y="-4" fill="#38bdf8" font-size="10" font-weight="bold" font-family="monospace" text-anchor="middle">T1: 22.5°C</text>
          <text x="0" y="12" fill="#94a3b8" font-size="8.5" font-family="monospace" text-anchor="middle">P1: 45.2 psi</text>
        </g>`;
      },
      previewSvg: `<svg width="110" height="70" viewBox="0 0 140 80">
        <rect x="20" y="15" width="100" height="50" rx="3" fill="rgba(15,23,42,0.9)" stroke="#38bdf8" stroke-width="1.2" />
        <text x="70" y="35" fill="#38bdf8" font-size="11" font-weight="bold" font-family="monospace" text-anchor="middle">T1: 22.5°C</text>
        <text x="70" y="52" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">P1: 45.2 psi</text>
      </svg>`,
      jsxSnippet: `<g transform="translate(X, Y)"><rect x="-45" y="-22" width="90" height="44" rx="3" fill="rgba(15,23,42,0.9)" stroke="#38bdf8" stroke-width="1.2"/><text x="0" y="-4" fill="#38bdf8" font-size="10" font-weight="bold" font-family="monospace" text-anchor="middle">T1: 22.5°C</text><text x="0" y="12" fill="#94a3b8" font-size="8.5" font-family="monospace" text-anchor="middle">P1: 45.2 psi</text></g>`
    },

    // 30. Boundary Zone Box
    box: {
      type: 'box',
      variant: 'default',
      name: 'Boundary Box',
      category: 'labels',
      badge: 'BOUNDARY',
      description: 'HUD dashed partition frame for subsystem loops.',
      ports: [],
      renderCanvas: function(id, x, y, rot, scale) {
        return `<g id="${id}" transform="translate(${x}, ${y}) rotate(${rot}) scale(${scale})" class="draggable-item comp-item" data-type="comp" data-x="${x}" data-y="${y}" data-rot="${rot}" data-scale="${scale}">
          <rect x="-80" y="-50" width="160" height="100" rx="6" fill="rgba(15,23,42,0.4)" stroke="rgba(56, 189, 248, 0.4)" stroke-width="1.5" stroke-dasharray="4 3"/>
          <text x="-70" y="-36" fill="#94a3b8" font-size="8" font-weight="bold" font-family="sans-serif">SUBSYSTEM_ZONE</text>
        </g>`;
      },
      previewSvg: `<svg width="110" height="70" viewBox="0 0 140 80">
        <rect x="15" y="10" width="110" height="60" rx="3" fill="none" stroke="rgba(56, 189, 248, 0.4)" stroke-width="1.5" stroke-dasharray="4 3" />
        <text x="25" y="24" fill="#94a3b8" font-size="7.5" font-weight="bold">FACILITY_ZONE</text>
      </svg>`,
      jsxSnippet: `<g transform="translate(X, Y)"><rect x="-70" y="-45" width="140" height="90" rx="4" fill="none" stroke="rgba(56, 189, 248, 0.4)" stroke-width="1.5" stroke-dasharray="4 3"/><text x="-60" y="-30" fill="#94a3b8" font-size="8" font-weight="bold">SYSTEM_ZONE</text></g>`
    }
  };

  // Helper function to format an SVG string for palette buttons by setting root width and height
  function formatIconSvg(svgStr, width, height) {
    if (!svgStr) return '';
    return svgStr.replace(/<svg\b([^>]*)>/i, function(match, attrs) {
      var updated = attrs;
      if (/\bwidth="[^"]*"/i.test(updated)) {
        updated = updated.replace(/\bwidth="[^"]*"/i, 'width="' + width + '"');
      } else {
        updated += ' width="' + width + '"';
      }
      if (/\bheight="[^"]*"/i.test(updated)) {
        updated = updated.replace(/\bheight="[^"]*"/i, 'height="' + height + '"');
      } else {
        updated += ' height="' + height + '"';
      }
      return '<svg ' + updated + '>';
    });
  }

  // Helper function to dynamically render all catalog cards
  function renderCatalogGrid(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let html = '';
    for (const key in CDU_COMPONENTS) {
      const comp = CDU_COMPONENTS[key];
      html += `
        <div class="component-card cat-${comp.category} bg-[var(--card,#1e293b)] border border-[var(--border,#334155)] rounded-xl p-3 transition flex flex-col justify-between">
          <div>
            <div class="flex justify-between items-center mb-1.5">
              <span class="text-[10px] font-bold uppercase tracking-wider text-blue-400">${comp.category.toUpperCase()}</span>
              <span class="text-[9px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20">${comp.badge}</span>
            </div>
            <h3 class="font-semibold text-xs mb-0.5 truncate" title="${comp.name}">${comp.name}</h3>
            <p class="text-[10px] text-[var(--muted-foreground,#94a3b8)] mb-2 line-clamp-2">${comp.description}</p>
            <div class="bg-[var(--background,#0f172a)] rounded-lg p-2 flex justify-center items-center border border-[var(--border,#334155)] mb-2.5 h-24">
              ${comp.previewSvg}
            </div>
          </div>
          <div class="flex gap-1.5">
            <button onclick="addSandboxItem('${comp.type}', '${comp.variant}')" class="flex-1 py-1.5 bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white text-[11px] font-medium rounded-lg transition flex items-center justify-center gap-1 border border-blue-500/30">
              ➕ Add
            </button>
            <button onclick="copySnippet(this)" data-snippet="${comp.jsxSnippet.replace(/"/g, '&quot;')}" class="flex-1 py-1.5 bg-[var(--border,#334155)] hover:bg-slate-700 text-[11px] font-medium rounded-lg transition flex items-center justify-center gap-1">
              📋 Copy
            </button>
          </div>
        </div>`;
    }
    container.innerHTML = html;
  }

  // Helper function to dynamically render desktop component palette buttons
  function renderDesktopPalette(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let html = '';
    for (const key in CDU_COMPONENTS) {
      const comp = CDU_COMPONENTS[key];
      const iconSvg = formatIconSvg(comp.previewSvg, 32, 32);
      html += `
        <button onclick="addSandboxItem('${comp.type}', '${comp.variant}')" class="palette-btn" aria-label="${comp.name}">
          <div class="palette-icon-wrap w-8 h-8 flex items-center justify-center pointer-events-none">
            ${iconSvg}
          </div>
          <span class="palette-tooltip">${comp.name}</span>
        </button>`;
    }
    container.innerHTML = html;
  }

  // Helper function to dynamically render mobile toolbox parts drawer buttons
  function renderMobilePalette(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const catColorMap = {
      pumps: 'text-blue-400 hover:border-blue-400',
      valves: 'text-emerald-400 hover:border-emerald-400',
      vessels: 'text-amber-400 hover:border-amber-400',
      sensors: 'text-purple-400 hover:border-purple-400',
      labels: 'text-sky-400 hover:border-sky-400'
    };

    let html = '';
    for (const key in CDU_COMPONENTS) {
      const comp = CDU_COMPONENTS[key];
      const colorCls = catColorMap[comp.category] || 'text-blue-400 hover:border-blue-400';
      const iconSvg = formatIconSvg(comp.previewSvg, 22, 22);
      html += `
        <div class="relative group">
          <button onclick="addSandboxItemAndClose('${comp.type}', '${comp.variant}')" class="palette-btn w-full h-12 flex flex-col items-center justify-center p-1 text-[10px] text-slate-300">
            <div class="palette-icon-wrap w-5 h-5 flex items-center justify-center pointer-events-none">
              ${iconSvg}
            </div>
            <span class="truncate mt-0.5 w-full text-center">${comp.name}</span>
          </button>
          <button onclick="event.stopPropagation(); showComponentDetails('${key}');" class="absolute -top-1.5 -right-1.5 w-5 h-5 bg-slate-800 ${colorCls} border border-slate-700 rounded-full flex items-center justify-center text-[10px] font-bold shadow-md z-10" title="Inspect ${comp.name} Details">ⓘ</button>
        </div>`;
    }
    container.innerHTML = html;
  }

  // Export to global window object
  window.CDU_COMPONENTS = CDU_COMPONENTS;
  window.renderCatalogGrid = renderCatalogGrid;
  window.renderDesktopPalette = renderDesktopPalette;
  window.renderMobilePalette = renderMobilePalette;

})(window);
