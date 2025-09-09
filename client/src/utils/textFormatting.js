import React from 'react';

// Parse text with basic markdown-like formatting
export const parseFormattedText = (text) => {
  if (!text) return text;

  // Split text by newlines to handle line breaks
  const lines = text.split('\n');
  
  return lines.map((line, lineIndex) => {
    // Skip empty lines
    if (!line.trim()) {
      return <br key={lineIndex} />;
    }

    // Parse inline formatting
    const formattedLine = parseInlineFormatting(line, lineIndex);
    
    // Add line break if not the last line
    return lineIndex < lines.length - 1 ? (
      <React.Fragment key={lineIndex}>
        {formattedLine}
        <br />
      </React.Fragment>
    ) : formattedLine;
  });
};

// Parse inline formatting (bold, italic, code, etc.)
const parseInlineFormatting = (text, key) => {
  const parts = [];
  let lastIndex = 0;
  let partKey = 0;

  // Regex patterns for different formatting
  const patterns = [
    { regex: /\*\*(.*?)\*\*/g, type: 'bold' },
    { regex: /\*(.*?)\*/g, type: 'italic' },
    { regex: /`(.*?)`/g, type: 'code' },
    { regex: /~~(.*?)~~/g, type: 'strikethrough' },
    { regex: /__(.*?)__/g, type: 'underline' },
    { regex: /```([\s\S]*?)```/g, type: 'codeblock' }
  ];

  // Find all matches
  const matches = [];
  patterns.forEach(({ regex, type }) => {
    let match;
    while ((match = regex.exec(text)) !== null) {
      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        content: match[1],
        type,
        fullMatch: match[0]
      });
    }
  });

  // Sort matches by start position
  matches.sort((a, b) => a.start - b.start);

  // Remove overlapping matches (keep the first one)
  const filteredMatches = [];
  let lastEnd = 0;
  matches.forEach(match => {
    if (match.start >= lastEnd) {
      filteredMatches.push(match);
      lastEnd = match.end;
    }
  });

  // Build the result
  filteredMatches.forEach(match => {
    // Add text before the match
    if (match.start > lastIndex) {
      parts.push(text.slice(lastIndex, match.start));
    }

    // Add the formatted content
    parts.push(createFormattedElement(match.content, match.type, `${key}-${partKey++}`));

    lastIndex = match.end;
  });

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
};

// Create formatted React element
const createFormattedElement = (content, type, key) => {
  const props = { key };

  switch (type) {
    case 'bold':
      return <strong {...props}>{content}</strong>;
    case 'italic':
      return <em {...props}>{content}</em>;
    case 'code':
      return <code className="inline-code" {...props}>{content}</code>;
    case 'strikethrough':
      return <del {...props}>{content}</del>;
    case 'underline':
      return <u {...props}>{content}</u>;
    case 'codeblock':
      return (
        <pre className="code-block" {...props}>
          <code>{content}</code>
        </pre>
      );
    default:
      return content;
  }
};

// Formatting toolbar actions
export const formattingActions = [
  {
    id: 'bold',
    label: 'Bold',
    symbol: 'B',
    markdown: '**text**',
    description: 'Make text bold'
  },
  {
    id: 'italic',
    label: 'Italic',
    symbol: 'I',
    markdown: '*text*',
    description: 'Make text italic'
  },
  {
    id: 'code',
    label: 'Code',
    symbol: '</>',
    markdown: '`code`',
    description: 'Inline code'
  },
  {
    id: 'strikethrough',
    label: 'Strikethrough',
    symbol: 'S',
    markdown: '~~text~~',
    description: 'Strike through text'
  },
  {
    id: 'underline',
    label: 'Underline',
    symbol: 'U',
    markdown: '__text__',
    description: 'Underline text'
  }
];

// Apply formatting to selected text
export const applyFormatting = (text, selectionStart, selectionEnd, formatType) => {
  const selectedText = text.slice(selectionStart, selectionEnd);
  const action = formattingActions.find(a => a.id === formatType);
  
  if (!action || !selectedText) return text;

  const before = text.slice(0, selectionStart);
  const after = text.slice(selectionEnd);
  
  // Remove existing formatting if present
  const cleanText = selectedText.replace(/\*\*|\*|`|~~|__/g, '');
  
  let formattedText;
  switch (formatType) {
    case 'bold':
      formattedText = `**${cleanText}**`;
      break;
    case 'italic':
      formattedText = `*${cleanText}*`;
      break;
    case 'code':
      formattedText = `\`${cleanText}\``;
      break;
    case 'strikethrough':
      formattedText = `~~${cleanText}~~`;
      break;
    case 'underline':
      formattedText = `__${cleanText}__`;
      break;
    default:
      formattedText = selectedText;
  }

  return before + formattedText + after;
};
