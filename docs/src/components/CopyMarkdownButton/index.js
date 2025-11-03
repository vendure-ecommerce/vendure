import IconCopy from '@theme/Icon/Copy';
import IconSuccess from '@theme/Icon/Success';
import React, { useState } from 'react';
import styles from './styles.module.css';

export default function CopyMarkdownButton() {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            // Try multiple selectors to find the content area
            const selectors = [
                'article[class*="docItemContainer"]',
                '.theme-doc-markdown',
                'main[class*="docMainContainer"] .theme-doc-markdown',
                'article',
                '.markdown',
                '[class*="docItemContainer"]',
            ];

            let contentElement = null;
            for (const selector of selectors) {
                contentElement = document.querySelector(selector);
                if (contentElement) {
                    break;
                }
            }

            if (contentElement) {
                // Extract content as markdown with proper formatting
                let content = extractMarkdownContent(contentElement);

                // Ensure proper spacing after H1 headers
                content = content.replace(/(# [^\n]+)/g, '$1\n');

                // Copy to clipboard using modern API
                await navigator.clipboard.writeText(content);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } else {
                alert('Could not find page content to copy.');
            }
        } catch (error) {
            alert('Failed to copy content. Please try again.');
        }
    };

    const extractMarkdownContent = element => {
        let markdown = '';

        // Process elements in DOM order
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT, {
            acceptNode: function (node) {
                const tagName = node.tagName.toLowerCase();
                if (
                    ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'ul', 'ol', 'pre', 'blockquote', 'a'].includes(
                        tagName,
                    )
                ) {
                    return NodeFilter.FILTER_ACCEPT;
                }
                return NodeFilter.FILTER_SKIP;
            },
        });

        let currentNode;
        while ((currentNode = walker.nextNode())) {
            const tagName = currentNode.tagName.toLowerCase();
            const textContent = currentNode.textContent.trim();

            switch (tagName) {
                case 'h1':
                    markdown += `\n# ${textContent}\n\n`;
                    break;
                case 'h2':
                    markdown += `\n## ${textContent}\n\n`;
                    break;
                case 'h3':
                    markdown += `\n### ${textContent}\n\n`;
                    break;
                case 'h4':
                    markdown += `\n#### ${textContent}\n\n`;
                    break;
                case 'h5':
                    markdown += `\n##### ${textContent}\n\n`;
                    break;
                case 'h6':
                    markdown += `\n###### ${textContent}\n\n`;
                    break;
                case 'p':
                    if (textContent) {
                        markdown += `${textContent}\n\n`;
                    }
                    break;
                case 'ul':
                case 'ol':
                    markdown += processList(currentNode);
                    break;
                case 'pre':
                    const codeElement = currentNode.querySelector('code');
                    const codeText = codeElement ? codeElement.textContent : textContent;
                    const language = getCodeLanguage(codeElement);
                    markdown += `\n\`\`\`${language}\n${codeText}\n\`\`\`\n\n`;
                    break;
                case 'blockquote':
                    markdown += `> ${textContent}\n\n`;
                    break;
                case 'a':
                    const href = currentNode.getAttribute('href');
                    const linkText = textContent;
                    if (href && linkText) {
                        markdown += `[${linkText}](${href})`;
                    } else if (linkText) {
                        markdown += linkText;
                    }
                    break;
            }
        }

        return markdown.replace(/\n{3,}/g, '\n\n').trim();
    };

    const processList = listElement => {
        let result = '';
        const items = listElement.querySelectorAll('li');
        items.forEach(item => {
            result += `- ${item.textContent.trim()}\n`;
        });
        return result + '\n';
    };

    const processTable = tableElement => {
        let result = '';
        const rows = tableElement.querySelectorAll('tr');

        rows.forEach((row, index) => {
            if (index === 1) {
                // Add separator row after header
                const cells = row.querySelectorAll('th, td');
                result += '|';
                cells.forEach(() => {
                    result += ' --- |';
                });
                result += '\n';
            }
            result += processTableRow(row);
        });

        return result + '\n';
    };

    const processTableRow = rowElement => {
        let result = '|';
        const cells = rowElement.querySelectorAll('th, td');
        cells.forEach(cell => {
            result += ` ${cell.textContent.trim()} |`;
        });
        return result + '\n';
    };

    const getCodeLanguage = codeElement => {
        if (!codeElement) return '';
        const className = codeElement.className || '';
        const match = className.match(/language-(\w+)/);
        return match ? match[1] : '';
    };

    return (
        <button className={styles.copyButton} onClick={handleCopy} title="Copy page content as markdown">
            {copied ? (
                <>
                    <IconSuccess className={styles.icon} />
                    <span className={styles.tooltip}>Copied!</span>
                </>
            ) : (
                <>
                    <IconCopy className={styles.icon} />
                    <span className={styles.tooltip}>Copy as MD</span>
                </>
            )}
        </button>
    );
}
