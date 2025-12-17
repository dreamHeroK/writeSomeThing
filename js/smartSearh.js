const LOW_VALUE_WORDS = new Set([
    // "llc",
    // "pllc",
    // "inc",
    // "company",
    // "co",
    // "firm",
    // "law",
    // "attorneys",
    // "associates",
    // "pc",
    // "the",
    // "group",
    // "partners",
    // "llp",
    // "pa",
  ]);
  
  function tokenize(str) {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w && !LOW_VALUE_WORDS.has(w)); // 过滤低价值词
  }
  
  function calcScore(searchWords, targetWords) {
    let score = 0;
  
    for (const sw of searchWords) {
      let bestMatch = 0;
      
      for (const tw of targetWords) {
        if (sw === tw) {
          bestMatch = Math.max(bestMatch, 5); // 完全匹配
        } else if (sw.length >= 3 && tw.length >= 3) {
          // 只有当两个词都至少3个字符时才进行包含匹配，避免单字符误匹配
          if (tw.includes(sw) || sw.includes(tw)) {
            bestMatch = Math.max(bestMatch, 3); // 单词部分包含
          }
        }
      }
      
      score += bestMatch;
    }
  
    return score;
  }
  
  export function smartSearch(searchKey, list, key = "label") {
    const searchWords = tokenize(searchKey);
  
    const results = list
      .map((item) => {
        const targetWords = tokenize(item[key]);
        const score = calcScore(searchWords, targetWords);
        return {
          item,
          score,
        };
      })
      .sort((a, b) => b.score - a.score);
  
    return results;
  }
  