import { useEditLink } from '@rspress/core/theme-original';

function normalizeEditLinkText(text: string) {
  return text.replace(/^📝\s*/, '');
}

export function OutlineEditLink() {
  const editLink = useEditLink();

  if (!editLink) {
    return null;
  }

  return (
    <a
      className="rin-outline-edit-link"
      href={editLink.link}
      target="_blank"
      rel="noreferrer"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M3.333 12.667h2.121l7.213-7.213a1.5 1.5 0 0 0-2.121-2.121L3.333 10.546v2.121Z"
          stroke="currentColor"
          strokeWidth="1.333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="m9.667 4.333 2 2"
          stroke="currentColor"
          strokeWidth="1.333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>{normalizeEditLinkText(editLink.text)}</span>
    </a>
  );
}
