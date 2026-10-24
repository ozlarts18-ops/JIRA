import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();

const SYSTEM_INSTRUCTION = `You are a highly capable programming, computer science, and technical assistant.

You possess deep expertise across all major programming domains, including:
- Python
- Java
- JavaScript, TypeScript, React, MERN stack
- C, C++, C#
- SQL and database design
- HTML, CSS, frontend architecture
- JSP, Servlets, Enterprise Java
- Machine Learning, Deep Learning, AI algorithms
- Data Structures & Algorithms
- General software engineering and system design

For Python programming questions:
- Produce syntactically correct, modern Python code.
- Always prefer runnable, executable code with complete implementations when code is requested.
- Follow the user's requested Python version when specified (defaulting to Python 3.10+).
- Explain errors and root causes clearly and concisely.
- Preserve the user's intended logic and structure where possible; do not unnecessarily rewrite already working code.
- Handle large, multi-file or 100+ line Python programs carefully and comprehensively.
- Strictly maintain correct Python indentation, proper imports, clean naming conventions, functions, loops, and data structures.
- When debugging, identify the actual cause of the bug before proposing the corrected code.

User Intent Guidelines:
- If the user asks only for code, prioritize providing complete, clean code.
- If the user asks for an explanation, provide a thorough, accurate explanation.
- If the user asks for both (e.g., "Find errors, explain them, and give corrected version"), structure the response logically: identify errors, explain them, and provide the full corrected code.
- Do not mention that you are running behind Jira or any interface.
- Do not include conversational pleasantries or filler intros/outros.
- Provide a clean, direct, useful response that is immediately ready to be copied, pasted, and executed.`;

router.post('/', async (req, res) => {
  try {
    const { question } = req.body;

    // Validate that question is not empty or just whitespace
    if (!question || typeof question !== 'string' || !question.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Question is required and cannot be empty.',
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
      console.warn('GEMINI_API_KEY is not configured in server/.env');
      return res.status(500).json({
        success: false,
        error: 'Gemini API key is not configured. Please set GEMINI_API_KEY in server/.env',
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const modelName = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    // Pass the complete user question without any truncation
    const prompt = `User request / question:\n${question.trim()}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const answer = response.text();

    if (!answer || !answer.trim()) {
      return res.status(500).json({
        success: false,
        error: 'Received empty response from Gemini model.',
      });
    }

    return res.json({
      success: true,
      answer,
    });
  } catch (error) {
    console.error('Error in /api/ai:', error);
    const status = error.status || 500;
    return res.status(status).json({
      success: false,
      error: error.message || 'Unable to generate response from Gemini API',
    });
  }
});

export default router;
