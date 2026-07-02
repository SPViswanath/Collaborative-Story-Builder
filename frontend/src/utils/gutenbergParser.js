export function parseGutenbergToChapters(rawText) {
  if (!rawText) return [];

  // Match lines that look like a chapter heading
  // Common patterns: "CHAPTER I", "Chapter 1", "BOOK I", "Part 1"
  // It must be at the start of a line, possibly with some whitespace.
  const chapterRegex = /^\s*(?:CHAPTER|Chapter|BOOK|Book|PART|Part)\s+[IVXLCDM0-9]+[\.\:]?\s*$/gm;

  // Find all matches
  let matches = [...rawText.matchAll(chapterRegex)];

  // Group matches into clusters to identify and remove the Table of Contents.
  // TOC entries are typically very close to each other.
  if (matches.length > 0) {
    const clusters = [];
    let currentCluster = [matches[0]];

    for (let i = 1; i < matches.length; i++) {
      const prevMatch = matches[i - 1];
      const currMatch = matches[i];
      // If the distance between headings is less than 300 characters, they belong to the same cluster
      if (currMatch.index - prevMatch.index < 300) {
        currentCluster.push(currMatch);
      } else {
        clusters.push(currentCluster);
        currentCluster = [currMatch];
      }
    }
    clusters.push(currentCluster);

    // Filter out clusters that look like a Table of Contents
    // A cluster is a TOC if it has many consecutive headings (e.g., > 3)
    matches = [];
    for (const cluster of clusters) {
      if (cluster.length <= 3) {
        matches.push(...cluster);
      }
    }
  }

  // If we couldn't find chapter markers, just return it as a single chunk
  if (matches.length === 0) {
    return [{
      _id: 'ext-single',
      title: 'Full Text',
      content: rawText
    }];
  }

  const chapters = [];

  // Extract everything before the first chapter (Prologue / Frontmatter / License)
  const firstMatchIndex = matches[0].index;
  if (firstMatchIndex > 0) {
    const frontmatter = rawText.slice(0, firstMatchIndex).trim();
    if (frontmatter.length > 50) { // Only if there's substantial text
      chapters.push({
        _id: 'ext-frontmatter',
        title: 'Frontmatter',
        content: frontmatter
      });
    }
  }

  // Iterate over matches and slice out the content
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const title = match[0].trim();
    const startIndex = match.index;
    
    // The content goes from the start of this chapter to the start of the next chapter (or end of string)
    const endIndex = (i + 1 < matches.length) ? matches[i + 1].index : rawText.length;
    
    // We strip the title from the content to avoid repeating it as plain text if we render the title as an H2
    // But Gutenberg text relies on formatting, so keeping it is usually safer. We'll just keep it.
    const content = rawText.slice(startIndex, endIndex).trim();

    chapters.push({
      _id: `ext-chap-${i}`,
      title: title,
      content: content
    });
  }

  return chapters;
}
