import {
  chatWithFootballAI,
  streamChatWithFootballAI,
  analyzeCompletedMatch,
  predictUpcomingMatch,
  explainTacticalStrategy,
  fetchFixturesWithGemini,
} from "../services/gemini.service.js";

// Comprehensive mapping for all major global clubs across 28 leagues
const EXTENSIVE_CLUB_LOGOS = {
  // Spain La Liga & La Liga 2
  "espanyol": "/club/spain-la-liga-2026-2027.football-logos.cc/espanyol.football-logos.cc.png",
  "rcd espanyol": "/club/spain-la-liga-2026-2027.football-logos.cc/espanyol.football-logos.cc.png",
  "elche": "/club/spain-la-liga-2026-2027.football-logos.cc/elche.football-logos.cc.png",
  "elche cf": "/club/spain-la-liga-2026-2027.football-logos.cc/elche.football-logos.cc.png",
  "real madrid": "/club/spain-la-liga-2026-2027.football-logos.cc/real-madrid.football-logos.cc.png",
  "barcelona": "/club/spain-la-liga-2026-2027.football-logos.cc/barcelona.football-logos.cc.png",
  "fc barcelona": "/club/spain-la-liga-2026-2027.football-logos.cc/barcelona.football-logos.cc.png",
  "atletico madrid": "/club/spain-la-liga-2026-2027.football-logos.cc/atletico-madrid.football-logos.cc.png",
  "atlético madrid": "/club/spain-la-liga-2026-2027.football-logos.cc/atletico-madrid.football-logos.cc.png",
  "athletic club": "/club/spain-la-liga-2026-2027.football-logos.cc/athletic-club.football-logos.cc.png",
  "athletic bilbao": "/club/spain-la-liga-2026-2027.football-logos.cc/athletic-club.football-logos.cc.png",
  "real sociedad": "/club/spain-la-liga-2026-2027.football-logos.cc/real-sociedad.football-logos.cc.png",
  "real betis": "/club/spain-la-liga-2026-2027.football-logos.cc/real-betis.football-logos.cc.png",
  "sevilla": "/club/spain-la-liga-2026-2027.football-logos.cc/sevilla.football-logos.cc.png",
  "valencia": "/club/spain-la-liga-2026-2027.football-logos.cc/valencia.football-logos.cc.png",
  "villarreal": "/club/spain-la-liga-2026-2027.football-logos.cc/villarreal.football-logos.cc.png",
  "rayo vallecano": "/club/spain-la-liga-2026-2027.football-logos.cc/rayo-vallecano.football-logos.cc.png",
  "celta": "/club/spain-la-liga-2026-2027.football-logos.cc/celta.football-logos.cc.png",
  "celta vigo": "/club/spain-la-liga-2026-2027.football-logos.cc/celta.football-logos.cc.png",
  "osasuna": "/club/spain-la-liga-2026-2027.football-logos.cc/osasuna.football-logos.cc.png",
  "getafe": "/club/spain-la-liga-2026-2027.football-logos.cc/getafe.football-logos.cc.png",
  "levante": "/club/spain-la-liga-2026-2027.football-logos.cc/levante.football-logos.cc.png",
  "malaga": "/club/spain-la-liga-2026-2027.football-logos.cc/malaga.football-logos.cc.png",
  "deportivo": "/club/spain-la-liga-2026-2027.football-logos.cc/deportivo.football-logos.cc.png",

  // USA MLS
  "inter miami": "/club/usa-mls-2025-2026.football-logos.cc/inter-miami-cf.football-logos.cc.png",
  "inter miami cf": "/club/usa-mls-2025-2026.football-logos.cc/inter-miami-cf.football-logos.cc.png",
  "toronto fc": "/club/usa-mls-2025-2026.football-logos.cc/toronto-fc.football-logos.cc.png",
  "toronto": "/club/usa-mls-2025-2026.football-logos.cc/toronto-fc.football-logos.cc.png",
  "cf montreal": "/club/usa-mls-2025-2026.football-logos.cc/cf-montreal.football-logos.cc.png",
  "cf montréal": "/club/usa-mls-2025-2026.football-logos.cc/cf-montreal.football-logos.cc.png",
  "la galaxy": "/club/usa-mls-2025-2026.football-logos.cc/la-galaxy.football-logos.cc.png",
  "los angeles fc": "/club/usa-mls-2025-2026.football-logos.cc/los-angeles-fc.football-logos.cc.png",
  "lafc": "/club/usa-mls-2025-2026.football-logos.cc/los-angeles-fc.football-logos.cc.png",
  "atlanta united": "/club/usa-mls-2025-2026.football-logos.cc/atlanta-united.football-logos.cc.png",
  "seattle sounders": "/club/usa-mls-2025-2026.football-logos.cc/seattle-sounders-fc.football-logos.cc.png",
  "new york red bulls": "/club/usa-mls-2025-2026.football-logos.cc/new-york-red-bulls.football-logos.cc.png",
  "new york city fc": "/club/usa-mls-2025-2026.football-logos.cc/new-york-city-fc.football-logos.cc.png",

  // Premier League & Championship
  "arsenal": "/club/english-premier-league-2026-2027.football-logos.cc/arsenal.football-logos.cc.png",
  "aston villa": "/club/english-premier-league-2026-2027.football-logos.cc/aston-villa.football-logos.cc.png",
  "bournemouth": "/club/english-premier-league-2026-2027.football-logos.cc/bournemouth.football-logos.cc.png",
  "afc bournemouth": "/club/english-premier-league-2026-2027.football-logos.cc/bournemouth.football-logos.cc.png",
  "brentford": "/club/english-premier-league-2026-2027.football-logos.cc/brentford.football-logos.cc.png",
  "brighton": "/club/english-premier-league-2026-2027.football-logos.cc/brighton.football-logos.cc.png",
  "brighton & hove albion": "/club/english-premier-league-2026-2027.football-logos.cc/brighton.football-logos.cc.png",
  "chelsea": "/club/english-premier-league-2026-2027.football-logos.cc/chelsea.football-logos.cc.png",
  "coventry city": "/club/english-premier-league-2026-2027.football-logos.cc/coventry-city.football-logos.cc.png",
  "crystal palace": "/club/english-premier-league-2026-2027.football-logos.cc/crystal-palace.football-logos.cc.png",
  "everton": "/club/english-premier-league-2026-2027.football-logos.cc/everton.football-logos.cc.png",
  "fulham": "/club/english-premier-league-2026-2027.football-logos.cc/fulham.football-logos.cc.png",
  "hull city": "/club/english-premier-league-2026-2027.football-logos.cc/hull-city.football-logos.cc.png",
  "ipswich": "/club/english-premier-league-2026-2027.football-logos.cc/ipswich.football-logos.cc.png",
  "ipswich town": "/club/english-premier-league-2026-2027.football-logos.cc/ipswich.football-logos.cc.png",
  "leeds united": "/club/english-premier-league-2026-2027.football-logos.cc/leeds-united.football-logos.cc.png",
  "liverpool": "/club/english-premier-league-2026-2027.football-logos.cc/liverpool.football-logos.cc.png",
  "manchester city": "/club/english-premier-league-2026-2027.football-logos.cc/manchester-city.football-logos.cc.png",
  "man city": "/club/english-premier-league-2026-2027.football-logos.cc/manchester-city.football-logos.cc.png",
  "manchester united": "/club/english-premier-league-2026-2027.football-logos.cc/manchester-united.football-logos.cc.png",
  "man united": "/club/english-premier-league-2026-2027.football-logos.cc/manchester-united.football-logos.cc.png",
  "newcastle": "/club/english-premier-league-2026-2027.football-logos.cc/newcastle.football-logos.cc.png",
  "newcastle united": "/club/english-premier-league-2026-2027.football-logos.cc/newcastle.football-logos.cc.png",
  "nottingham forest": "/club/english-premier-league-2026-2027.football-logos.cc/nottingham-forest.football-logos.cc.png",
  "sunderland": "/club/english-premier-league-2026-2027.football-logos.cc/sunderland.football-logos.cc.png",
  "tottenham": "/club/english-premier-league-2026-2027.football-logos.cc/tottenham.football-logos.cc.png",
  "tottenham hotspur": "/club/english-premier-league-2026-2027.football-logos.cc/tottenham.football-logos.cc.png",
  "spurs": "/club/english-premier-league-2026-2027.football-logos.cc/tottenham.football-logos.cc.png",

  // Italy Serie A & Serie B
  "inter": "/club/italy-serie-a-2025-2026.football-logos.cc/inter.football-logos.cc.png",
  "inter milan": "/club/italy-serie-a-2025-2026.football-logos.cc/inter.football-logos.cc.png",
  "internazionale": "/club/italy-serie-a-2025-2026.football-logos.cc/inter.football-logos.cc.png",
  "milan": "/club/italy-serie-a-2025-2026.football-logos.cc/milan.football-logos.cc.png",
  "ac milan": "/club/italy-serie-a-2025-2026.football-logos.cc/milan.football-logos.cc.png",
  "juventus": "/club/italy-serie-a-2025-2026.football-logos.cc/juventus.football-logos.cc.png",
  "juve": "/club/italy-serie-a-2025-2026.football-logos.cc/juventus.football-logos.cc.png",
  "atalanta": "/club/italy-serie-a-2025-2026.football-logos.cc/atalanta.football-logos.cc.png",
  "napoli": "/club/italy-serie-a-2025-2026.football-logos.cc/napoli.football-logos.cc.png",
  "roma": "/club/italy-serie-a-2025-2026.football-logos.cc/roma.football-logos.cc.png",
  "as roma": "/club/italy-serie-a-2025-2026.football-logos.cc/roma.football-logos.cc.png",
  "lazio": "/club/italy-serie-a-2025-2026.football-logos.cc/lazio.football-logos.cc.png",
  "fiorentina": "/club/italy-serie-a-2025-2026.football-logos.cc/fiorentina.football-logos.cc.png",
  "bologna": "/club/italy-serie-a-2025-2026.football-logos.cc/bologna.football-logos.cc.png",
  "torino": "/club/italy-serie-a-2025-2026.football-logos.cc/torino.football-logos.cc.png",

  // Germany Bundesliga
  "bayern munich": "/club/germany-bundesliga-2026-2027.football-logos.cc/bayern-munchen.football-logos.cc.png",
  "bayern münchen": "/club/germany-bundesliga-2026-2027.football-logos.cc/bayern-munchen.football-logos.cc.png",
  "bayern": "/club/germany-bundesliga-2026-2027.football-logos.cc/bayern-munchen.football-logos.cc.png",
  "borussia dortmund": "/club/germany-bundesliga-2026-2027.football-logos.cc/borussia-dortmund.football-logos.cc.png",
  "dortmund": "/club/germany-bundesliga-2026-2027.football-logos.cc/borussia-dortmund.football-logos.cc.png",
  "bvb": "/club/germany-bundesliga-2026-2027.football-logos.cc/borussia-dortmund.football-logos.cc.png",
  "bayer leverkusen": "/club/germany-bundesliga-2026-2027.football-logos.cc/bayer-leverkusen.football-logos.cc.png",
  "leverkusen": "/club/germany-bundesliga-2026-2027.football-logos.cc/bayer-leverkusen.football-logos.cc.png",
  "rb leipzig": "/club/germany-bundesliga-2026-2027.football-logos.cc/rb-leipzig.football-logos.cc.png",
  "leipzig": "/club/germany-bundesliga-2026-2027.football-logos.cc/rb-leipzig.football-logos.cc.png",
  "eintracht frankfurt": "/club/germany-bundesliga-2026-2027.football-logos.cc/eintracht-frankfurt.football-logos.cc.png",
  "stuttgart": "/club/germany-bundesliga-2026-2027.football-logos.cc/vfb-stuttgart.football-logos.cc.png",

  // France Ligue 1
  "paris saint-germain": "/club/france-ligue-1-2025-2026.football-logos.cc/paris-saint-germain.football-logos.cc.png",
  "psg": "/club/france-ligue-1-2025-2026.football-logos.cc/paris-saint-germain.football-logos.cc.png",
  "marseille": "/club/france-ligue-1-2025-2026.football-logos.cc/marseille.football-logos.cc.png",
  "om": "/club/france-ligue-1-2025-2026.football-logos.cc/marseille.football-logos.cc.png",
  "monaco": "/club/france-ligue-1-2025-2026.football-logos.cc/monaco.football-logos.cc.png",
  "as monaco": "/club/france-ligue-1-2025-2026.football-logos.cc/monaco.football-logos.cc.png",
  "lyon": "/club/france-ligue-1-2025-2026.football-logos.cc/lyon.football-logos.cc.png",
  "olympique lyonnais": "/club/france-ligue-1-2025-2026.football-logos.cc/lyon.football-logos.cc.png",
  "lille": "/club/france-ligue-1-2025-2026.football-logos.cc/lille.football-logos.cc.png",
  "nice": "/club/france-ligue-1-2025-2026.football-logos.cc/nice.football-logos.cc.png",

  // Saudi Pro League
  "al nassr": "/club/saudi-arabia-pro-league-2026-2027.football-logos.cc/al-nassr.football-logos.cc.png",
  "al hilal": "/club/saudi-arabia-pro-league-2026-2027.football-logos.cc/al-hilal.football-logos.cc.png",
  "al ittihad": "/club/saudi-arabia-pro-league-2026-2027.football-logos.cc/al-ittihad.football-logos.cc.png",
  "al ahli": "/club/saudi-arabia-pro-league-2026-2027.football-logos.cc/al-ahli.football-logos.cc.png",

  // Portugal, Netherlands, Scotland, Turkey, Argentina, Brazil
  "benfica": "/club/portugal-primeira-liga-2025-2026.football-logos.cc/benfica.football-logos.cc.png",
  "porto": "/club/portugal-primeira-liga-2025-2026.football-logos.cc/porto.football-logos.cc.png",
  "sporting cp": "/club/portugal-primeira-liga-2025-2026.football-logos.cc/sporting-cp.football-logos.cc.png",
  "sporting": "/club/portugal-primeira-liga-2025-2026.football-logos.cc/sporting-cp.football-logos.cc.png",
  "ajax": "/club/netherlands-eredivisie-2026-2027.football-logos.cc/ajax.football-logos.cc.png",
  "psv": "/club/netherlands-eredivisie-2026-2027.football-logos.cc/psv.football-logos.cc.png",
  "feyenoord": "/club/netherlands-eredivisie-2026-2027.football-logos.cc/feyenoord.football-logos.cc.png",
  "celtic": "/club/scotland-premiership-2026-2027.football-logos.cc/celtic.football-logos.cc.png",
  "rangers": "/club/scotland-premiership-2026-2027.football-logos.cc/rangers.football-logos.cc.png",
  "galatasaray": "/club/turkey-super-lig-2026-2027.football-logos.cc/galatasaray.football-logos.cc.png",
  "fenerbahce": "/club/turkey-super-lig-2026-2027.football-logos.cc/fenerbahce.football-logos.cc.png",
  "besiktas": "/club/turkey-super-lig-2026-2027.football-logos.cc/besiktas.football-logos.cc.png",
  "boca juniors": "/club/argentina-primera-division-2025-2026.football-logos.cc/boca-juniors.football-logos.cc.png",
  "river plate": "/club/argentina-primera-division-2025-2026.football-logos.cc/river-plate.football-logos.cc.png",
  "flamengo": "/club/brazil-serie-a-2025-2026.football-logos.cc/flamengo.football-logos.cc.png",
  "palmeiras": "/club/brazil-serie-a-2025-2026.football-logos.cc/palmeiras.football-logos.cc.png",
};

export function resolveClubLogo(teamName) {
  if (!teamName) return "/club/spain-la-liga-2026-2027.football-logos.cc/real-madrid.football-logos.cc.png";
  const normalized = teamName.toLowerCase().trim();
  if (EXTENSIVE_CLUB_LOGOS[normalized]) return EXTENSIVE_CLUB_LOGOS[normalized];

  const key = Object.keys(EXTENSIVE_CLUB_LOGOS).find(
    (k) => normalized.includes(k) || k.includes(normalized)
  );
  return key ? EXTENSIVE_CLUB_LOGOS[key] : "/club/spain-la-liga-2026-2027.football-logos.cc/real-madrid.football-logos.cc.png";
}

// Fallback verified fixtures
const FALLBACK_FIXTURES = {
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
      homeLogo: resolveClubLogo("Newcastle United"),
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
      awayLogo: resolveClubLogo("AFC Bournemouth"),
      stadium: "Etihad Stadium, Manchester",
    },
    {
      id: "up_brentford_tottenham",
      homeTeam: "Brentford",
      awayTeam: "Tottenham Hotspur",
      competition: "Premier League",
      date: "Sat, Aug 22 • 17:30 BST",
      homeLogo: resolveClubLogo("Brentford"),
      awayLogo: resolveClubLogo("Tottenham Hotspur"),
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

// 1. AI Assistant Conversational Chat (Synchronous)
export const handleAIChat = async (req, res) => {
  try {
    const { prompt, conversationHistory = [] } = req.body;
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ success: false, message: "Prompt text is required." });
    }

    const reply = await chatWithFootballAI(prompt, conversationHistory);
    return res.status(200).json({ success: true, response: reply });
  } catch (error) {
    console.error("AI Chat Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to communicate with Football AI.",
    });
  }
};

// 1b. Live Streaming AI Chat (Server-Sent Events / SSE)
export const handleAIChatStream = async (req, res) => {
  try {
    const { prompt, conversationHistory = [] } = req.body;
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ success: false, message: "Prompt text is required." });
    }

    // Set headers for Server-Sent Events (SSE)
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    if (typeof res.flushHeaders === "function") {
      res.flushHeaders();
    }

    const stream = streamChatWithFootballAI(prompt, conversationHistory);
    for await (const chunk of stream) {
      res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    console.error("AI Streaming Chat Error:", error);
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to stream AI response.",
      });
    }
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
};

// 2. Tactical Analysis for Completed Match
export const handleAnalyzeMatch = async (req, res) => {
  try {
    const { homeTeam, awayTeam, score, competition, date } = req.body;
    if (!homeTeam || !awayTeam) {
      return res.status(400).json({ success: false, message: "Home and Away teams are required." });
    }

    const analysis = await analyzeCompletedMatch({
      homeTeam,
      awayTeam,
      score: score || "Completed Match",
      competition,
      date,
    });

    return res.status(200).json({ success: true, analysis });
  } catch (error) {
    console.error("AI Match Analysis Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to analyze match.",
    });
  }
};

// 3. Probabilistic Prediction for Upcoming Match
export const handlePredictMatch = async (req, res) => {
  try {
    const { homeTeam, awayTeam, competition, date } = req.body;
    if (!homeTeam || !awayTeam) {
      return res.status(400).json({ success: false, message: "Home and Away teams are required." });
    }

    const prediction = await predictUpcomingMatch({
      homeTeam,
      awayTeam,
      competition,
      date,
    });

    return res.status(200).json({ success: true, prediction });
  } catch (error) {
    console.error("AI Prediction Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to generate prediction.",
    });
  }
};

// 4. Tactical Strategy Playbook Deep Dive
export const handleExplainStrategy = async (req, res) => {
  try {
    const { tacticName, formation } = req.body;
    if (!tacticName) {
      return res.status(400).json({ success: false, message: "Tactic name is required." });
    }

    const strategy = await explainTacticalStrategy({ tacticName, formation });
    return res.status(200).json({ success: true, strategy });
  } catch (error) {
    console.error("AI Strategy Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to explain strategy.",
    });
  }
};

// 5. Get Real Dynamic Fixtures Using Google Gemini AI
export const handleGetFixtures = async (req, res) => {
  try {
    const aiData = await fetchFixturesWithGemini();

    if (aiData && (aiData.upcomingMatches?.length || aiData.pastMatches?.length)) {
      const enrichedUpcoming = (aiData.upcomingMatches || []).map((m, idx) => ({
        ...m,
        id: m.id || `up_ai_${idx}`,
        homeLogo: resolveClubLogo(m.homeTeam),
        awayLogo: resolveClubLogo(m.awayTeam),
      }));

      const enrichedPast = (aiData.pastMatches || []).map((m, idx) => ({
        ...m,
        id: m.id || `past_ai_${idx}`,
        homeLogo: resolveClubLogo(m.homeTeam),
        awayLogo: resolveClubLogo(m.awayTeam),
      }));

      return res.status(200).json({
        success: true,
        data: {
          pastMatches: enrichedPast,
          upcomingMatches: enrichedUpcoming,
        },
      });
    }

    return res.status(200).json({ success: true, data: FALLBACK_FIXTURES });
  } catch (error) {
    console.warn("Gemini fixtures endpoint error, using verified fixtures fallback:", error.message);
    return res.status(200).json({ success: true, data: FALLBACK_FIXTURES });
  }
};
