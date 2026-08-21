import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const clubsDir = "d:/AdvanceCoding2.0/Projects/Football-Website/frontend/public/club";
const folders = fs.readdirSync(clubsDir).filter(f => fs.statSync(path.join(clubsDir, f)).isDirectory());

const LEAGUE_NAME_OVERRIDES = {
  "english-premier-league-2026-2027.football-logos.cc": "Premier League",
  "spain-la-liga-2026-2027.football-logos.cc": "Spain La Liga",
  "spain-la-liga-2-2026-2027.football-logos.cc": "La Liga 2",
  "italy-serie-a-2025-2026.football-logos.cc": "Italy Serie A",
  "italy-serie-b-2025-2026.football-logos.cc": "Italy Serie B",
  "germany-bundesliga-2026-2027.football-logos.cc": "Germany Bundesliga",
  "germany-2-bundesliga-2026-2027.football-logos.cc": "2. Bundesliga",
  "france-ligue-1-2025-2026.football-logos.cc": "France Ligue 1",
  "france-ligue-2-2025-2026.football-logos.cc": "France Ligue 2",
  "saudi-arabia-pro-league-2026-2027.football-logos.cc": "Saudi Pro League",
  "usa-mls-2025-2026.football-logos.cc": "USA MLS",
  "ucl-champions-league-2025-2026.football-logos.cc": "UEFA Champions League",
  "uefa-europa-league-2025-2026.football-logos.cc": "UEFA Europa League",
  "uefa-conference-league-2025-2026.football-logos.cc": "UEFA Conference League",
  "uefa-nations-league-2026-2027.football-logos.cc": "UEFA Nations League",
  "argentina-primera-division-2025-2026.football-logos.cc": "Argentina Primera División",
  "brazil-serie-a-2025-2026.football-logos.cc": "Brazil Serie A",
  "brazil-serie-b-2025-2026.football-logos.cc": "Brazil Serie B",
  "netherlands-eredivisie-2026-2027.football-logos.cc": "Netherlands Eredivisie",
  "portugal-primeira-liga-2025-2026.football-logos.cc": "Portugal Primeira Liga",
  "scotland-premiership-2026-2027.football-logos.cc": "Scotland Premiership",
  "turkey-super-lig-2026-2027.football-logos.cc": "Turkey Süper Lig",
  "turkey-2nd-lig-2026-2027.football-logos.cc": "Turkey 2. Lig",
  "belgium-pro-league-2025-2026.football-logos.cc": "Belgium Pro League",
  "austria-2-liga-2025-2026.football-logos.cc": "Austria 2. Liga",
  "england-efl-championship-2026-2027.football-logos.cc": "EFL Championship",
  "romania-liga-1-2025-2026.football-logos.cc": "Romania Liga 1",
  "russia-russian-premier-league-2026-2027.football-logos.cc": "Russian Premier League",
};

const CLUB_NAME_OVERRIDES = {
  "psg": "Paris Saint-Germain",
  "inter": "Inter Milan",
  "milan": "AC Milan",
  "bayern-munchen": "Bayern Munich",
  "inter-miami-cf": "Inter Miami",
  "toronto-fc": "Toronto FC",
  "manchester-city": "Manchester City",
  "manchester-united": "Manchester United",
  "tottenham": "Tottenham Hotspur",
  "athletic-club": "Athletic Club",
  "atletico-madrid": "Atletico Madrid",
  "real-madrid": "Real Madrid",
};

function formatClubName(filename) {
  let base = filename.replace(".football-logos.cc.png", "").replace(".png", "");
  if (CLUB_NAME_OVERRIDES[base]) return CLUB_NAME_OVERRIDES[base];
  return base.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

const leagues = folders.map(folder => {
  const folderPath = path.join(clubsDir, folder);
  const files = fs.readdirSync(folderPath).filter(f => f.endsWith(".png"));
  const clubs = files.map(file => ({
    name: formatClubName(file),
    image: `/club/${folder}/${file}`,
    filename: file
  }));

  return {
    leagueId: folder,
    leagueName: LEAGUE_NAME_OVERRIDES[folder] || folder.replace(".football-logos.cc", "").split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
    clubs
  };
});

const outPath = "d:/AdvanceCoding2.0/Projects/Football-Website/frontend/src/data/clubsByLeague.js";
const content = `// Auto-generated mapping of football clubs by league folder\nexport const clubsByLeague = ${JSON.stringify(leagues, null, 2)};\n`;
fs.writeFileSync(outPath, content, "utf8");
console.log(`Generated clubsByLeague.js with ${leagues.length} leagues and ${leagues.reduce((a, b) => a + b.clubs.length, 0)} total clubs.`);
