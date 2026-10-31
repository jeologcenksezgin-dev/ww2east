const fs = require('fs');

const svgData = JSON.parse(fs.readFileSync('generated_svg_data.json', 'utf8'));

// Format countries SVG
const countryPaths = svgData.countries.map(c => {
  return `            <path id="${c.id}" class="country ${c.cls}" d="${c.d}" title="${c.name}"/>`;
}).join('\n');

// Real Rivers SVG Paths based on Europe coordinates
const riversSvg = `
          <!-- Major European Rivers & Natural Barriers -->
          <g id="rivers-layer" class="map-layer">
            <!-- Rhine (Ren) -->
            <path class="river" d="M 625,660 Q 610,610 595,570 T 585,530 T 545,500" title="Ren Nehri (Rhine)"/>
            <!-- Danube (Tuna) -->
            <path class="river" d="M 640,630 Q 720,620 800,615 T 841,648 T 880,720 T 930,730 T 1030,715" title="Tuna Nehri (Danube)"/>
            <!-- Dnieper (Dnyepr) - Vital Barbarossa Barrier -->
            <path class="river" d="M 1045,410 Q 1055,470 1062,537 T 1145,630 T 1110,690" title="Dnyepr Nehri (Sovyet Savunma Hattı)"/>
            <!-- Don River -->
            <path class="river" d="M 1150,420 Q 1200,470 1280,510 T 1320,530 T 1250,640" title="Don Nehri"/>
            <!-- Volga River -->
            <path class="river" d="M 1090,320 Q 1180,340 1260,360 T 1360,390 T 1410,440 T 1341,514 T 1390,660" title="Volga Nehri (Stalingrad Cephesi)"/>
            <!-- Elbe River -->
            <path class="river" d="M 770,550 Q 745,510 710,460 T 660,430" title="Elbe Nehri"/>
            <!-- Vistula (Visla) -->
            <path class="river" d="M 870,590 Q 860,540 876,502 T 860,435" title="Visla Nehri"/>
          </g>
`;

// Real Cities with Accurate Coordinates
const citiesList = [
  { id: 'Berlin', name: 'Berlin', x: 735, y: 492, type: 'capital', cls: '' },
  { id: 'Moskova', name: 'MOSKOVA', x: 1152, y: 350, type: 'capital red-cap', cls: 'major-label' },
  { id: 'Leningrad', name: 'Leningrad', x: 1008, y: 252, type: 'city red-cap', cls: 'major-label' },
  { id: 'Stalingrad', name: 'Stalingrad', x: 1341, y: 514, type: 'city red-cap', cls: 'major-label' },
  { id: 'Kiev', name: 'Kiev', x: 1062, y: 537, type: 'city', cls: '' },
  { id: 'Minsk', name: 'Minsk', x: 991, y: 441, type: 'city', cls: '' },
  { id: 'Varşova', name: 'Varşova', x: 876, y: 502, type: 'city', cls: '' },
  { id: 'Paris', name: 'Paris', x: 508, y: 573, type: 'capital', cls: '' },
  { id: 'Londra', name: 'Londra', x: 479, y: 482, type: 'capital', cls: '' },
  { id: 'Sedan', name: 'Sedan', x: 564, y: 558, type: 'city', cls: '' },
  { id: 'Kursk', name: 'Kursk', x: 1160, y: 475, type: 'city', cls: '' },
  { id: 'Bakü', name: 'Bakü (Petrol)', x: 1540, y: 706, type: 'city oil-cap', cls: '' },
  { id: 'Roma', name: 'Roma', x: 694, y: 814, type: 'capital', cls: '' },
  { id: 'Helsinki', name: 'Helsinki', x: 925, y: 256, type: 'city', cls: '' },
  { id: 'Stokholm', name: 'Stokholm', x: 821, y: 287, type: 'city', cls: '' },
  { id: 'Bükreş', name: 'Bükreş', x: 997, y: 732, type: 'city', cls: '' },
  { id: 'Budapeşte', name: 'Budapeşte', x: 841, y: 648, type: 'city', cls: '' },
  { id: 'Kırım-Sivastopol', name: 'Sivastopol', x: 1165, y: 690, type: 'city red-cap', cls: '' },
  { id: 'Smolensk', name: 'Smolensk', x: 1060, y: 405, type: 'city', cls: '' }
];

const citiesSvg = `
          <!-- Strategic Cities & Strongpoints -->
          <g id="cities-layer" class="map-layer">
${citiesList.map(c => `            <g class="city-point" data-city="${c.id}" transform="translate(${c.x}, ${c.y})">
              <circle r="${c.type.includes('capital') ? 5 : 4}" class="${c.type.includes('capital') ? 'capital-ring ' + c.type : 'city-dot ' + c.type}"/>
              ${c.type.includes('capital') ? `<circle r="3" class="capital-dot"/>` : ''}
              <text x="8" y="4" class="city-label ${c.cls}">${c.name}</text>
            </g>`).join('\n')}
          </g>
`;

// Assemble the full updated index.html
const htmlContent = `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WW2 Strateji Harp Akademisi | HOI4 Gerçekçi Vektörel Harita</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Rajdhani:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <!-- HOI4 Top Navigation Bar -->
  <header id="hoi4-topbar">
    <div class="topbar-left">
      <div class="country-flag-badge" id="player-flag">
        <div class="flag-icon de-flag" title="Alman Reich'ı (1941)"></div>
        <div class="flag-frame"></div>
      </div>
      <div class="stat-item" title="Siyasi Güç (Political Power)">
        <span class="stat-icon icon-pp"></span>
        <span class="stat-val" id="val-pp">185</span>
        <span class="stat-growth text-green">+1.65</span>
      </div>
      <div class="stat-item" title="İstikrar (Stability)">
        <span class="stat-icon icon-stability"></span>
        <span class="stat-val">88%</span>
      </div>
      <div class="stat-item" title="Savaş Desteği (War Support)">
        <span class="stat-icon icon-warsupport"></span>
        <span class="stat-val">90%</span>
      </div>
      <div class="stat-item" title="İnsan Gücü (Manpower)">
        <span class="stat-icon icon-manpower"></span>
        <span class="stat-val">2.84M</span>
      </div>
      <div class="stat-item" title="Askeri ve Sivil Fabrikalar">
        <span class="stat-icon icon-factories"></span>
        <span class="stat-val">142 / 210</span>
      </div>
      <div class="stat-item" title="Akaryakıt Rezervi (Fuel)">
        <span class="stat-icon icon-fuel"></span>
        <span class="stat-val">1.2M</span>
        <span class="fuel-bar"><span class="fuel-fill"></span></span>
      </div>
      <div class="stat-item" title="Konvoylar (Convoys)">
        <span class="stat-icon icon-convoys"></span>
        <span class="stat-val">340</span>
      </div>
    </div>

    <!-- Center Scenario Selector -->
    <div class="topbar-center">
      <div class="scenario-selector-box">
        <span class="scenario-label">HAREKÂT DÖNEMİ:</span>
        <select id="scenario-select" onchange="changeScenario(this.value)">
          <option value="barbarossa" selected>Operasyon Barbarossa (1941 - Doğu Cephesi)</option>
          <option value="fall_gelb">Fall Gelb & Fransa Seferi (1940 - Batı Cephesi)</option>
          <option value="overlord">Overlord Harekâtı / D-Day (1944 - Normandiya)</option>
        </select>
      </div>
    </div>

    <!-- Right Controls: Date, Speed, World Tension -->
    <div class="topbar-right">
      <div class="tension-meter" title="Dünya Gerilimi (World Tension)">
        <div class="tension-flame"></div>
        <div class="tension-number" id="tension-val">100%</div>
      </div>
      
      <div class="clock-box">
        <div class="game-date" id="game-date">22 Haziran 1941, 04:00</div>
        <div class="speed-controls">
          <button class="btn-pause" id="btn-pause" title="Durdur / Devam Et (Boşluk Tuşu)">⏸</button>
          <div class="speed-ticks">
            <span class="speed-tick active" onclick="setSpeed(1)">1</span>
            <span class="speed-tick active" onclick="setSpeed(2)">2</span>
            <span class="speed-tick active" onclick="setSpeed(3)">3</span>
            <span class="speed-tick" onclick="setSpeed(4)">4</span>
            <span class="speed-tick" onclick="setSpeed(5)">5</span>
          </div>
        </div>
      </div>
    </div>
  </header>

  <!-- Main Strategy Viewport -->
  <main id="game-container">
    <!-- Map Canvas / SVG Stage -->
    <div id="map-viewport">
      <div id="map-world" class="map-world">
        <!-- SVG Interactive Real Geography Map -->
        <svg id="ww2-svg-map" viewBox="200 150 1350 850" preserveAspectRatio="xMidYMid slice">
          <defs>
            <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="2" dy="3" stdDeviation="3" flood-color="#000" flood-opacity="0.6"/>
            </filter>
            <filter id="plan-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="glow"/>
              <feMerge>
                <feMergeNode in="glow"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            
            <pattern id="sea-waves" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 0 25 Q 12 18, 25 25 T 50 25" fill="none" stroke="#253e52" stroke-width="0.8" opacity="0.35"/>
            </pattern>

            <!-- Arrow Markers -->
            <marker id="arrow-axis" viewBox="0 0 12 12" refX="8" refY="6" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
              <path d="M 0 1 L 10 6 L 0 11 z" fill="#00e5ff" stroke="#003744" stroke-width="1"/>
            </marker>
            <marker id="arrow-soviet" viewBox="0 0 12 12" refX="8" refY="6" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
              <path d="M 0 1 L 10 6 L 0 11 z" fill="#ff3b30" stroke="#4a0d0d" stroke-width="1"/>
            </marker>
            <marker id="arrow-allies" viewBox="0 0 12 12" refX="8" refY="6" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
              <path d="M 0 1 L 10 6 L 0 11 z" fill="#30d158" stroke="#0f441c" stroke-width="1"/>
            </marker>
          </defs>

          <!-- Sea Background -->
          <rect class="ocean-bg" x="-500" y="-500" width="3000" height="2000" fill="#14212d"/>
          <rect class="ocean-grid" x="-500" y="-500" width="3000" height="2000" fill="url(#sea-waves)"/>

          <!-- REAL EUROPE CONTINENTAL GEOGRAPHY -->
          <g id="countries-layer" class="map-layer">
${countryPaths}
          </g>

${riversSvg}

${citiesSvg}

          <!-- DYNAMIC TACTICAL LAYER (Frontlines, Spearheads, Pincers, Pockets) -->
          <g id="tactical-layer" class="map-layer">
            <!-- Frontlines -->
            <path id="frontline-main" class="frontline-path" d="M 900,360 L 930,440 L 950,510 L 965,600 L 980,690"/>

            <!-- Tactical Offensive Arrows (Battle Plans) -->
            <g id="offensive-arrows" filter="url(#plan-glow)">
              <!-- Dynamic by app.js -->
            </g>

            <!-- Encirclement Pocket Rings (Kessel) -->
            <g id="kessel-pockets">
              <!-- Dynamic by app.js -->
            </g>
          </g>

          <!-- HOI4 DIVISION COUNTERS LAYER -->
          <g id="division-counters" class="map-layer">
            <!-- German Divisions (Grey Box + Green Org) -->
            <g class="natocounter axis" id="cnt-north" transform="translate(910, 390)" onclick="inspectDivision('4th-panzer')">
              <rect class="counter-bg" width="46" height="26" rx="2"/>
              <rect class="counter-org" x="2" y="22" width="22" height="3"/>
              <rect class="counter-str" x="25" y="22" width="19" height="3"/>
              <text x="6" y="16" class="counter-icon">🛡️</text>
              <text x="24" y="16" class="counter-num">18.A</text>
            </g>
            <g class="natocounter axis tank" id="cnt-pz4" transform="translate(920, 425)" onclick="inspectDivision('3rd-panzer-group')">
              <rect class="counter-bg" width="48" height="26" rx="2"/>
              <rect class="counter-org" x="2" y="22" width="24" height="3"/>
              <rect class="counter-str" x="27" y="22" width="19" height="3"/>
              <text x="5" y="16" class="counter-icon">⚙️</text>
              <text x="24" y="16" class="counter-num">Pz.3</text>
            </g>
            <g class="natocounter axis tank" id="cnt-guderian" transform="translate(925, 485)" onclick="inspectDivision('guderian-pz')">
              <rect class="counter-bg" width="48" height="26" rx="2"/>
              <rect class="counter-org" x="2" y="22" width="24" height="3"/>
              <rect class="counter-str" x="27" y="22" width="19" height="3"/>
              <text x="5" y="16" class="counter-icon">⚙️</text>
              <text x="24" y="16" class="counter-num">Pz.2</text>
            </g>
            <g class="natocounter axis" id="cnt-4th-army" transform="translate(900, 520)" onclick="inspectDivision('4th-army')">
              <rect class="counter-bg" width="46" height="26" rx="2"/>
              <rect class="counter-org" x="2" y="22" width="22" height="3"/>
              <rect class="counter-str" x="25" y="22" width="19" height="3"/>
              <text x="6" y="16" class="counter-icon">🪖</text>
              <text x="24" y="16" class="counter-num">4.A</text>
            </g>
            <g class="natocounter axis tank" id="cnt-pz1" transform="translate(930, 580)" onclick="inspectDivision('1st-panzer-group')">
              <rect class="counter-bg" width="48" height="26" rx="2"/>
              <rect class="counter-org" x="2" y="22" width="24" height="3"/>
              <rect class="counter-str" x="27" y="22" width="19" height="3"/>
              <text x="5" y="16" class="counter-icon">⚙️</text>
              <text x="24" y="16" class="counter-num">Pz.1</text>
            </g>
            <g class="natocounter axis" id="cnt-6th-army" transform="translate(915, 620)" onclick="inspectDivision('6th-army')">
              <rect class="counter-bg" width="46" height="26" rx="2"/>
              <rect class="counter-org" x="2" y="22" width="22" height="3"/>
              <rect class="counter-str" x="25" y="22" width="19" height="3"/>
              <text x="6" y="16" class="counter-icon">🪖</text>
              <text x="24" y="16" class="counter-num">6.A</text>
            </g>

            <!-- Soviet Divisions (Red Box) -->
            <g class="natocounter soviet" id="cnt-sov-north" transform="translate(980, 390)" onclick="inspectDivision('soviet-north')">
              <rect class="counter-bg" width="46" height="26" rx="2"/>
              <rect class="counter-org low" x="2" y="22" width="12" height="3"/>
              <rect class="counter-str" x="15" y="22" width="29" height="3"/>
              <text x="6" y="16" class="counter-icon">★</text>
              <text x="24" y="16" class="counter-num">8.A</text>
            </g>
            <g class="natocounter soviet encircled" id="cnt-sov-minsk" transform="translate(990, 450)" onclick="inspectDivision('soviet-minsk-pocket')">
              <rect class="counter-bg" width="48" height="26" rx="2"/>
              <rect class="counter-org broken" x="2" y="22" width="4" height="3"/>
              <rect class="counter-str half" x="7" y="22" width="20" height="3"/>
              <text x="6" y="16" class="counter-icon">⚠</text>
              <text x="22" y="16" class="counter-num">3.A</text>
            </g>
            <g class="natocounter soviet" id="cnt-sov-moscow" transform="translate(1120, 360)" onclick="inspectDivision('soviet-reserve')">
              <rect class="counter-bg" width="46" height="26" rx="2"/>
              <rect class="counter-org" x="2" y="22" width="22" height="3"/>
              <rect class="counter-str" x="25" y="22" width="19" height="3"/>
              <text x="6" y="16" class="counter-icon">★</text>
              <text x="24" y="16" class="counter-num">16.A</text>
            </g>
            <g class="natocounter soviet encircled" id="cnt-sov-kiev" transform="translate(1045, 540)" onclick="inspectDivision('soviet-kiev-pocket')">
              <rect class="counter-bg" width="48" height="26" rx="2"/>
              <rect class="counter-org broken" x="2" y="22" width="6" height="3"/>
              <rect class="counter-str half" x="9" y="22" width="18" height="3"/>
              <text x="6" y="16" class="counter-icon">⚠</text>
              <text x="22" y="16" class="counter-num">5.A</text>
            </g>
          </g>

          <!-- HOI4 COMBAT BUBBLES LAYER -->
          <g id="combat-bubbles" class="map-layer">
            <!-- Dynamic by app.js -->
          </g>
        </svg>

        <!-- Map Floating Quick Legend / Overlays -->
        <div class="map-quick-overlay top-left-overlay">
          <div class="theatre-box-badge">
            <div class="theatre-title" id="theatre-title-txt">DOĞU CEPHESİ (OSTFRONT)</div>
            <div class="theatre-sub" id="theatre-sub-txt">152 Tümen • 3.4M Personel • Hava Üstünlüğü: %78</div>
          </div>
        </div>

        <div class="map-view-toggles">
          <button class="toggle-btn active" id="btn-toggle-arrows" onclick="toggleMapLayer('arrows')">🏹 Taarruz Planları</button>
          <button class="toggle-btn active" id="btn-toggle-counters" onclick="toggleMapLayer('counters')">🪖 Birlikler (NATO)</button>
          <button class="toggle-btn active" id="btn-toggle-battles" onclick="toggleMapLayer('battles')">⚔️ Muharebeler</button>
          <button class="toggle-btn" id="btn-toggle-air" onclick="toggleAirZone()">✈️ Hava & İkmal</button>
        </div>
      </div>
    </div>

    <!-- Right Side: HOI4 Theater & Field Marshals Panel -->
    <aside id="generals-panel">
      <div class="panel-header">
        <span class="panel-title">ORDU GRUPLARI & KOMUTANLAR</span>
        <span class="army-count">3 Ordu Grubu</span>
      </div>

      <div class="general-cards-list">
        <!-- Field Marshal 1: Von Bock -->
        <div class="general-card active" onclick="focusArmy('center')">
          <div class="general-avatar bock-avatar">
            <span class="gen-level">9</span>
          </div>
          <div class="general-info">
            <div class="gen-name">FM. Fedor von Bock</div>
            <div class="gen-group">Ordu Grubu Merkez (Minsk-Moskova)</div>
            <div class="gen-stats">
              <span class="skill-tag">Taarruz: 5</span>
              <span class="skill-tag">Savunma: 4</span>
              <span class="skill-tag">Lojistik: 3</span>
            </div>
            <div class="gen-traits">
              <span class="trait-pill">Yıldırım Ustası</span>
              <span class="trait-pill">Panzer Lideri</span>
            </div>
            <div class="gen-assigned-divs">51 Tümen [Pz. 2 & 3]</div>
          </div>
        </div>

        <!-- Field Marshal 2: Von Leeb -->
        <div class="general-card" onclick="focusArmy('north')">
          <div class="general-avatar leeb-avatar">
            <span class="gen-level">7</span>
          </div>
          <div class="general-info">
            <div class="gen-name">FM. Wilhelm von Leeb</div>
            <div class="gen-group">Ordu Grubu Kuzey (Baltık & Leningrad)</div>
            <div class="gen-stats">
              <span class="skill-tag">Taarruz: 3</span>
              <span class="skill-tag">Savunma: 5</span>
              <span class="skill-tag">Piyade: 4</span>
            </div>
            <div class="gen-traits">
              <span class="trait-pill">Kuşatma Uzmanı</span>
            </div>
            <div class="gen-assigned-divs">29 Tümen [Pz. 4]</div>
          </div>
        </div>

        <!-- Field Marshal 3: Von Rundstedt -->
        <div class="general-card" onclick="focusArmy('south')">
          <div class="general-avatar rundstedt-avatar">
            <span class="gen-level">8</span>
          </div>
          <div class="general-info">
            <div class="gen-name">FM. Gerd von Rundstedt</div>
            <div class="gen-group">Ordu Grubu Güney (Ukrayna & Kafkasya)</div>
            <div class="gen-stats">
              <span class="skill-tag">Taarruz: 4</span>
              <span class="skill-tag">Savunma: 4</span>
              <span class="skill-tag">Karizmatik: 5</span>
            </div>
            <div class="gen-traits">
              <span class="trait-pill">İkmal Virtüözü</span>
              <span class="trait-pill">Geniş Cephe</span>
            </div>
            <div class="gen-assigned-divs">42 Tümen [Pz. 1]</div>
          </div>
        </div>
      </div>

      <!-- Battle Plan Execution Buttons (HOI4 Battleplan Bar) -->
      <div class="battleplan-order-bar">
        <button class="plan-btn activate-plan" id="btn-exec-plan" onclick="togglePlanExecution()">
          <span class="play-icon">▶</span>
          <span>PLANLARI UYGULA</span>
        </button>
        <button class="plan-btn edit-plan" onclick="resetStep()">
          <span>↺ ADIMI SIFIRLA</span>
        </button>
      </div>
    </aside>

    <!-- Bottom Strategy Briefing HUD / Step-by-Step Storyteller -->
    <section id="strategy-briefing-drawer">
      <div class="drawer-header">
        <div class="briefing-tag">
          <span class="pulse-indicator"></span>
          <span>STRATEJİ BRİFİNGİ & ASKERİ DEĞERLENDİRME</span>
        </div>
        <div class="step-navigator">
          <button class="nav-btn" onclick="prevStep()">‹ Önceki Safha</button>
          <span class="step-counter" id="step-counter">Safha 1 / 4</span>
          <button class="nav-btn primary" onclick="nextStep()">Sonraki Safha ›</button>
        </div>
      </div>

      <div class="drawer-body">
        <div class="briefing-col-left">
          <h2 class="briefing-title" id="brief-title">Aşama 1: Sınır Yarmaları ve Minsk Kuşatması</h2>
          <p class="briefing-summary" id="brief-summary">
            Barbarossa Harekâtı, tarihin en geniş çaplı sürpriz taarruzuyla başladı. 2. ve 3. Panzer Grupları (Guderian & Hoth), Sovyet Batı Cephesi kuvvetlerini Minsk doğusunda kıskaca aldı.
          </p>
          <div class="doctrine-highlights">
            <div class="doctrine-card">
              <div class="doc-icon">⚡</div>
              <div class="doc-content">
                <strong>Schwerpunkt (Ağırlık Noktası)</strong>
                <span>Tüm zırhlı ve hava gücünün savunmanın en zayıf merkezine yoğunlaştırılması.</span>
              </div>
            </div>
            <div class="doctrine-card">
              <div class="doc-icon">⭕</div>
              <div class="doc-content">
                <strong>Kesselschlacht (Kuşatma Muharebesi)</strong>
                <span>Hızlı tank birliklerinin düşman arkasına sarkıp cepler oluşturması, piyadelerin cebi temizlemesi.</span>
              </div>
            </div>
          </div>
        </div>

        <div class="briefing-col-right">
          <div class="tactical-metrics">
            <div class="metric-row">
              <span class="metric-name">Harekât Derinliği</span>
              <span class="metric-value text-gold" id="metric-depth">350 - 450 km</span>
            </div>
            <div class="metric-row">
              <span class="metric-name">Kuşatılan Düşman Tümeni</span>
              <span class="metric-value text-red" id="metric-pocket">~28 Tümen</span>
            </div>
            <div class="metric-row">
              <span class="metric-name">Lojistik / İkmal Verimliliği</span>
              <span class="metric-value text-green" id="metric-supply">%82 (Kritik Eşik: %50)</span>
            </div>
            <div class="metric-row">
              <span class="metric-name">Hava Alanı Kontrolü (Luftwaffe)</span>
              <span class="metric-value text-blue" id="metric-air">%78 Üstünlük</span>
            </div>
          </div>
          
          <div class="hoi4-advisor-tip">
            <div class="advisor-icon">ℹ️</div>
            <div class="advisor-text" id="advisor-tip">
              <strong>HOI4 Oynanış Taktik Notu:</strong> Hızlı 'Spearhead' taarruz emirleri verirken arkadaki piyade ordularının cep kanatlarını tuttuğundan emin olun; aksi halde panzerleriniz ikmalsiz kalıp yıpranma (attrition) yer.
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Inspection Modal / Tooltip for Division or Combat Details -->
    <div id="inspector-modal" class="inspector-modal hidden">
      <div class="modal-card">
        <div class="modal-header">
          <span class="modal-title" id="inspect-title">2. Panzer Tümeni (Guderian Grubu)</span>
          <button class="modal-close" onclick="closeInspector()">✕</button>
        </div>
        <div class="modal-content" id="inspect-content">
          <!-- Populated by JavaScript -->
        </div>
      </div>
    </div>
  </main>

  <script src="app.js"></script>
</body>
</html>
`;

fs.writeFileSync('index.html', htmlContent, 'utf8');
console.log('Successfully wrote index.html with real geographic Europe SVG map!');
