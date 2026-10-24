import rawMarkdown from '../../AIAD_Question_Bank_Answers.md?raw';

// Basic stopwords to ignore when computing semantic keyword similarity
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and',
  'any', 'are', 'aren\'t', 'as', 'at', 'be', 'because', 'been', 'before', 'being',
  'below', 'between', 'both', 'but', 'by', 'can', 'cannot', 'could', 'did', 'do',
  'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had',
  'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself',
  'his', 'how', 'i', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'its', 'itself',
  'let', 'me', 'more', 'most', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off',
  'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out',
  'over', 'own', 'same', 'she', 'should', 'so', 'some', 'such', 'than', 'that',
  'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they',
  'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was',
  'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why',
  'with', 'would', 'you', 'your', 'yours', 'yourself', 'yourselves', 'whether'
]);

// Normalize a word: lowercasing, simple suffix stemming, and synonym mapping
export function normalizeWord(word) {
  let w = word.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (!w) return '';

  // Common synonyms / variations in practical questions
  if (w.startsWith('identif') || w.startsWith('detect')) return 'detect';
  if (w.startsWith('check')) return 'check';
  if (w.startsWith('decid')) return 'decide';
  if (w.startsWith('clean')) return 'clean';
  if (w.startsWith('mov')) return 'move';
  if (w.startsWith('room')) return 'room';
  if (w.startsWith('predict')) return 'predict';
  if (w.startsWith('classif')) return 'classify';
  if (w.startsWith('regress')) return 'regression';
  if (w.startsWith('shortest') || w.startsWith('least')) return 'min';

  // Basic plural / tense suffix removal
  if (w.endsWith('ies') && w.length > 4) return w.slice(0, -3) + 'y';
  if (w.endsWith('ing') && w.length > 4) return w.slice(0, -3);
  if (w.endsWith('ed') && w.length > 4) return w.slice(0, -2);
  if (w.endsWith('s') && !w.endsWith('ss') && w.length > 3) return w.slice(0, -1);

  return w;
}

// Tokenize text into normalized keywords (ignoring stopwords)
export function extractKeywords(text) {
  if (!text) return [];
  const rawTokens = text.toLowerCase().split(/[\s,.:;?!()[\]{}"'`\-\/\\|*+=<>~#]+/);
  const keywords = [];

  for (const token of rawTokens) {
    if (!token || token.length < 2) continue;
    if (STOP_WORDS.has(token)) continue;
    const norm = normalizeWord(token);
    if (norm && !STOP_WORDS.has(norm)) {
      keywords.push(norm);
    }
  }

  return keywords;
}

// Extract code blocks from a markdown section
export function extractCodeFromSection(sectionContent) {
  const codeBlockRegex = /```(?:[a-zA-Z0-9_-]*)\r?\n([\s\S]*?)```/g;
  const blocks = [];
  let match;

  while ((match = codeBlockRegex.exec(sectionContent)) !== null) {
    const rawCode = match[1];
    if (rawCode && rawCode.trim()) {
      blocks.push(rawCode.trimEnd());
    }
  }

  // Combine multiple code blocks preserving original order
  return blocks.join('\n\n');
}

// Parse the entire Markdown into question entries
export function parseMarkdownQuestions(markdownText) {
  if (!markdownText) return [];

  const lines = markdownText.split(/\r?\n/);
  const sections = [];
  let currentHeading = '';
  let currentLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Headings starting with ##
    if (/^##\s+/.test(line)) {
      if (currentHeading) {
        sections.push({
          rawHeading: currentHeading,
          body: currentLines.join('\n'),
        });
      }
      currentHeading = line.replace(/^##\s+/, '').trim();
      currentLines = [];
    } else {
      currentLines.push(line);
    }
  }

  if (currentHeading) {
    sections.push({
      rawHeading: currentHeading,
      body: currentLines.join('\n'),
    });
  }

  const parsed = [];

  for (let idx = 0; idx < sections.length; idx++) {
    const { rawHeading, body } = sections[idx];
    const code = extractCodeFromSection(body);

    // Extract question number (e.g., Q1, Q33, Question 2)
    const qNumMatch = rawHeading.match(/(?:^|\b)(?:q|question)\s*(\d+)/i);
    const qNum = qNumMatch ? parseInt(qNumMatch[1], 10) : null;

    // Clean title without the question number prefix
    const cleanTitle = rawHeading
      .replace(/^(?:q|question)\s*\d+[\).\s:-]*/i, '')
      .trim();

    // Extract text before first code block (question description / prompt)
    const textBeforeCode = body.split('```')[0] || '';

    // Indexable metadata
    const headingKeywords = extractKeywords(cleanTitle || rawHeading);
    const bodyKeywords = extractKeywords(textBeforeCode);
    const combinedKeywords = Array.from(new Set([...headingKeywords, ...bodyKeywords]));

    parsed.push({
      id: idx + 1,
      qNum,
      rawHeading,
      cleanTitle,
      body,
      textBeforeCode: textBeforeCode.trim(),
      code,
      headingKeywords,
      combinedKeywords,
    });
  }

  return parsed;
}

// Compute bigram Dice similarity between two strings
function computeBigramDice(str1, str2) {
  const s1 = str1.toLowerCase().replace(/[^a-z0-9]/g, '');
  const s2 = str2.toLowerCase().replace(/[^a-z0-9]/g, '');

  if (!s1 || !s2) return 0;
  if (s1 === s2) return 1.0;
  if (s1.length < 2 || s2.length < 2) return 0;

  const getBigrams = (str) => {
    const bigrams = new Map();
    for (let i = 0; i < str.length - 1; i++) {
      const bg = str.slice(i, i + 2);
      bigrams.set(bg, (bigrams.get(bg) || 0) + 1);
    }
    return bigrams;
  };

  const bg1 = getBigrams(s1);
  const bg2 = getBigrams(s2);

  let intersection = 0;
  for (const [bg, count1] of bg1.entries()) {
    if (bg2.has(bg)) {
      intersection += Math.min(count1, bg2.get(bg));
    }
  }

  const total = (s1.length - 1) + (s2.length - 1);
  return (2.0 * intersection) / total;
}

// Pre-parsed question bank from AIAD_Question_Bank_Answers.md
export const parsedQuestions = parseMarkdownQuestions(rawMarkdown);

/**
 * Match a user search query against the parsed Markdown question bank.
 * Returns the best match if similarity >= threshold (default 0.80 = 80%).
 */
export function findBestMatchingCode(query, threshold = 0.80) {
  if (!query || typeof query !== 'string' || !query.trim()) {
    return { matched: false, reason: 'empty_query', code: null };
  }

  const trimmedQuery = query.trim();

  // 1. Question Number Match (e.g. "Q1", "q1", "Question 33", "Q.33", "33")
  const qNumMatch = trimmedQuery.match(/^(?:q(?:uestion)?[\s.:-]*)?(\d+)$/i);
  if (qNumMatch) {
    const targetNum = parseInt(qNumMatch[1], 10);
    const matchByNum = parsedQuestions.find((q) => q.qNum === targetNum);
    if (matchByNum && matchByNum.code) {
      return {
        matched: true,
        score: 1.0,
        section: matchByNum,
        code: matchByNum.code,
      };
    }
  }

  const queryKeywords = extractKeywords(trimmedQuery);
  if (queryKeywords.length === 0) {
    return { matched: false, reason: 'no_keywords', code: null };
  }

  let bestMatch = null;
  let highestScore = 0;

  for (const section of parsedQuestions) {
    if (!section.code) continue;

    const hKeywords = section.headingKeywords;
    let headingOverlapCount = 0;
    for (const hk of hKeywords) {
      if (queryKeywords.includes(hk)) {
        headingOverlapCount++;
      }
    }
    const headingCoverage = hKeywords.length > 0 ? headingOverlapCount / hKeywords.length : 0;

    let queryOverlapCount = 0;
    for (const qk of queryKeywords) {
      if (hKeywords.includes(qk)) {
        queryOverlapCount++;
      }
    }
    const queryCoverage = queryKeywords.length > 0 ? queryOverlapCount / queryKeywords.length : 0;

    // String Dice similarity on clean title
    const diceScore = computeBigramDice(trimmedQuery, section.cleanTitle || section.rawHeading);

    // Check substring / containment
    const normQuery = trimmedQuery.toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
    const normTitle = (section.cleanTitle || section.rawHeading).toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();

    let containmentScore = 0;
    if (normTitle && normQuery) {
      if (normTitle === normQuery) {
        containmentScore = 1.0;
      } else if (normTitle.includes(normQuery)) {
        // Query is a clean substring of title e.g. "Vacuum cleaner agent" in "Vacuum cleaner agent: two rooms..."
        containmentScore = 0.85 + (normQuery.length / normTitle.length) * 0.15;
      } else if (normQuery.includes(normTitle)) {
        // Title is a clean substring of query
        containmentScore = 0.85 + (normTitle.length / normQuery.length) * 0.15;
      }
    }

    // High coverage of query keywords in heading (e.g. "vacuum cleaner two rooms dirt")
    let keywordScore = 0;
    if (queryCoverage >= 0.80 && queryKeywords.length >= 3) {
      keywordScore = 0.80 + (queryCoverage * 0.1) + (headingCoverage * 0.1);
    } else {
      keywordScore = (headingCoverage * 0.6) + (queryCoverage * 0.4);
    }

    let totalScore = Math.max(
      keywordScore,
      diceScore,
      containmentScore,
      headingCoverage >= 0.85 ? headingCoverage : 0
    );

    // Check body text keywords if still below threshold
    if (totalScore < threshold && section.combinedKeywords.length > 0) {
      let bodyMatchCount = 0;
      for (const qk of queryKeywords) {
        if (section.combinedKeywords.includes(qk)) {
          bodyMatchCount++;
        }
      }
      const bodyCoverage = bodyMatchCount / queryKeywords.length;
      if (bodyCoverage >= 0.85) {
        totalScore = Math.max(totalScore, bodyCoverage * 0.85);
      }
    }

    totalScore = Math.min(1.0, totalScore);

    if (totalScore > highestScore) {
      highestScore = totalScore;
      bestMatch = section;
    }
  }

  if (highestScore >= threshold && bestMatch && bestMatch.code) {
    return {
      matched: true,
      score: highestScore,
      section: bestMatch,
      code: bestMatch.code,
    };
  }

  return {
    matched: false,
    score: highestScore,
    code: null,
  };
}
