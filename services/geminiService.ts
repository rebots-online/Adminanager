
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Miner, MinerStatus } from "../types";

const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI | null = null;

if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
  console.warn("Gemini API key not found. Smart features will be disabled. Set process.env.API_KEY.");
}

export const generateMinerSummary = async (miner: Miner): Promise<string> => {
  if (!ai) {
    return "Gemini API not available. API key is missing.";
  }

  const model = 'gemini-2.5-flash-preview-04-17';
  
  const prompt = `
    Analyze the following Bitcoin miner's status and provide a concise summary (2-3 sentences) focusing on its performance and any potential issues.
    Miner Data:
    - IP Address: ${miner.ip}
    - Model: ${miner.type}
    - Status: ${miner.status}
    - Working Mode: ${miner.workingMode}
    - Real-time Hashrate: ${miner.hashRateRT}
    - Average Hashrate: ${miner.hashRateAvg}
    - Temperature: ${miner.temperature}
    - Fan Speed: ${miner.fanSpeed}
    - Uptime: ${miner.elapsed}
    - Pools: ${miner.pools.map(p => `${p.url} (Worker: ${p.worker})`).join(', ')}

    Example good summary: "Miner ${miner.ip} (${miner.type}) is operating successfully in ${miner.workingMode} mode with a strong hashrate of ${miner.hashRateRT}. Temperatures and fan speeds are nominal. All pools connected."
    Example warning summary: "Miner ${miner.ip} (${miner.type}) shows an error status and a low hashrate of ${miner.hashRateRT}, potentially indicating a hardware or configuration problem. Temperatures are high (${miner.temperature}). Investigate immediately."
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: model,
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating miner summary with Gemini:", error);
    if (error instanceof Error) {
        return `Error from Gemini: ${error.message}`;
    }
    return "An unknown error occurred while generating the summary.";
  }
};
