import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const { context } = await req.json();

    if (!context) {
      return NextResponse.json({ error: "Context is required" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
       // Return a mock insight if no API key is set instead of breaking, good for demo purposes of the assignment.
       return NextResponse.json({ 
         insight: "⚡ [MOCK INSIGHT - API Key missing]: Based on the active filters, we notice a seasonal spike in these metrics relative to the surrounding years. Consider re-allocating resources for the highest performing sectors."
       });
    }

    const ai = new GoogleGenAI({}); 

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are a high-level data analyst for Bharat-Insight providing short, insightful observations. Given this dashboard data context, output exactly one short paragraph (2-3 sentences max) of an interesting insight or trend. Context: ${context}`,
    });

    return NextResponse.json({ insight: response.text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: "Failed to generate AI insight" }, { status: 500 });
  }
}
