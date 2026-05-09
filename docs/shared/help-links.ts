const HELP_MARKER = 'rin-help';
const HELP_MDX_MARKER = `/* ${HELP_MARKER} */`;

const HELP_LINKS = {
  issues: 'https://github.com/openRin/Rin/issues',
  discord: 'https://discord.gg/JWbSTHvAPN',
  discussions: 'https://github.com/openRin/Rin/discussions',
} as const;

const HELP_COPY = {
  en: {
    title: 'Need Help?',
  },
  zh: {
    title: '需要帮助？',
  },
} as const;

type Locale = keyof typeof HELP_COPY;

type MarkdownNode = {
  type: string;
  value?: string;
  depth?: number;
  ordered?: boolean;
  children?: MarkdownNode[];
  [key: string]: unknown;
};

type MarkdownFile = {
  path?: string;
  history?: string[];
};

function getLocale(file: MarkdownFile): Locale {
  const filepath = file.path ?? file.history?.[0] ?? '';

  return /[\\/]en[\\/]/.test(filepath) ? 'en' : 'zh';
}

function text(value: string): MarkdownNode {
  return { type: 'text', value };
}

function link(url: string, children: MarkdownNode[]): MarkdownNode {
  return { type: 'link', url, children };
}

function listItem(children: MarkdownNode[]): MarkdownNode {
  return {
    type: 'listItem',
    children: [{ type: 'paragraph', children }],
  };
}

function createHelpSection(locale: Locale): MarkdownNode[] {
  const copy = HELP_COPY[locale];

  return [
    {
      type: 'heading',
      depth: 2,
      children: [text(copy.title)],
    },
    {
      type: 'list',
      ordered: false,
      children: [
        listItem([text('🐛 '), link(HELP_LINKS.issues, [text('GitHub Issues')])]),
        listItem([text('💬 '), link(HELP_LINKS.discord, [text('Discord')])]),
        listItem([text('🗣️ '), link(HELP_LINKS.discussions, [text('GitHub Discussions')])]),
      ],
    },
  ];
}

function getPlainText(node: MarkdownNode): string {
  if (node.value) {
    return node.value;
  }

  return node.children?.map(getPlainText).join('') ?? '';
}

function isHelpMarker(node: MarkdownNode): boolean {
  const value = node.value?.trim();

  if (node.type === 'html') {
    return value === `<!-- ${HELP_MARKER} -->`;
  }

  if (node.type === 'mdxFlowExpression' || node.type === 'mdxTextExpression') {
    return value === HELP_MDX_MARKER;
  }

  if (node.type === 'paragraph') {
    const paragraphText = node.children
      ?.map((child) => child.value ?? '')
      .join('')
      .trim();

    return paragraphText === `{${HELP_MDX_MARKER}}`;
  }

  return false;
}

function isHomePage(tree: MarkdownNode): boolean {
  const frontmatter = tree.children?.find((child) => child.type === 'yaml');

  return /^pageType:\s*home$/m.test(frontmatter?.value ?? '');
}

function removeHelpMarkers(node: MarkdownNode): void {
  if (!node.children) {
    return;
  }

  const nextChildren: MarkdownNode[] = [];

  for (const child of node.children) {
    if (!isHelpMarker(child)) {
      removeHelpMarkers(child);
      nextChildren.push(child);
    }
  }

  node.children = nextChildren;
}

function getHelpInsertIndex(children: MarkdownNode[]): number {
  const last = children[children.length - 1];
  const beforeLast = children[children.length - 2];
  const lastText = getPlainText(last ?? { type: 'text' }).trim();

  if (
    last?.type === 'paragraph' &&
    /^\*?(Last updated|最后更新|最後更新)/.test(lastText) &&
    beforeLast?.type === 'thematicBreak'
  ) {
    return children.length - 2;
  }

  return children.length;
}

export function remarkRinHelpLinks() {
  return (tree: MarkdownNode, file: MarkdownFile) => {
    removeHelpMarkers(tree);

    if (isHomePage(tree)) {
      return;
    }

    const children = tree.children ?? [];
    const insertIndex = getHelpInsertIndex(children);

    children.splice(insertIndex, 0, { type: 'thematicBreak' }, ...createHelpSection(getLocale(file)));
    tree.children = children;
  };
}
