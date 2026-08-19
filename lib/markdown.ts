import { marked } from "marked";
import hljs from "highlight.js";

const renderer = new marked.Renderer();

renderer.code = ({ text, lang }: { text: string; lang?: string }) => {
  const language = lang && hljs.getLanguage(lang) ? lang : undefined;
  const highlighted = language
    ? hljs.highlight(text, { language }).value
    : hljs.highlightAuto(text).value;
  const languageClass = language ? ` language-${language}` : "";
  return `<pre><code class="hljs${languageClass}">${highlighted}</code></pre>`;
};

marked.use({ gfm: true, breaks: false, renderer });

/**
 * Content is authored locally by the user (or a Claude Code skill acting on
 * their behalf), never submitted by a third party, so passing the resulting
 * HTML through unsanitized is safe here — that's also what makes the
 * diagram-* raw-HTML blocks in lesson markdown work.
 */
export function renderMarkdown(markdown: string): string {
  return marked.parse(markdown, { async: false }) as string;
}
