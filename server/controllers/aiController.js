import Problem from "../models/Problem.js";
import Solution from "../models/Solution.js";

const extractText = (responseData) => {
    const candidates = responseData?.candidates || [];
    const parts = candidates[0]?.content?.parts || [];
    return parts.map((part) => part.text || "").join("\n").trim();
};

const parseSuggestions = (text) => {
    if (!text) {
        return [];
    }

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
        try {
            const parsed = JSON.parse(jsonMatch[0]);
            if (Array.isArray(parsed)) {
                return parsed.map((item) => String(item).trim()).filter(Boolean);
            }
        } catch {
            // fall through to line parsing
        }
    }

    return text
        .split(/\n+/)
        .map((line) => line.replace(/^[-*\d.)\s]+/, "").trim())
        .filter((line) => line.length > 0)
        .slice(0, 5);
};

const buildFallbackSuggestions = (problem) => {
    const area = problem?.location || "your area";
    return [
        `Create a small volunteer group in ${area} and assign weekly action tasks.`,
        "Report the issue to municipal authorities with photo evidence and ticket follow-up.",
        "Place temporary warning signage to reduce risk while the final fix is pending.",
        "Collect neighbor signatures and submit a community request to prioritize this issue.",
        "Run a weekend cleanup/repair drive with local shops, NGOs, or resident groups."
    ];
};

export const getAisuggestionsForProblem = async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.problemId);
        if (!problem) {
            return res.status(404).json({ message: "Problem Not Found" });
        }

        const existingSolutions = await Solution.find({ problemId: problem._id })
            .sort({ votes: -1 })
            .limit(3)
            .select("description votes");

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(200).json({
                message: "AI service is not configured. Showing practical fallback suggestions.",
                suggestions: buildFallbackSuggestions(problem),
                source: "fallback"
            });
        }

        const prompt = [
            "You are helping a community problem-solving platform.",
            "Suggest 5 practical, low-cost, locally feasible solutions.",
            "Return only a JSON array of short strings.",
            `Problem title: ${problem.title}`,
            `Problem description: ${problem.description}`,
            `Location: ${problem.location}`,
            existingSolutions.length > 0 ? `Existing community solutions: ${existingSolutions.map((solution) => solution.description).join(" | ")}` : "Existing community solutions: none"
        ].join("\n");

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_MODEL || "gemini-1.5-flash"}:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: prompt }]
                    }
                ]
            })
        });

        if (!response.ok) {
            return res.status(200).json({
                message: "AI service is temporarily unavailable. Showing practical fallback suggestions.",
                suggestions: buildFallbackSuggestions(problem),
                source: "fallback"
            });
        }

        const data = await response.json();
        const text = extractText(data);
        const suggestions = parseSuggestions(text);

        return res.status(200).json({
            message: "AI suggestions generated successfully",
            suggestions,
            rawText: text,
            source: "gemini"
        });
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            message: "AI generation failed. Showing practical fallback suggestions.",
            suggestions: [
                "Coordinate with nearby residents and create a quick response plan.",
                "Share issue photos and details with local authorities and track updates.",
                "Start a low-cost temporary mitigation until permanent repair is completed.",
                "Ask community volunteers to participate in a short weekend action drive.",
                "Document progress publicly to maintain accountability and momentum."
            ],
            source: "fallback"
        });
    }
};