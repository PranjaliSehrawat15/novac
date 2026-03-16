function tryParseJson(rawText) {
  if (!rawText || typeof rawText !== 'string') return null;

  try {
    return JSON.parse(rawText);
  } catch (error) {
    const match = rawText.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch (nestedError) {
      return null;
    }
  }
}

module.exports = { tryParseJson };
