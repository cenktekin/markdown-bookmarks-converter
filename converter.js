/**
 * Markdown -> Netscape bookmarks dönüştürücüsü.
 * Tarayıcıda `window.MarkdownBookmarks`, Node'da `module.exports` olarak kullanılabilir.
 */
(function (root) {
    const HEADING_PATTERN = /^(#{1,6})\s+(.+)$/;
    const LIST_LINK_PATTERN = /^\s*[-*+]\s*\[([^\]]*)\]\(([^)]+)\)/;

    function escapeHtml(value) {
        return String(value == null ? '' : value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function parseSections(readmeContent) {
        const sections = [];
        let currentSection = null;
        let inCodeBlock = false;

        for (const rawLine of String(readmeContent || '').split(/\r?\n/)) {
            const line = rawLine.trim();

            if (line.startsWith('```')) {
                inCodeBlock = !inCodeBlock;
                continue;
            }
            if (inCodeBlock) {
                continue;
            }

            const heading = line.match(HEADING_PATTERN);
            if (heading) {
                currentSection = {
                    level: heading[1].length,
                    title: heading[2].trim(),
                    lines: []
                };
                sections.push(currentSection);
                continue;
            }

            if (currentSection) {
                currentSection.lines.push(line);
            }
        }

        return sections;
    }

    function extractLinks(lines) {
        const links = [];

        for (const line of lines) {
            const listMatch = line.match(LIST_LINK_PATTERN);
            if (listMatch) {
                const title = listMatch[1].trim();
                const url = listMatch[2].trim();
                if (title && url) {
                    links.push([title, url]);
                }
                continue;
            }

            if (/^https?:\/\//.test(line)) {
                links.push([line.replace(/^https?:\/\//, '').split('/')[0], line]);
            }
        }

        return links;
    }

    function processReadmeToBookmarks(readmeContent, title, rootCategory) {
        const safeTitle = escapeHtml(title);
        const safeRootCategory = escapeHtml(rootCategory);
        const timestamp = Math.floor(Date.now() / 1000);

        const htmlLines = [
            '<!DOCTYPE NETSCAPE-Bookmark-file-1>',
            '<!-- This is an automatically generated file.',
            '     It will be read and overwritten.',
            '     DO NOT EDIT! -->',
            '<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">',
            `<TITLE>${safeTitle}</TITLE>`,
            `<H1>${safeTitle}</H1>`,
            '<DL><p>',
            `    <DT><H3 ADD_DATE="${timestamp}" LAST_MODIFIED="${timestamp}" PERSONAL_TOOLBAR_FOLDER="true">${safeRootCategory}</H3>`,
            '    <DL><p>'
        ];

        const openLevels = [];

        for (const section of parseSections(readmeContent)) {
            const links = extractLinks(section.lines);

            while (openLevels.length > 0 && openLevels[openLevels.length - 1] >= section.level) {
                htmlLines.push('    </DL><p>');
                openLevels.pop();
            }

            if (links.length === 0) {
                continue;
            }

            htmlLines.push(`        <DT><H3 ADD_DATE="${timestamp}" LAST_MODIFIED="${timestamp}">${escapeHtml(section.title)}</H3>`);
            htmlLines.push('        <DL><p>');
            openLevels.push(section.level);

            for (const [linkTitle, linkUrl] of links) {
                htmlLines.push(
                    `            <DT><A HREF="${escapeHtml(linkUrl)}" ADD_DATE="${timestamp}" LAST_MODIFIED="${timestamp}">${escapeHtml(linkTitle)}</A>`
                );
            }
        }

        while (openLevels.length > 0) {
            htmlLines.push('    </DL><p>');
            openLevels.pop();
        }

        htmlLines.push('</DL><p>');
        htmlLines.push('</DL><p>');

        return htmlLines.join('\n');
    }

    const api = { escapeHtml, parseSections, extractLinks, processReadmeToBookmarks };

    root.MarkdownBookmarks = api;

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = api;
    }
})(typeof window !== 'undefined' ? window : globalThis);
