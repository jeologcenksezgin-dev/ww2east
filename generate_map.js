const fs = require('fs');

const data = JSON.parse(fs.readFileSync('europe.geojson', 'utf8'));

const rad = Math.PI / 180;
const lon0 = 18 * rad;
const lat0 = 53 * rad;
const scale = 1750;
const cx = 820;
const cy = 480;

function project(lon, lat) {
  const l = lon * rad;
  const p = lat * rad;
  const cosP = Math.cos(p);
  const sinP = Math.sin(p);
  const cosLat0 = Math.cos(lat0);
  const sinLat0 = Math.sin(lat0);
  const dLon = l - lon0;
  const cosDLon = Math.cos(dLon);
  const sinDLon = Math.sin(dLon);

  const k = Math.sqrt(2 / (1 + sinLat0 * sinP + cosLat0 * cosP * cosDLon));
  const x = k * cosP * sinDLon;
  const y = k * (cosLat0 * sinP - sinLat0 * cosP * cosDLon);
  return [Math.round(cx + x * scale), Math.round(cy - y * scale)];
}

// Check key strategic cities
const keyCities = [
  { name: 'Berlin', lon: 13.405, lat: 52.52, type: 'capital', faction: 'axis' },
  { name: 'Moskova', lon: 37.617, lat: 55.755, type: 'major', faction: 'soviet' },
  { name: 'Leningrad', lon: 30.335, lat: 59.934, type: 'major', faction: 'soviet' },
  { name: 'Stalingrad', lon: 44.516, lat: 48.708, type: 'major', faction: 'soviet' },
  { name: 'Kiev', lon: 30.523, lat: 50.45, type: 'city', faction: 'soviet' },
  { name: 'Minsk', lon: 27.561, lat: 53.904, type: 'city', faction: 'soviet' },
  { name: 'Varşova', lon: 21.012, lat: 52.229, type: 'city', faction: 'axis' },
  { name: 'Paris', lon: 2.352, lat: 48.856, type: 'capital', faction: 'allies' },
  { name: 'Londra', lon: -0.127, lat: 51.507, type: 'capital', faction: 'allies' },
  { name: 'Sedan', lon: 4.945, lat: 49.702, type: 'city', faction: 'neutral' },
  { name: 'Kursk', lon: 36.192, lat: 51.73, type: 'city', faction: 'soviet' },
  { name: 'Bakü', lon: 49.867, lat: 40.409, type: 'oil', faction: 'soviet' },
  { name: 'Roma', lon: 12.496, lat: 41.902, type: 'capital', faction: 'axis' },
  { name: 'Helsinki', lon: 24.938, lat: 60.169, type: 'city', faction: 'axis' },
  { name: 'Oslo', lon: 10.752, lat: 59.913, type: 'city', faction: 'axis' },
  { name: 'Stokholm', lon: 18.068, lat: 59.329, type: 'city', faction: 'neutral' },
  { name: 'Bükreş', lon: 26.102, lat: 44.426, type: 'city', faction: 'axis' },
  { name: 'Budapeşte', lon: 19.040, lat: 47.497, type: 'city', faction: 'axis' }
];

console.log('Projected Cities:');
const cityCoords = {};
keyCities.forEach(c => {
  const [px, py] = project(c.lon, c.lat);
  cityCoords[c.name] = [px, py];
  console.log(c.name + ': [' + px + ', ' + py + ']');
});

// Group countries into WW2 factions / entities
// Germany, Austria, Czech Republic -> Greater German Reich
// Poland -> General Government (Occupied)
// France -> France / Vichy
// Russia, Ukraine, Belarus, Republic of Moldova, Estonia, Latvia, Lithuania, Armenia, Georgia, Azerbaijan -> USSR (Soviet Union)
// United Kingdom -> Allies
// Italy -> Axis
// Hungary, Romania, Bulgaria, Slovakia -> Axis Allies
// Finland -> Co-belligerent (Axis-leaning)
// Spain, Portugal, Sweden, Switzerland, Ireland, Turkey -> Neutral
// Norway, Denmark, Belgium, Netherlands, Luxembourg, Yugoslavia (Serbia, Croatia, Bosnia, etc.), Greece, Albania -> Occupied / Contested

function getCountryClass(name) {
  if (['Germany', 'Austria', 'Czech Republic'].includes(name)) return 'axis de-core';
  if (['Poland'].includes(name)) return 'axis-occupied pl-occupied';
  if (['Russia', 'Ukraine', 'Belarus', 'Republic of Moldova', 'Estonia', 'Latvia', 'Lithuania', 'Armenia', 'Georgia', 'Azerbaijan'].includes(name)) return 'comintern ussr-core';
  if (['United Kingdom'].includes(name)) return 'allies uk-core';
  if (['France'].includes(name)) return 'french-vichy';
  if (['Italy'].includes(name)) return 'axis it-core';
  if (['Hungary', 'Romania', 'Bulgaria', 'Slovakia'].includes(name)) return 'axis-satellite';
  if (['Finland'].includes(name)) return 'co-belligerent';
  if (['Norway', 'Denmark', 'Belgium', 'Netherlands', 'Luxembourg', 'Serbia', 'Croatia', 'Bosnia and Herzegovina', 'Montenegro', 'The former Yugoslav Republic of Macedonia', 'Slovenia', 'Greece', 'Albania'].includes(name)) return 'axis-occupied';
  return 'neutral';
}

function coordsToSvgPath(geometry, isRussia = false) {
  let pathStr = '';

  function ringToPath(ring) {
    let str = '';
    let first = true;
    for (let i = 0; i < ring.length; i++) {
      const lon = ring[i][0];
      const lat = ring[i][1];
      // Clip far east Russia to European theatre (west of Urals ~62E) and north of Caspian/Caucasus
      if (isRussia && lon > 56) continue;
      const [x, y] = project(lon, lat);
      // Skip points way outside our European viewport
      if (x < -200 || x > 1800 || y < -200 || y > 1200) continue;

      if (first) {
        str += `M ${x},${y} `;
        first = false;
      } else {
        str += `L ${x},${y} `;
      }
    }
    if (str.length > 5) {
      str += 'Z ';
    }
    return str;
  }

  if (geometry.type === 'Polygon') {
    geometry.coordinates.forEach(ring => {
      pathStr += ringToPath(ring);
    });
  } else if (geometry.type === 'MultiPolygon') {
    geometry.coordinates.forEach(polygon => {
      polygon.forEach(ring => {
        pathStr += ringToPath(ring);
      });
    });
  }

  return pathStr.trim();
}

let svgCountries = [];

data.features.forEach(f => {
  const name = f.properties.NAME;
  const isRussia = (name === 'Russia');
  const d = coordsToSvgPath(f.geometry, isRussia);
  if (!d) return;

  const cls = getCountryClass(name);
  const id = 'c-' + name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  svgCountries.push({
    id,
    name,
    cls,
    d
  });
});

console.log('Total SVG countries generated:', svgCountries.length);

fs.writeFileSync('generated_svg_data.json', JSON.stringify({
  cities: cityCoords,
  countries: svgCountries
}, null, 2));

console.log('Successfully wrote generated_svg_data.json');
