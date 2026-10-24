import React, { createContext, useContext, useState, useCallback } from 'react';
import { findBestMatchingCode } from '../utils/markdownQuestionMatcher';

const AIContext = createContext(null);

export const copyToClipboard = async (text) => {
  if (!text || !text.trim()) {
    throw new Error('Empty AI response');
  }

  // Primary: Modern Async Clipboard API
  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (apiErr) {
      console.warn('navigator.clipboard.writeText threw error, trying fallback:', apiErr);
    }
  }

  // Fallback: Invisible textarea + execCommand
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-999999px';
    textarea.style.top = '-999999px';
    textarea.setAttribute('readonly', '');
    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);

    if (successful) {
      return true;
    }
  } catch (fallbackErr) {
    console.error('execCommand fallback failed:', fallbackErr);
  }

  throw new Error('Clipboard write operation failed');
};

export const AIProvider = ({ children }) => {
  const [lastQuestion, setLastQuestion] = useState('');
  const [lastAIResponse, setLastAIResponse] = useState('');

  const askGemini = useCallback(async (question) => {
    const trimmed = question ? question.trim() : '';
    if (!trimmed) {
      throw new Error('Empty question');
    }

    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question: trimmed }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status} Error`);
    }

    const data = await response.json();
    if (!data.success || !data.answer) {
      throw new Error(data.error || 'Failed to receive answer from AI');
    }

    return data.answer;
  }, []);

  const submitQuestion = useCallback(
    async (question) => {
      const trimmed = question ? question.trim() : '';
      if (!trimmed) return;

      // Store the submitted question
      setLastQuestion(trimmed);

      try {
        const answer = await askGemini(trimmed);
        // Store the successful response
        setLastAIResponse(answer);

        // Attempt automatic clipboard copy
        try {
          await copyToClipboard(answer);
        } catch (clipErr) {
          console.error('Initial clipboard copy failed:', clipErr);
        }
      } catch (err) {
        console.error('AI request failed:', err);
      }
    },
    [askGemini]
  );

  const submitCodeFinder = useCallback(
    async (question) => {
      const trimmed = question ? question.trim() : '';
      if (!trimmed) return;

      setLastQuestion(trimmed);

      // 1. Search local Markdown file
      const matchResult = findBestMatchingCode(trimmed, 0.80);

      // 2. Match >= 80%?
      if (matchResult && matchResult.matched && matchResult.code) {
        // YES -> extract stored code -> clipboard
        setLastAIResponse(matchResult.code);
        try {
          await copyToClipboard(matchResult.code);
        } catch (clipErr) {
          console.error('Initial clipboard copy failed:', clipErr);
        }
        return matchResult;
      }

      // NO -> Log internal warning and fall back to existing Gemini AI
      console.warn('No matching question found above 80%');

      try {
        const answer = await askGemini(trimmed);
        setLastAIResponse(answer);
        try {
          await copyToClipboard(answer);
        } catch (clipErr) {
          console.error('Gemini fallback clipboard copy failed:', clipErr);
        }
      } catch (err) {
        console.error('Gemini AI fallback failed:', err);
      }
    },
    [askGemini]
  );

  const handleUpgradeFallback = useCallback(async () => {
    // 1. If we already have a generated answer or code, try copying it first
    if (lastAIResponse) {
      try {
        await copyToClipboard(lastAIResponse);
        return;
      } catch (copyErr) {
        console.error('Failed to copy existing AI response from Upgrade button:', copyErr);
      }
    }

    // 2. If copy failed or no response exists, retry the last question
    if (lastQuestion) {
      try {
        const answer = await askGemini(lastQuestion);
        setLastAIResponse(answer);
        await copyToClipboard(answer);
      } catch (retryErr) {
        console.error('AI retry failed on Upgrade click:', retryErr);
      }
    } else {
      console.warn('No previous AI request available');
    }
  }, [lastAIResponse, lastQuestion, askGemini]);

  return (
    <AIContext.Provider
      value={{
        lastQuestion,
        lastAIResponse,
        submitQuestion,
        submitCodeFinder,
        handleUpgradeFallback,
      }}
    >
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};
