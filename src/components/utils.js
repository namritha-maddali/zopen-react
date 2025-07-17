export function escapeHTML(str) {
  return str.replace(/[&<>"']/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }[tag]));
}

export function parseFormattedText(content) {
  if (!content || typeof content !== 'string') {
    return '';
  }

  const lines = content.split('\n');
  let html = '';
  let insideList = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('* ')) {
      // Handle list items
      if (!insideList) {
        html += '<ul>';
        insideList = true;
      }
      html += `<li>${escapeHTML(trimmed.substring(2))}</li>`;
    } else {
      // Handle non-list content
      if (insideList) {
        html += '</ul>';
        insideList = false;
      }

      if (trimmed) {
        html += `<p>${escapeHTML(trimmed)}</p>`;
      }
    }
  }

  if (insideList) {
    html += '</ul>';
  }

  return html;
}

export function parseAdvancedText(content) {
  if (!content || typeof content !== 'string') {
    return '';
  }

  let html = parseFormattedText(content);
  html = html
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text **text**
    .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic text *text*
    .replace(/`(.*?)`/g, '<code>$1</code>') // Code blocks `code`
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'); // Links [text](url)
  return html;
}