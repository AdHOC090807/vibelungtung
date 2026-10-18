/**
 * PDF Parser for FlashLearn
 * Utilizes PDF.js to extract text and parse vocabulary cards
 */

// Configure PDF.js worker
if (typeof pdfjsLib !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

const PDFParser = {
  /**
   * Reads an ArrayBuffer or File and extracts text from all pages
   */
  async extractTextFromPDF(file, onProgress) {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdfDoc = await loadingTask.promise;
    const numPages = pdfDoc.numPages;
    let fullText = '';

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      if (onProgress) {
        onProgress(pageNum, numPages);
      }
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Combine text items with line breaks based on coordinate changes or spacing
      let lastY;
      let pageText = '';
      for (const item of textContent.items) {
        if (lastY !== undefined && Math.abs(item.transform[5] - lastY) > 5) {
          pageText += '\n';
        } else if (pageText.length > 0 && !pageText.endsWith(' ') && !pageText.endsWith('\n')) {
          pageText += ' ';
        }
        pageText += item.str;
        lastY = item.transform[5];
      }
      fullText += pageText + '\n';
    }

    return fullText;
  },

  /**
   * Intelligently parses raw text into vocabulary objects
   */
  parseVocabularyText(rawText) {
    const lines = rawText.split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0);

    const cards = [];

    // Pattern 1: Delimited with pipe `word | ipa | meaning | example`
    // Pattern 2: `Word (pos) : meaning` or `Word: meaning` or `Word - meaning`
    // Pattern 3: `1. Word - meaning` or `1/ Word: meaning`
    // Pattern 4: Tab or multiple spaces separated

    const delimiterRegex = /[\t|]/;
    const colonHyphenRegex = /^(\d+[\.\/\)]\s*)?([a-zA-Z\s\-'\(\)]+?)(?:\s*[\/\[](.+?)[\/\]])?\s*[:\-–—]\s*(.+)$/;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Skip common PDF headers/footers
      if (/^(page\s*\d+|trang\s*\d+|\d+\s*\/\s*\d+)$/i.test(line)) continue;
      if (line.length < 3) continue;

      // Check pipe or tab format
      if (line.includes('|')) {
        const parts = line.split('|').map(p => p.trim());
        if (parts.length >= 2 && parts[0].length > 0 && parts[1].length > 0) {
          cards.push({
            word: parts[0],
            phonetic: parts.length > 2 && parts[1].startsWith('/') ? parts[1] : '',
            pos: '',
            meaning: parts.length > 2 && !parts[1].startsWith('/') ? parts[1] : (parts.length > 2 ? parts[2] : parts[1]),
            example: parts.length >= 4 ? parts[3] : '',
            exampleMeaning: parts.length >= 5 ? parts[4] : ''
          });
          continue;
        }
      }

      // Check colon or hyphen: "Resilient: kiên cường" or "1. Abandon /əˈbændən/ - từ bỏ"
      const match = line.match(colonHyphenRegex);
      if (match) {
        let rawWord = match[2].trim();
        let phonetic = match[3] ? `/${match[3].trim()}/` : '';
        let meaning = match[4].trim();
        let pos = '';

        // Extract part of speech like (v), (n), (adj)
        const posMatch = rawWord.match(/\((n|v|adj|adv|prep|conj|pron|phr)\.?\)/i);
        if (posMatch) {
          pos = posMatch[1].toLowerCase();
          rawWord = rawWord.replace(/\((n|v|adj|adv|prep|conj|pron|phr)\.?\)/i, '').trim();
        }

        if (rawWord && meaning) {
          cards.push({
            word: rawWord,
            phonetic: phonetic,
            pos: pos,
            meaning: meaning,
            example: '',
            exampleMeaning: ''
          });
          continue;
        }
      }

      // Check adjacent lines: Line 1 = English word, Line 2 = Vietnamese meaning
      if (i + 1 < lines.length) {
        const wordCandidate = line;
        const nextLine = lines[i + 1];

        // If line is 1-3 English words and next line is Vietnamese/explanation
        const isEnglishish = /^[a-zA-Z\s\-'\,\(\)\/]+$/.test(wordCandidate);
        const hasVietnameseOrMeaning = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(nextLine) || nextLine.length > wordCandidate.length;

        if (isEnglishish && wordCandidate.length <= 40 && hasVietnameseOrMeaning && !nextLine.includes(':')) {
          cards.push({
            word: wordCandidate,
            phonetic: '',
            pos: '',
            meaning: nextLine,
            example: '',
            exampleMeaning: ''
          });
          i++; // skip next line as it was consumed as meaning
        }
      }
    }

    return cards;
  }
};
