
import { GoogleGenAI, Type } from "@google/genai";
import { Concept, DailyRecommendation, UserProfile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `You are the OMNIORA Knowledge Core—the ultimate knowledge engine. 
Synthesize high-density, futuristic micro-learning nodes across 20+ advanced domains (Quantum Mechanics, Bioinformatics, AI, etc.).

CONTENT RULES:
- Lessons must be dense but micro (200-300 words).
- Language: Strictly provide both English and Arabic translations for everything.
- Advanced Resources: Provide real-world or theoretical deep-dive links (YouTube, scientific papers, or articles).
- Tone: Cold, futuristic, high-intellect, precise.

QUIZ:
- 3-5 rigorous questions.
- Bilingual options and explanations.`;

export const discoverTopics = async (domain: string): Promise<string[]> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `List 10 foundational and 5 frontier topics for the domain: ${domain}. Focus on high-impact knowledge.`,
    config: {
      systemInstruction: "Knowledge Architect Mode. Return JSON array of strings.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: { topics: { type: Type.ARRAY, items: { type: Type.STRING } } },
        required: ["topics"]
      }
    }
  });
  return JSON.parse(response.text).topics;
};

export const generateConcept = async (domain: string, topic: string, extended: boolean = false): Promise<Concept> => {
  const user = (await import('./dbService')).getUser();
  const mastery = user.detailedMastery[`${domain}:${topic}`] || 0;
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Synthesize a bilingual node for "${topic}" in ${domain}. Mastery level: ${mastery}%.`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title_en: { type: Type.STRING },
          title_ar: { type: Type.STRING },
          category: { type: Type.STRING },
          lesson_en: { type: Type.STRING },
          lesson_ar: { type: Type.STRING },
          extendedLesson_en: { type: Type.STRING },
          extendedLesson_ar: { type: Type.STRING },
          relatedConcepts: { type: Type.ARRAY, items: { type: Type.STRING } },
          advancedResources: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                url: { type: Type.STRING },
                type: { type: Type.STRING }
              }
            }
          },
          quiz: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question_en: { type: Type.STRING },
                question_ar: { type: Type.STRING },
                options_en: { type: Type.ARRAY, items: { type: Type.STRING } },
                options_ar: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctAnswer: { type: Type.INTEGER },
                explanation_en: { type: Type.STRING },
                explanation_ar: { type: Type.STRING }
              },
              required: ["question_en", "question_ar", "options_en", "options_ar", "correctAnswer"]
            }
          }
        },
        required: ["title_en", "title_ar", "lesson_en", "lesson_ar", "quiz"]
      }
    }
  });

  const data = JSON.parse(response.text);
  
  return {
    id: `concept-${Date.now()}`,
    domain: domain as any,
    topic,
    title_en: data.title_en,
    title_ar: data.title_ar,
    category: data.category,
    lesson_en: data.lesson_en,
    lesson_ar: data.lesson_ar,
    extendedLesson_en: data.extendedLesson_en,
    extendedLesson_ar: data.extendedLesson_ar,
    quiz: data.quiz,
    advancedResources: data.advancedResources,
    difficulty: mastery > 50 ? 'Expert' : 'Novice',
    xpReward: (extended ? 300 : 200) + (data.quiz.length * 25),
    relatedConcepts: data.relatedConcepts || []
  };
};

export const getDailyRecommendation = async (user: UserProfile): Promise<DailyRecommendation> => {
  const summary = {
    mastery: user.mastery,
    weakest: Object.entries(user.detailedMastery).sort((a,b) => a[1]-b[1]).slice(0, 3)
  };

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze neural data: ${JSON.stringify(summary)}. Select a topic from the 20+ domains to study.`,
    config: {
        systemInstruction: "Neural Curator Mode. Suggest one domain, one topic, and a clinical reason.",
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                topic: { type: Type.STRING },
                domain: { type: Type.STRING },
                reason: { type: Type.STRING },
                isFrontier: { type: Type.BOOLEAN }
            }
        }
    }
  });
  return JSON.parse(response.text);
};

export const generateNeuralAlert = async (user: UserProfile, recommendation: DailyRecommendation): Promise<{ title: string; message: string }> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Engagement alert for streak ${user.streak}, targeting ${recommendation.topic}.`,
    config: {
      systemInstruction: "Omniora Herald Mode. High-impact engagement text JSON.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          message: { type: Type.STRING }
        }
      }
    }
  });
  return JSON.parse(response.text);
};
