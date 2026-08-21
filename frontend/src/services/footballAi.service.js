import api from "@/utils/axios.utils";
import { DEFAULT_AI_FIXTURES } from "@/data/aiFixtures";

export const footballAiService = {
  /**
   * Chat with Football AI (Synchronous)
   */
  chat: async (prompt, conversationHistory = []) => {
    const response = await api.post("/ai/chat", {
      prompt,
      conversationHistory,
    });
    return response.data;
  },

  /**
   * Live Streaming Chat with Football AI (Token-by-Token Generator)
   */
  streamChat: async (prompt, conversationHistory = [], onChunk, onDone, onError) => {
    try {
      const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${baseURL}/api/v1/ai/chat/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ prompt, conversationHistory }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.replace("data: ", "").trim();
            if (dataStr === "[DONE]") {
              if (onDone) onDone();
              return;
            }
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.text && onChunk) {
                onChunk(parsed.text);
              }
              if (parsed.error && onError) {
                onError(new Error(parsed.error));
              }
            } catch (e) {
              // Ignore partial parse
            }
          }
        }
      }

      if (onDone) onDone();
    } catch (err) {
      if (onError) onError(err);
      else throw err;
    }
  },

  /**
   * Analyze a completed match
   */
  analyzeMatch: async ({ homeTeam, awayTeam, score, competition, date }) => {
    const response = await api.post("/ai/analyze-match", {
      homeTeam,
      awayTeam,
      score,
      competition,
      date,
    });
    return response.data;
  },

  /**
   * Predict an upcoming match
   */
  predictMatch: async ({ homeTeam, awayTeam, competition, date }) => {
    const response = await api.post("/ai/predict-match", {
      homeTeam,
      awayTeam,
      competition,
      date,
    });
    return response.data;
  },

  /**
   * Explain a tactical football strategy
   */
  explainStrategy: async ({ tacticName, formation }) => {
    const response = await api.post("/ai/explain-strategy", {
      tacticName,
      formation,
    });
    return response.data;
  },

  /**
   * Get fixtures for past & upcoming games
   */
  getFixtures: async () => {
    try {
      const response = await api.get("/ai/fixtures");
      if (response?.data?.data) {
        return response.data;
      }
    } catch (e) {
      console.warn("Using default fixtures fallback:", e.message);
    }
    return { success: true, data: DEFAULT_AI_FIXTURES };
  },
};
