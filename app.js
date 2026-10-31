/* =================================================================
   HEARTS OF IRON IV (HOI4) - REAL GEOGRAPHY STRATEGY ENGINE
   ================================================================= */

// Web Audio API for tactical military sound effects
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let audioEnabled = true;

function playMilitaryBeep(freq = 520, type = 'sine', duration = 0.08) {
  if (!audioEnabled || audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Audio context may require first user gesture
  }
}

// Scenarios Database calibrated to exact European Geography
const SCENARIOS = {
  barbarossa: {
    id: "barbarossa",
    name: "Operasyon Barbarossa (1941 - Doğu Cephesi)",
    theatre: "DOĞU CEPHESİ (OSTFRONT)",
    theatreSub: "152 Tümen • 3.4M Personel • Hava Üstünlüğü: %78",
    flagClass: "de-flag",
    generals: [
      { name: "FM. Fedor von Bock", role: "Ordu Grubu Merkez", divs: "51 Tümen", level: 9 },
      { name: "FM. Wilhelm von Leeb", role: "Ordu Grubu Kuzey", divs: "29 Tümen", level: 7 },
      { name: "FM. Gerd von Rundstedt", role: "Ordu Grubu Güney", divs: "42 Tümen", level: 8 }
    ],
    phases: [
      {
        step: 1,
        date: "22 Haziran 1941, 04:00",
        title: "Aşama 1: Sınır Yarmaları ve Minsk Kuşatması (Bialystok-Minsk Cebi)",
        summary: "Barbarossa Harekâtı, tarihin en geniş çaplı sürpriz taarruzuyla başladı. 2. ve 3. Panzer Grupları (Guderian & Hoth), Sovyet Batı Cephesi kuvvetlerini Minsk doğusunda kıskaca aldı. Luftwaffe havaalanlarını vurarak ilk 48 saatte 2.000'den fazla Sovyet uçağını yerde imha etti.",
        doc1Title: "Schwerpunkt (Ağırlık Merkezi)",
        doc1Desc: "Tüm zırhlı ve hava gücünün savunmanın en zayıf sınır eksenine odaklanması.",
        doc2Title: "Kesselschlacht (Kuşatma Çemberi)",
        doc2Desc: "Panzerlerin arkaya sarkıp çift kıskaçla Minsk cebini kapatması.",
        depth: "300 - 380 km (Minsk ele geçirildi)",
        pocket: "Minsk Cebi: ~28 Tümen (290.000 esir)",
        supply: "%88 (Mükemmel Lojistik)",
        air: "%82 Luftwaffe Tam Üstünlük",
        tip: "HOI4 İpucu: İlk günlerde zırhlı tümenlerinizi düşman piyadeleriyle savaştırıp oyalamayın. 'Spearhead' ile arkaya sızıp Minsk demiryolu kavşağını kesin.",
        frontline: "M 905,370 L 920,440 L 935,490 L 950,570 L 980,680",
        arrows: [
          { id: "arrow-north", d: "M 915,380 C 950,340 980,300 1005,260", class: "arrow-axis" },
          { id: "arrow-center-1", d: "M 925,430 C 960,420 990,420 1020,440", class: "arrow-axis" },
          { id: "arrow-center-2", d: "M 930,490 C 965,480 990,470 1020,445", class: "arrow-axis" },
          { id: "arrow-south", d: "M 940,570 C 980,560 1010,550 1050,545", class: "arrow-axis" }
        ],
        pockets: [
          { cx: 991, cy: 441, rx: 32, ry: 24, display: "inline" }
        ],
        battles: [
          { x: 945, y: 440, score: 87, type: "green" },
          { x: 965, y: 560, score: 92, type: "green" }
        ],
        counters: {
          north: { x: 915, y: 375 },
          centerPz3: { x: 925, y: 420 },
          centerPz2: { x: 930, y: 480 },
          centerInf: { x: 895, y: 510 },
          southPz1: { x: 940, y: 565 },
          southInf: { x: 920, y: 615 },
          sovNorth: { x: 970, y: 360 },
          sovCenter: { x: 980, y: 435, encircled: true, org: "broken" },
          sovSouth: { x: 1025, y: 550 },
          sovMoscow: { x: 1140, y: 350 }
        }
      },
      {
        step: 2,
        date: "25 Ağustos 1941, 10:00",
        title: "Aşama 2: Smolensk & Tarihin En Büyük Kuşatması: Kiev Cebi",
        summary: "Hitler'in emriyle Guderian'ın zırhlıları Moskova yönünden güneye çark ederek von Rundstedt'in 1. Panzer Grubu ile birleşti. Bu devasa manevra, Dinyeper Nehri gerisindeki 600.000'den fazla Sovyet askerini Kiev Cebi'nde kilitledi.",
        doc1Title: "Kafkasya & Ukrayna Tahıl Hedefi",
        doc1Desc: "Moskova yerine Sovyet gıda ve hammadde merkezlerinin ele geçirilmesi tercihi.",
        doc2Title: "Operasyonel Yıpranma",
        doc2Desc: "Tank motorlarının toz ve aşırı mesafeden yıpranması; ikmal tren hattı genişlik uyuşmazlığı.",
        depth: "650 - 800 km (Dinyeper Aşıldı)",
        pocket: "Kiev Cebi: ~43 Tümen (665.000 esir)",
        supply: "%64 (Lojistik darboğaz başladı)",
        air: "%70 Üstünlük",
        tip: "HOI4 İpucu: Rusya içlerine ilerlerken demiryollarını (Railways) 'Level 3+' seviyesine çıkarmak ve Supply Hub'ları motorize ikmale bağlamak şarttır.",
        frontline: "M 985,270 L 1020,360 L 1060,410 L 1070,530 L 1090,660",
        arrows: [
          { id: "arrow-north", d: "M 995,275 Q 1005,260 1008,252", class: "arrow-axis" },
          { id: "arrow-center-1", d: "M 1055,420 C 1075,460 1085,500 1075,535", class: "arrow-axis" },
          { id: "arrow-south", d: "M 1040,610 C 1065,590 1080,570 1075,540", class: "arrow-axis" }
        ],
        pockets: [
          { cx: 1062, cy: 537, rx: 42, ry: 30, display: "inline" }
        ],
        battles: [
          { x: 1065, y: 535, score: 94, type: "green" },
          { x: 1050, y: 410, score: 75, type: "green" }
        ],
        counters: {
          north: { x: 995, y: 265 },
          centerPz3: { x: 1040, y: 395 },
          centerPz2: { x: 1070, y: 480 },
          centerInf: { x: 1010, y: 430 },
          southPz1: { x: 1065, y: 580 },
          southInf: { x: 1040, y: 640 },
          sovNorth: { x: 1015, y: 260 },
          sovCenter: { x: 1055, y: 530, encircled: true, org: "broken" },
          sovSouth: { x: 1120, y: 620 },
          sovMoscow: { x: 1140, y: 350 }
        }
      },
      {
        step: 3,
        date: "15 Ekim 1941, 06:00",
        title: "Aşama 3: Tayfun Harekâtı ve Moskova Önlerinde Kriz",
        summary: "Merkez Ordu Grubu nihayet 'Tayfun Harekâtı' ile Moskova'ya hücum etti. Viazma ve Bryansk ceplerinde 650.000 esir daha alındı. Ancak Ekim ortasında 'Rasputitsa' (sonbahar çamur mevsimi) başladı. Yollar balçığa dönüştü, panzerlerin yakıtı tükendi ve ardından -35°C dondurucu kış bastırdı.",
        doc1Title: "Rasputitsa Çamuru & Tedarik Çöküşü",
        doc1Desc: "Kamyonların ve topların çamura batması, günde sadece 5-10 km ilerleme.",
        doc2Title: "Moskova Savunma Hattı",
        doc2Desc: "Halkın kazdığı yüzlerce kilometre tanksavar hendekleri ve derinlemesine savunma.",
        depth: "950 - 1050 km (Moskova'ya 30 km kaldı)",
        pocket: "Viazma-Bryansk: 30 Tümen tasfiye",
        supply: "%38 (Kritik Lojistik Krizi / Kış Giysisi Yok)",
        air: "%45 (Hava şartları uçuşu engelliyor)",
        tip: "HOI4 İpucu: Kış aylarında 'Cold Weather Gear' araştırılmamışsa hücumu durdurup savunmaya geçin; aksi takdirde ekipman stoğunuz sıfırlanır.",
        frontline: "M 990,260 L 1045,340 L 1130,350 L 1110,480 L 1100,640",
        arrows: [
          { id: "arrow-center-1", d: "M 1080,360 L 1135,355", class: "arrow-axis dashed-future" }
        ],
        pockets: [],
        battles: [
          { x: 1125, y: 355, score: 34, type: "red" }
        ],
        counters: {
          north: { x: 995, y: 260 },
          centerPz3: { x: 1090, y: 345 },
          centerPz2: { x: 1110, y: 355 },
          centerInf: { x: 1070, y: 390 },
          southPz1: { x: 1100, y: 520 },
          southInf: { x: 1090, y: 630 },
          sovNorth: { x: 1010, y: 255 },
          sovCenter: { x: 1145, y: 350, encircled: false, org: "full" },
          sovSouth: { x: 1160, y: 520 },
          sovMoscow: { x: 1150, y: 330 }
        }
      },
      {
        step: 4,
        date: "5 Aralık 1941, 05:00",
        title: "Aşama 4: Jukov'un Kış Karşı Taarruzu ve Kış Savunması",
        summary: "Japonya'nın saldırmayacağını öğrenen Sovyet İstihbaratı sayesinde, Sibirya'dan taze ve kış eğitimli 34 tümen Moskova önüne kaydırıldı. General Georgi Jukov komutasındaki Kızıl Ordu, donmuş ve yıpranmış Alman hatlarına karşı büyük bir taarruz başlatarak Almanları 150-250 km geriye püskürttü.",
        doc1Title: "Sibirya İhtiyat Gücü & T-34 Üstünlüğü",
        doc1Desc: "Geniş paletli T-34 tankları karda batmadan Alman Panzer III/IV'lerine üstünlük sağladı.",
        doc2Title: "Hitler'in 'Haltbefehl' (Geri Çekilme Yasağı)",
        doc2Desc: "Alman hatlarının panik halinde dağılmasını önleyen ama ağır kayıplara yol açan emir.",
        depth: "Geri püskürtme: 150-250 km",
        pocket: "Sovyet Karşı Taarruzu başarılı",
        supply: "%42 (Mihver) vs %85 (Kızıl Ordu)",
        air: "%50 Dengeli",
        tip: "HOI4 İpucu: Düşman taarruza geçtiğinde 'Entrenchment' (tahkimat) bonusu kazanmak için tümenlerinizi nehir veya orman hatlarına çekip kazın.",
        frontline: "M 990,260 L 1030,340 L 1080,365 L 1070,490 L 1080,640",
        arrows: [
          { id: "arrow-counter", d: "M 1150,350 Q 1110,360 1075,365", class: "arrow-soviet" }
        ],
        pockets: [],
        battles: [
          { x: 1090, y: 365, score: 28, type: "red" }
        ],
        counters: {
          north: { x: 990, y: 265 },
          centerPz3: { x: 1060, y: 350 },
          centerPz2: { x: 1070, y: 380 },
          centerInf: { x: 1050, y: 420 },
          southPz1: { x: 1070, y: 520 },
          southInf: { x: 1075, y: 620 },
          sovNorth: { x: 1010, y: 255 },
          sovCenter: { x: 1110, y: 350, encircled: false, org: "full" },
          sovSouth: { x: 1140, y: 500 },
          sovMoscow: { x: 1150, y: 340 }
        }
      }
    ]
  },

  fall_gelb: {
    id: "fall_gelb",
    name: "Fall Gelb & Fransa Seferi (1940 - Batı Cephesi)",
    theatre: "BATI CEPHESİ (WESTFRONT)",
    theatreSub: "135 Tümen • Manstein 'Sichelschnitt' Planı",
    flagClass: "de-flag",
    phases: [
      {
        step: 1,
        date: "10 Mayıs 1940, 05:35",
        title: "Aşama 1: Dyle Planı Tuzağı ve Ardenler Yarması",
        summary: "Müttefikler (İngiltere & Fransa), Almanların I. Dünya Savaşı'ndaki Schlieffen Planı gibi Belçika üzerinden geleceğini düşünerek en elit birliklerini Belçika'ya (Dyle Nehri) sürdü. Oysa von Manstein'ın 'Sichelschnitt' (Orak Darbesi) planı uyarınca Alman zırhlı kütlesi geçilmez sanılan Ardenler Dağları'ndan Sedan'a aktı.",
        doc1Title: "Manstein Planı (Sichelschnitt)",
        doc1Desc: "Tüm zırhlı mızrak ucunu ormanlık Ardenler ve Meuse Nehri geçişine odaklama.",
        doc2Title: "Maginot Hattı'nı Baypas Etme",
        doc2Desc: "Milyarlarca franga mal olan devasa Fransız istihkamlarına hiç dokunulmadı.",
        depth: "Sedan Köprübaşı: 90 km",
        pocket: "Fransız 9. Ordusu dağıldı",
        supply: "%92",
        air: "%85 Luftwaffe Stuka Üstünlüğü",
        tip: "HOI4 İpucu: Fransa Seferi'nde Maginot Hattı'na asla saldırmayın (Level 10 Fort penalty -%90 attack verir). Lüksemburg ve Belçika ovalarından kanatlayın.",
        frontline: "M 545,505 L 565,545 L 595,575 L 615,620",
        arrows: [
          { id: "arrow-center-1", d: "M 585,545 C 570,555 560,560 540,560", class: "arrow-axis" }
        ],
        pockets: [],
        battles: [
          { x: 564, y: 558, score: 89, type: "green" }
        ],
        counters: {
          north: { x: 550, y: 510 },
          centerPz3: { x: 565, y: 540 },
          centerPz2: { x: 575, y: 560 },
          centerInf: { x: 595, y: 580 },
          southPz1: { x: 610, y: 610 },
          southInf: { x: 630, y: 640 },
          sovNorth: { x: 515, y: 505 },
          sovCenter: { x: 520, y: 565, encircled: false, org: "low" },
          sovSouth: { x: 550, y: 600 },
          sovMoscow: { x: 508, y: 573 }
        }
      },
      {
        step: 2,
        date: "24 Mayıs 1940, 14:00",
        title: "Aşama 2: Manş Denizi'ne Yarış ve Dunkerque Kuşatması",
        summary: "Sedan'ı geçen Guderian ve Rommel panzerleri hiç durmadan Manş Denizi kıyılarına ulaştı. Belçika'ya girmiş olan İngiliz Sefer Kuvvetleri (BEF) ve Fransız 1. Ordusu arkadan sarılarak Dunkerque limanında kapana kısıldı.",
        doc1Title: "Hızlı Zırhlı Hücum",
        doc1Desc: "Piyadelerin yetişmesini beklemeden kıyıya ulaşarak Müttefik ordularını ikiye bölmek.",
        doc2Title: "Dunkerque Tahliyesi (Dynamo)",
        doc2Desc: "338.000 askerin sivil balıkçı tekneleri ve donanmayla İngiltere'ye kaçırılması.",
        depth: "Manş Kıyısı (Denize Ulaşıldı)",
        pocket: "Dunkerque Cebi: 40 Müttefik Tümeni",
        supply: "%85",
        air: "%75",
        tip: "HOI4 İpucu: Kıyıya ulaştığınızda limanları hızla ele geçirin, yoksa düşman birlikleri denizden (convoys) anavatanlarına kaçar.",
        frontline: "M 515,510 L 530,540 L 550,570",
        arrows: [
          { id: "arrow-center-1", d: "M 555,550 C 535,535 525,520 518,512", class: "arrow-axis" }
        ],
        pockets: [
          { cx: 518, cy: 512, rx: 22, ry: 18, display: "inline" }
        ],
        battles: [
          { x: 520, y: 515, score: 79, type: "green" }
        ],
        counters: {
          north: { x: 525, y: 495 },
          centerPz3: { x: 525, y: 530 },
          centerPz2: { x: 540, y: 550 },
          centerInf: { x: 560, y: 570 },
          southPz1: { x: 575, y: 590 },
          southInf: { x: 600, y: 620 },
          sovNorth: { x: 479, y: 482 },
          sovCenter: { x: 515, y: 510, encircled: true, org: "broken" },
          sovSouth: { x: 510, y: 570 },
          sovMoscow: { x: 508, y: 573 }
        }
      }
    ]
  },

  overlord: {
    id: "overlord",
    name: "Overlord Harekâtı / D-Day (1944 - Normandiya)",
    theatre: "BATI AVRUPA SEFERİ",
    theatreSub: "Müttefik Çıkarması • 156.000 İlk Gün Askeri",
    flagClass: "allies-flag",
    phases: [
      {
        step: 1,
        date: "6 Haziran 1944, 06:30",
        title: "Aşama 1: Normandiya Sahilleri ve Hava İndirme",
        summary: "Tarihin en büyük amfibi harekâtında İngiliz, Amerikan ve Kanada birlikleri 5 sahile çıkarma yaptı. Pas-de-Calais aldatmacası sayesinde Alman zırhlı ihtiyatları geç sevk edildi.",
        doc1Title: "Amfibi Çıkarma & Hava İndirme",
        doc1Desc: "101. ve 82. Hava İndirme tümenlerinin sahil arkasındaki köprüleri tutması.",
        doc2Title: "Tam Hava Hakimiyeti",
        doc2Desc: "Müttefik avcı bombardıman uçaklarının gündüz Alman hareketini felç etmesi.",
        depth: "Sahil Köprübaşı: 15-25 km",
        pocket: "Atlantik Duvarı aşıldı",
        supply: "%95 (Mulberry yapay limanları)",
        air: "%98 Müttefik Hava Eziciliği",
        tip: "HOI4 İpucu: 'Naval Invasion' hazırlarken en az %70 deniz üstünlüğü ve sahil bombardımanı için savaş gemisi desteği şarttır.",
        frontline: "M 465,545 L 485,550 L 510,555",
        arrows: [
          { id: "arrow-allies", d: "M 475,490 L 480,545", class: "arrow-allies" }
        ],
        pockets: [],
        battles: [
          { x: 480, y: 545, score: 76, type: "green" }
        ],
        counters: {
          north: { x: 490, y: 555 },
          centerPz3: { x: 510, y: 560 },
          centerPz2: { x: 530, y: 570 },
          centerInf: { x: 550, y: 580 },
          southPz1: { x: 565, y: 600 },
          southInf: { x: 580, y: 620 },
          sovNorth: { x: 479, y: 482 },
          sovCenter: { x: 475, y: 545, encircled: false, org: "full" },
          sovSouth: { x: 508, y: 573 },
          sovMoscow: { x: 508, y: 573 }
        }
      },
      {
        step: 2,
        date: "12 Ağustos 1944, 11:00",
        title: "Aşama 2: Cobra Harekâtı & Falaise Kuşatması",
        summary: "General Patton'un 3. Ordusu dar bir hat üzerinden Normandiya'dan fırlayarak güneyden sarktı. İngiliz ve Kanadalılar kuzeyden bastırırken Alman 7. Ordusu ve 5. Panzer Ordusu Falaise Cebi'nde kuşatıldı ve Fransa özgürleştirildi.",
        doc1Title: "Operasyon Cobra (Yarma)",
        doc1Desc: "Binlerce ağır bombardıman uçağının Alman savunma hattına halı bombardımanı yapması.",
        doc2Title: "Falaise Cebi İmhası",
        doc2Desc: "Yaklaşık 50.000 Alman askerinin esir düşmesi ve yüzlerce panzerin terk edilmesi.",
        depth: "Paris & Seine Nehri Ötesi",
        pocket: "Falaise Cebi: ~15 Tümen",
        supply: "%90",
        air: "%95",
        tip: "HOI4 İpucu: Düşman hatlarında bir gedik açıldığında motorize tümenlerle derinliğe saldırarak düşman piyadelerini kuşatın.",
        frontline: "M 480,545 L 515,565 L 535,580",
        arrows: [
          { id: "arrow-allies", d: "M 480,550 C 495,585 520,590 540,575", class: "arrow-allies" }
        ],
        pockets: [
          { cx: 505, cy: 565, rx: 25, ry: 18, display: "inline" }
        ],
        battles: [
          { x: 505, y: 565, score: 88, type: "green" }
        ],
        counters: {
          north: { x: 515, y: 550 },
          centerPz3: { x: 535, y: 565 },
          centerPz2: { x: 550, y: 580 },
          centerInf: { x: 570, y: 590 },
          southPz1: { x: 585, y: 610 },
          southInf: { x: 605, y: 630 },
          sovNorth: { x: 479, y: 482 },
          sovCenter: { x: 505, y: 565, encircled: true, org: "broken" },
          sovSouth: { x: 508, y: 573 },
          sovMoscow: { x: 508, y: 573 }
        }
      }
    ]
  }
};

// Current State
let currentScenario = "barbarossa";
let currentStepIdx = 0;
let isPlaying = false;
let playTimer = null;
let gameSpeed = 3;

// DOM Elements
const elDate = document.getElementById("game-date");
const elStepCounter = document.getElementById("step-counter");
const elBriefTitle = document.getElementById("brief-title");
const elBriefSummary = document.getElementById("brief-summary");
const elMetricDepth = document.getElementById("metric-depth");
const elMetricPocket = document.getElementById("metric-pocket");
const elMetricSupply = document.getElementById("metric-supply");
const elMetricAir = document.getElementById("metric-air");
const elAdvisorTip = document.getElementById("advisor-tip");
const elBtnPause = document.getElementById("btn-pause");
const elBtnExecPlan = document.getElementById("btn-exec-plan");
const elModal = document.getElementById("inspector-modal");
const elModalTitle = document.getElementById("inspect-title");
const elModalContent = document.getElementById("inspect-content");

// Initialize
window.addEventListener("DOMContentLoaded", () => {
  renderScenarioPhase();
  setupKeyboardHotkeys();
  setupMapPanZoom();
  setupClickBriefings();
});

// Switch Scenario
function changeScenario(scenKey) {
  playMilitaryBeep(640, 'square', 0.1);
  currentScenario = scenKey;
  currentStepIdx = 0;
  pauseGame();

  const scen = SCENARIOS[scenKey];
  const titleEl = document.getElementById("theatre-title-txt");
  const subEl = document.getElementById("theatre-sub-txt");
  if (titleEl) titleEl.innerText = scen.theatre;
  if (subEl) subEl.innerText = scen.theatreSub;

  renderScenarioPhase();
}

// Render Current Scenario & Step
function renderScenarioPhase() {
  const scen = SCENARIOS[currentScenario];
  const phase = scen.phases[currentStepIdx];

  // Top info
  elDate.innerText = phase.date;
  elStepCounter.innerText = `Safha ${phase.step} / ${scen.phases.length}`;

  // Briefing panel
  elBriefTitle.innerText = phase.title;
  elBriefSummary.innerText = phase.summary;
  elMetricDepth.innerText = phase.depth;
  elMetricPocket.innerText = phase.pocket;
  elMetricSupply.innerText = phase.supply;
  elMetricAir.innerText = phase.air;
  elAdvisorTip.innerHTML = `<strong>HOI4 Oynanış Taktik Notu:</strong> ${phase.tip}`;

  // Update SVG Frontline
  const svgFrontline = document.getElementById("frontline-main");
  if (svgFrontline && phase.frontline) {
    svgFrontline.setAttribute("d", phase.frontline);
  }

  // Update Dynamic Battleplan Arrows
  const arrowsGroup = document.getElementById("offensive-arrows");
  if (arrowsGroup) {
    arrowsGroup.innerHTML = "";
    phase.arrows.forEach(arr => {
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("id", arr.id);
      path.setAttribute("d", arr.d);
      path.setAttribute("class", `battle-arrow ${arr.class}`);
      if (arr.class.includes("arrow-axis")) {
        path.setAttribute("marker-end", "url(#arrow-axis)");
      } else if (arr.class.includes("arrow-soviet")) {
        path.setAttribute("marker-end", "url(#arrow-soviet)");
      } else {
        path.setAttribute("marker-end", "url(#arrow-allies)");
      }
      arrowsGroup.appendChild(path);
    });
  }

  // Update Pockets
  const pocketsGroup = document.getElementById("kessel-pockets");
  if (pocketsGroup && phase.pockets) {
    pocketsGroup.innerHTML = "";
    phase.pockets.forEach(pkt => {
      if (pkt.display !== "none") {
        const ellipse = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
        ellipse.setAttribute("class", "pocket-circle");
        ellipse.setAttribute("cx", pkt.cx);
        ellipse.setAttribute("cy", pkt.cy);
        ellipse.setAttribute("rx", pkt.rx);
        ellipse.setAttribute("ry", pkt.ry);
        pocketsGroup.appendChild(ellipse);
      }
    });
  }

  // Update Combat Bubbles
  const combatGroup = document.getElementById("combat-bubbles");
  if (combatGroup && phase.battles) {
    combatGroup.innerHTML = "";
    phase.battles.forEach((b, idx) => {
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("class", `battle-bubble ${b.type}`);
      g.setAttribute("transform", `translate(${b.x}, ${b.y})`);
      g.setAttribute("onclick", `inspectBattle('b_${idx}')`);

      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("r", "15");
      circle.setAttribute("class", "bubble-circle");

      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("y", "4");
      text.setAttribute("class", "bubble-score");
      text.textContent = b.score;

      g.appendChild(circle);
      g.appendChild(text);
      combatGroup.appendChild(g);
    });
  }

  // Update Unit Counter Positions on the map
  if (phase.counters) {
    const c = phase.counters;
    setCounterPos("cnt-north", c.north);
    setCounterPos("cnt-pz4", c.centerPz3);
    setCounterPos("cnt-guderian", c.centerPz2);
    setCounterPos("cnt-4th-army", c.centerInf);
    setCounterPos("cnt-pz1", c.southPz1);
    setCounterPos("cnt-6th-army", c.southInf);
    setCounterPos("cnt-sov-north", c.sovNorth);
    setCounterPos("cnt-sov-minsk", c.sovCenter);
    setCounterPos("cnt-sov-moscow", c.sovMoscow);
    setCounterPos("cnt-sov-kiev", c.sovSouth);
  }
}

function setCounterPos(id, pos) {
  const el = document.getElementById(id);
  if (el && pos) {
    el.setAttribute("transform", `translate(${pos.x}, ${pos.y})`);
  }
}

// Navigation Steps
function nextStep() {
  const scen = SCENARIOS[currentScenario];
  if (currentStepIdx < scen.phases.length - 1) {
    currentStepIdx++;
    playMilitaryBeep(700, 'sine', 0.08);
    renderScenarioPhase();
  } else {
    playMilitaryBeep(350, 'triangle', 0.15);
  }
}

function prevStep() {
  if (currentStepIdx > 0) {
    currentStepIdx--;
    playMilitaryBeep(520, 'sine', 0.08);
    renderScenarioPhase();
  }
}

function resetStep() {
  currentStepIdx = 0;
  playMilitaryBeep(440, 'sine', 0.1);
  renderScenarioPhase();
}

// Play / Pause Simulation
function togglePlanExecution() {
  if (isPlaying) {
    pauseGame();
  } else {
    playGame();
  }
}

function playGame() {
  isPlaying = true;
  elBtnExecPlan.classList.add("running");
  elBtnExecPlan.innerHTML = '<span class="play-icon">⏸</span><span>HAREKÂTI DURDUR</span>';
  elBtnPause.textContent = "▶";
  playMilitaryBeep(880, 'sine', 0.12);

  const intervalMs = Math.max(1400, 4500 - (gameSpeed * 650));
  clearInterval(playTimer);
  playTimer = setInterval(() => {
    const scen = SCENARIOS[currentScenario];
    if (currentStepIdx < scen.phases.length - 1) {
      nextStep();
    } else {
      pauseGame();
    }
  }, intervalMs);
}

function pauseGame() {
  isPlaying = false;
  clearInterval(playTimer);
  elBtnExecPlan.classList.remove("running");
  elBtnExecPlan.innerHTML = '<span class="play-icon">▶</span><span>PLANLARI UYGULA</span>';
  elBtnPause.textContent = "⏸";
}

// Speed Control
function setSpeed(speed) {
  gameSpeed = speed;
  const ticks = document.querySelectorAll(".speed-tick");
  ticks.forEach((tick, idx) => {
    if (idx < speed) {
      tick.classList.add("active");
    } else {
      tick.classList.remove("active");
    }
  });
  playMilitaryBeep(600 + (speed * 80), 'sine', 0.05);

  if (isPlaying) {
    playGame();
  }
}

// Hotkeys
function setupKeyboardHotkeys() {
  window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      e.preventDefault();
      togglePlanExecution();
    } else if (e.code === "ArrowRight") {
      nextStep();
    } else if (e.code === "ArrowLeft") {
      prevStep();
    } else if (e.code === "Digit1") setSpeed(1);
    else if (e.code === "Digit2") setSpeed(2);
    else if (e.code === "Digit3") setSpeed(3);
    else if (e.code === "Digit4") setSpeed(4);
    else if (e.code === "Digit5") setSpeed(5);
  });
}

// Unit Database with authentic HOI4 division stats
const UNIT_DB = {
  "guderian-pz": {
    name: "2. Panzer Grubu (General Heinz Guderian)",
    type: "Zırhlı Kolordu (Panzer-Division)",
    composition: "4x Panzer III/IV, 4x Motorize Piyade, 2x Kundağı Motorlu Topçu",
    softAttack: 245,
    hardAttack: 180,
    breakthrough: 310,
    defense: 165,
    speed: "10.5 km/sa",
    org: "42 / 45",
    supplyUse: "1.8 / gün",
    fuelDays: "12 Günlük Rezerv",
    doctrine: "Mobile Warfare / Blitzkrieg (Yıldırım Harbi)"
  },
  "3rd-panzer-group": {
    name: "3. Panzer Grubu (General Hermann Hoth)",
    type: "Zırhlı Kolordu",
    composition: "3x Panzer 38(t), 3x Panzer IV, 4x Motorize Piyade",
    softAttack: 215,
    hardAttack: 160,
    breakthrough: 285,
    defense: 150,
    speed: "11.0 km/sa",
    org: "40 / 45",
    supplyUse: "1.7 / gün",
    fuelDays: "14 Günlük Rezerv",
    doctrine: "Schwerpunkt Yarmaları & Hızlı Çevreleme"
  },
  "1st-panzer-group": {
    name: "1. Panzer Grubu (General Ewald von Kleist)",
    type: "Zırhlı Kolordu (Güney Ordular Grubu)",
    composition: "5x Panzer III/IV, 3x Motorize Alay, 2x Topçu Taburu",
    softAttack: 230,
    hardAttack: 170,
    breakthrough: 295,
    defense: 160,
    speed: "10.0 km/sa",
    org: "44 / 45",
    supplyUse: "1.9 / gün",
    fuelDays: "10 Günlük Rezerv",
    doctrine: "Dinyeper ve Don Nehir Yarmaları"
  },
  "4th-panzer": {
    name: "4. Panzer Grubu (General Erich Hoepner)",
    type: "Zırhlı Kolordu (Kuzey Ordular Grubu)",
    composition: "4x Panzer 35(t)/Panzer IV, 3x Motorize Alay",
    softAttack: 210,
    hardAttack: 155,
    breakthrough: 280,
    defense: 155,
    speed: "10.2 km/sa",
    org: "41 / 45",
    supplyUse: "1.6 / gün",
    fuelDays: "11 Günlük Rezerv",
    doctrine: "Baltık Yarması ve Leningrad Kuşatması"
  },
  "4th-army": {
    name: "4. Alman Sahra Ordusu (FM. Günther von Kluge)",
    type: "Standart Piyade Ordusu (Infanterie-Division)",
    composition: "9x Piyade Taburu, 3x Çekili Topçu, Keşif & İstihkam Bölüğü",
    softAttack: 140,
    hardAttack: 35,
    breakthrough: 75,
    defense: 340,
    speed: "4.0 km/sa (Yaya)",
    org: "62 / 65",
    supplyUse: "0.8 / gün",
    fuelDays: "Atlı Nakliye Destekli",
    doctrine: "Cephe Sabitleme ve Kuşatılan Cepleri Tasfiye"
  },
  "6th-army": {
    name: "6. Alman Sahra Ordusu (General Friedrich Paulus)",
    type: "Ağır Muharebe Ordusu",
    composition: "10x Piyade Taburu, 4x Ağır Obüs Taburu, Hücum Topları (StuG III)",
    softAttack: 165,
    hardAttack: 45,
    breakthrough: 90,
    defense: 360,
    speed: "4.0 km/sa",
    org: "60 / 65",
    supplyUse: "1.1 / gün",
    fuelDays: "Orta Seviye",
    doctrine: "Müstahkem Savunma Hatlarını Ezme ve Kentsel Muharebe"
  },
  "soviet-north": {
    name: "8. Sovyet Ordusu (Kuzeybatı Cephesi)",
    type: "Kızıl Ordu Piyade Ordusu (Baltık Savunması)",
    status: "Geri Çekiliyor (Sürekli Basınç Altında)",
    softAttack: 110,
    hardAttack: 30,
    breakthrough: 50,
    defense: 210,
    speed: "3.5 km/sa",
    org: "24 / 50 (Düşük Organizasyon)",
    supplyUse: "0.9 / gün",
    fuelDays: "Sınırlı",
    doctrine: "Geciktirme Muharebesi & Leningrad Tahkimatı"
  },
  "soviet-minsk-pocket": {
    name: "3. Sovyet Ordusu (Kuşatıldı - Minsk Cebi)",
    type: "Kızıl Ordu Piyade Kolordusu",
    status: "İKMAL KESİLDİ (OUT OF SUPPLY) - Çemberde",
    softAttack: 45,
    hardAttack: 12,
    breakthrough: 18,
    defense: 60,
    speed: "1.5 km/sa (Kaçış halinde)",
    org: "6 / 50 (Çöküşte)",
    supplyUse: "0.0 / gün (Yıpranma / Attrition: %45)",
    fuelDays: "Tükendi",
    doctrine: "Derin Harekât (Organizasyon Kaybı Nedeniyle Felç)"
  },
  "soviet-kiev-pocket": {
    name: "5. Sovyet Ordusu (Kiev Cebi Kuşatması)",
    type: "Güneybatı Cephesi Ağır Piyade Kuvveti",
    status: "TAM KUŞATMA ALTINDA (KESSEL) - Ağır Top Ateşi",
    softAttack: 55,
    hardAttack: 20,
    breakthrough: 22,
    defense: 80,
    speed: "1.0 km/sa",
    org: "8 / 52 (Tükeniyor)",
    supplyUse: "0.0 / gün (Cephane Bitti)",
    fuelDays: "Tükendi",
    doctrine: "Çemberi Yarma Girişimi (Yetersiz Zırhlı Desteği)"
  },
  "soviet-reserve": {
    name: "16. Sovyet İhtiyat Ordusu (Moskova Önleri)",
    type: "Taze İhtiyat & T-34 Tank Taburları",
    status: "Siper Kazılmış (Entrenchment: +%30)",
    softAttack: 190,
    hardAttack: 145,
    breakthrough: 110,
    defense: 380,
    speed: "6.0 km/sa",
    org: "55 / 55",
    supplyUse: "1.2 / gün",
    fuelDays: "Yeterli",
    doctrine: "Vatan Savunması (Büyük Anavatan Savaşı)"
  }
};

function inspectDivision(unitId) {
  playMilitaryBeep(800, 'sine', 0.08);
  const unit = UNIT_DB[unitId] || {
    name: "Taktik Askeri Birlik",
    type: "Müşterek Görev Kuvveti",
    softAttack: 150,
    hardAttack: 70,
    breakthrough: 120,
    defense: 200,
    speed: "6.0 km/sa",
    org: "45 / 50",
    supplyUse: "1.0",
    fuelDays: "Yeterli",
    doctrine: "Bölgesel Harp Doktrini"
  };

  elModalTitle.innerText = unit.name;
  elModalContent.innerHTML = `
    <div><strong>Birlik Tipi:</strong> ${unit.type}</div>
    ${unit.status ? `<div style="color:#ff6b6b;font-weight:bold;">${unit.status}</div>` : ''}
    ${unit.composition ? `<div style="font-size:11px;color:#92a4b8;"><strong>Kadro:</strong> ${unit.composition}</div>` : ''}
    
    <div class="unit-stat-grid">
      <div class="unit-stat-item"><span class="unit-stat-lbl">Yumuşak Saldırı:</span> <span class="unit-stat-val text-gold">${unit.softAttack}</span></div>
      <div class="unit-stat-item"><span class="unit-stat-lbl">Sert Saldırı:</span> <span class="unit-stat-val">${unit.hardAttack}</span></div>
      <div class="unit-stat-item"><span class="unit-stat-lbl">Yarma (Breakthrough):</span> <span class="unit-stat-val text-green">${unit.breakthrough}</span></div>
      <div class="unit-stat-item"><span class="unit-stat-lbl">Savunma:</span> <span class="unit-stat-val">${unit.defense}</span></div>
      <div class="unit-stat-item"><span class="unit-stat-lbl">Hız:</span> <span class="unit-stat-val">${unit.speed}</span></div>
      <div class="unit-stat-item"><span class="unit-stat-lbl">Organizasyon:</span> <span class="unit-stat-val text-green">${unit.org}</span></div>
    </div>
    
    <div style="font-size:11px;margin-top:4px;">
      <div><strong>İkmal & Yakıt:</strong> ${unit.fuelDays} (Kullanım: ${unit.supplyUse})</div>
      <div style="color:#d4af37;margin-top:2px;"><strong>Doktrin:</strong> ${unit.doctrine}</div>
    </div>
  `;

  elModal.classList.remove("hidden");
}

function inspectBattle(battleId) {
  playMilitaryBeep(450, 'sawtooth', 0.12);
  elModalTitle.innerText = "⚔️ Muharebe Taktik Durumu";
  elModalContent.innerHTML = `
    <div style="font-size:13px;font-weight:bold;color:#ffd700;">Harekât Ekseninde Çatışma Analizi</div>
    <p style="font-size:11px;color:#cbd9e8;margin-top:4px;">
      Taarruz eden zırhlı öncü birlikler, yakın hava desteği (CAS - Ju 87 Stuka) ile Sovyet mevzilerine baskı uyguluyor.
    </p>
    <div class="unit-stat-grid" style="margin-top:8px;">
      <div class="unit-stat-item"><span class="unit-stat-lbl">Hava Desteği:</span> <span class="unit-stat-val text-green">+%25 Hasar</span></div>
      <div class="unit-stat-item"><span class="unit-stat-lbl">Arazi (Ova):</span> <span class="unit-stat-val">Bonus yok</span></div>
      <div class="unit-stat-item"><span class="unit-stat-lbl">Planlama Bonusu:</span> <span class="unit-stat-val text-gold">+%40</span></div>
      <div class="unit-stat-item"><span class="unit-stat-lbl">Savunma Siperi:</span> <span class="unit-stat-val text-red">-%15</span></div>
    </div>
    <div style="font-size:11px;color:#2ecc71;font-weight:bold;margin-top:6px;">
      Tahmini Sonuç: Düşman hattı birkaç saat içinde kırılacak (Yarma Başarılı).
    </div>
  `;
  elModal.classList.remove("hidden");
}

function closeInspector() {
  elModal.classList.add("hidden");
}

// Layer Toggles
let showArrows = true;
let showCounters = true;
let showBattles = true;
let showAir = false;

function toggleMapLayer(layer) {
  playMilitaryBeep(500, 'sine', 0.05);
  if (layer === 'arrows') {
    showArrows = !showArrows;
    document.getElementById("offensive-arrows").style.display = showArrows ? "block" : "none";
    document.getElementById("btn-toggle-arrows").classList.toggle("active", showArrows);
  } else if (layer === 'counters') {
    showCounters = !showCounters;
    document.getElementById("division-counters").style.display = showCounters ? "block" : "none";
    document.getElementById("btn-toggle-counters").classList.toggle("active", showCounters);
  } else if (layer === 'battles') {
    showBattles = !showBattles;
    document.getElementById("combat-bubbles").style.display = showBattles ? "block" : "none";
    document.getElementById("btn-toggle-battles").classList.toggle("active", showBattles);
  }
}

function toggleAirZone() {
  showAir = !showAir;
  document.getElementById("btn-toggle-air").classList.toggle("active", showAir);
  const countries = document.querySelectorAll(".country.axis-occupied, .country.axis, .country.de-core");
  countries.forEach(c => {
    c.style.filter = showAir ? "hue-rotate(180deg) saturate(1.4)" : "";
  });
  playMilitaryBeep(750, 'sine', 0.08);
}

function focusArmy(group) {
  playMilitaryBeep(650, 'sine', 0.08);
  const cards = document.querySelectorAll(".general-card");
  cards.forEach(c => c.classList.remove("active"));
  if (window.event && window.event.currentTarget) {
    window.event.currentTarget.classList.add("active");
  }
}

// Click briefings for cities and countries
function setupClickBriefings() {
  const cities = document.querySelectorAll(".city-point");
  cities.forEach(city => {
    city.style.cursor = "pointer";
    city.addEventListener("click", (e) => {
      e.stopPropagation();
      const cityName = city.getAttribute("data-city") || "Stratejik Şehir";
      playMilitaryBeep(680, 'triangle', 0.1);
      elAdvisorTip.innerHTML = `<strong>Stratejik Nokta Analizi (${cityName}):</strong> Bu kentsel merkez, bölgenin ana demiryolu kavşağı ve ikmal deposu (Supply Depot) konumundadır. Ele geçirilmesi düşmanın ikmal ağını felç eder.`;
    });
  });

  const countries = document.querySelectorAll(".country");
  countries.forEach(country => {
    country.addEventListener("click", (e) => {
      const countryTitle = country.getAttribute("title") || "Bölge";
      playMilitaryBeep(480, 'sine', 0.06);
      elAdvisorTip.innerHTML = `<strong>Bölge İstihbaratı (${countryTitle}):</strong> Harekât alanı topoğrafyası ve altyapı durumu birliklerin azami hızını ve lojistik tüketimini doğrudan etkilemektedir.`;
    });
  });
}

// Map Drag and Scroll Zoom
function setupMapPanZoom() {
  const svg = document.getElementById("ww2-svg-map");
  if (!svg) return;

  let isDragging = false;
  let startX = 0, startY = 0;
  let viewBox = { x: 200, y: 150, w: 1350, h: 850 };

  svg.addEventListener("mousedown", (e) => {
    if (e.target.closest(".natocounter") || e.target.closest(".battle-bubble") || e.target.closest(".city-point")) return;
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    svg.style.cursor = "grabbing";
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const dx = (e.clientX - startX) * (viewBox.w / svg.clientWidth);
    const dy = (e.clientY - startY) * (viewBox.h / svg.clientHeight);

    viewBox.x -= dx;
    viewBox.y -= dy;

    // Constrain within map bounds
    viewBox.x = Math.max(-100, Math.min(800, viewBox.x));
    viewBox.y = Math.max(-50, Math.min(450, viewBox.y));

    svg.setAttribute("viewBox", `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
    startX = e.clientX;
    startY = e.clientY;
  });

  window.addEventListener("mouseup", () => {
    if (isDragging) {
      isDragging = false;
      svg.style.cursor = "default";
    }
  });

  // Wheel Zoom
  svg.addEventListener("wheel", (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 0.9 : 1.1;
    const newW = viewBox.w * zoomFactor;
    const newH = viewBox.h * zoomFactor;

    if (newW >= 600 && newW <= 2000) {
      viewBox.x += (viewBox.w - newW) / 2;
      viewBox.y += (viewBox.h - newH) / 2;
      viewBox.w = newW;
      viewBox.h = newH;
      svg.setAttribute("viewBox", `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
    }
  }, { passive: false });
}
