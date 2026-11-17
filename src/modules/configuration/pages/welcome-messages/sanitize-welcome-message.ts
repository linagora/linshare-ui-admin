import DOMPurify from 'dompurify';

const WELCOME_MESSAGE_ALLOWED_TAGS = [
  'a',
  'b',
  'blockquote',
  'br',
  'div',
  'em',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'i',
  'li',
  'ol',
  'p',
  'span',
  'strong',
  'u',
  'ul',
];

export default function sanitizeWelcomeMessage(content: string): string {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: WELCOME_MESSAGE_ALLOWED_TAGS,
    ALLOWED_ATTR: ['href', 'title'],
    ALLOW_DATA_ATTR: false,
  });
}
