import { clubsByLeague } from "./clubsByLeague";

// Create a fast lookup map for all 640+ clubs across all 28 leagues
const CLUB_IMAGE_LOOKUP = {};

clubsByLeague.forEach((league) => {
  league.clubs.forEach((club) => {
    CLUB_IMAGE_LOOKUP[club.name.toLowerCase().trim()] = club.image;
  });
});

export function resolveClubLogo(teamName) {
  if (!teamName) return "/club/spain-la-liga-2026-2027.football-logos.cc/real-madrid.football-logos.cc.png";
  const normalized = teamName.toLowerCase().trim();

  if (CLUB_IMAGE_LOOKUP[normalized]) {
    return CLUB_IMAGE_LOOKUP[normalized];
  }

  // Substring / alias search
  const foundKey = Object.keys(CLUB_IMAGE_LOOKUP).find(
    (k) => normalized.includes(k) || k.includes(normalized)
  );

  return foundKey
    ? CLUB_IMAGE_LOOKUP[foundKey]
    : "/club/spain-la-liga-2026-2027.football-logos.cc/real-madrid.football-logos.cc.png";
}

export const DEFAULT_AI_FIXTURES = {
  pastMatches: [
    {
      id: "past_super_cup",
      homeTeam: "Real Madrid",
      awayTeam: "Atalanta",
      homeScore: 2,
      awayScore: 0,
      competition: "UEFA Super Cup",
      date: "Aug 14 • Full Time",
      homeLogo: resolveClubLogo("Real Madrid"),
      awayLogo: resolveClubLogo("Atalanta"),
      stadium: "National Stadium, Warsaw",
    },
    {
      id: "past_shield",
      homeTeam: "Manchester City",
      awayTeam: "Manchester United",
      homeScore: 1,
      awayScore: 1,
      competition: "FA Community Shield",
      date: "Aug 10 • Pens (7-6)",
      homeLogo: resolveClubLogo("Manchester City"),
      awayLogo: resolveClubLogo("Manchester United"),
      stadium: "Wembley Stadium, London",
    },
    {
      id: "past_gamper",
      homeTeam: "Barcelona",
      awayTeam: "Monaco",
      homeScore: 0,
      awayScore: 3,
      competition: "Joan Gamper Trophy",
      date: "Aug 12 • Full Time",
      homeLogo: resolveClubLogo("Barcelona"),
      awayLogo: resolveClubLogo("Monaco"),
      stadium: "Estadi Olímpic Lluís Companys, Barcelona",
    },
    {
      id: "past_emirates",
      homeTeam: "Arsenal",
      awayTeam: "Bayer Leverkusen",
      homeScore: 4,
      awayScore: 1,
      competition: "Emirates Cup",
      date: "Aug 7 • Full Time",
      homeLogo: resolveClubLogo("Arsenal"),
      awayLogo: resolveClubLogo("Bayer Leverkusen"),
      stadium: "Emirates Stadium, London",
    },
    {
      id: "past_anfield",
      homeTeam: "Liverpool",
      awayTeam: "Sevilla",
      homeScore: 4,
      awayScore: 1,
      competition: "Club Friendly",
      date: "Aug 11 • Full Time",
      homeLogo: resolveClubLogo("Liverpool"),
      awayLogo: resolveClubLogo("Sevilla"),
      stadium: "Anfield, Liverpool",
    },
    {
      id: "past_bridge",
      homeTeam: "Chelsea",
      awayTeam: "Inter Milan",
      homeScore: 1,
      awayScore: 1,
      competition: "Club Friendly",
      date: "Aug 11 • Full Time",
      homeLogo: resolveClubLogo("Chelsea"),
      awayLogo: resolveClubLogo("Inter Milan"),
      stadium: "Stamford Bridge, London",
    },
  ],
  upcomingMatches: [
    {
      id: "up_espanyol_madrid",
      homeTeam: "Espanyol",
      awayTeam: "Real Madrid",
      competition: "Spain La Liga",
      date: "Sun, Aug 23 • 21:30 CET",
      homeLogo: resolveClubLogo("Espanyol"),
      awayLogo: resolveClubLogo("Real Madrid"),
      stadium: "RCDE Stadium, Cornellà de Llobregat",
    },
    {
      id: "up_elche_barcelona",
      homeTeam: "Elche",
      awayTeam: "Barcelona",
      competition: "Spain La Liga",
      date: "Mon, Aug 24 • 21:30 CET",
      homeLogo: resolveClubLogo("Elche"),
      awayLogo: resolveClubLogo("Barcelona"),
      stadium: "Estadio Manuel Martínez Valero, Elche",
    },
    {
      id: "up_miami_toronto",
      homeTeam: "Inter Miami",
      awayTeam: "Toronto FC",
      competition: "USA MLS",
      date: "Sun, Aug 23 • 19:30 EST",
      homeLogo: resolveClubLogo("Inter Miami"),
      awayLogo: resolveClubLogo("Toronto FC"),
      stadium: "Chase Stadium, Fort Lauderdale",
    },
    {
      id: "up_newcastle_liverpool",
      homeTeam: "Newcastle United",
      awayTeam: "Liverpool",
      competition: "Premier League",
      date: "Sun, Aug 23 • 16:30 BST",
      homeLogo: resolveClubLogo("Newcastle"),
      awayLogo: resolveClubLogo("Liverpool"),
      stadium: "St. James' Park, Newcastle",
    },
    {
      id: "up_city_bournemouth",
      homeTeam: "Manchester City",
      awayTeam: "AFC Bournemouth",
      competition: "Premier League",
      date: "Sun, Aug 23 • 14:00 BST",
      homeLogo: resolveClubLogo("Manchester City"),
      awayLogo: resolveClubLogo("Bournemouth"),
      stadium: "Etihad Stadium, Manchester",
    },
    {
      id: "up_brentford_tottenham",
      homeTeam: "Brentford",
      awayTeam: "Tottenham Hotspur",
      competition: "Premier League",
      date: "Sat, Aug 22 • 17:30 BST",
      homeLogo: resolveClubLogo("Brentford"),
      awayLogo: resolveClubLogo("Tottenham"),
      stadium: "Gtech Community Stadium, London",
    },
    {
      id: "up_hull_united",
      homeTeam: "Hull City",
      awayTeam: "Manchester United",
      competition: "Premier League",
      date: "Sat, Aug 22 • 12:30 BST",
      homeLogo: resolveClubLogo("Hull City"),
      awayLogo: resolveClubLogo("Manchester United"),
      stadium: "MKM Stadium, Hull",
    },
    {
      id: "up_fulham_chelsea",
      homeTeam: "Fulham",
      awayTeam: "Chelsea",
      competition: "Premier League",
      date: "Mon, Aug 24 • 20:00 BST",
      homeLogo: resolveClubLogo("Fulham"),
      awayLogo: resolveClubLogo("Chelsea"),
      stadium: "Craven Cottage, London",
    },
  ],
};

export function getDynamicFixtures() {
  return DEFAULT_AI_FIXTURES;
}
