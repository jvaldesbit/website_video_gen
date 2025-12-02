export function formatMessageText(text: string): string {
    if (!text) return '';

    // 1. Escape HTML to prevent XSS (basic)
    let formatted = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    // 2. Monospace: ```text```
    formatted = formatted.replace(/```(.*?)```/gs, '<code class="font-mono bg-black/10 px-1 rounded text-sm">$1</code>');

    // 3. Headers: ### text
    formatted = formatted.replace(/### (.*?)(?:\n|$)/g, '<strong class="text-base block mb-1">$1</strong>');

    // 4. Bold: **text** or *text*
    // We handle ** first to avoid conflict with *
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/\*(.*?)\*/g, '<strong>$1</strong>');

    // 5. Italic: _text_
    formatted = formatted.replace(/_(.*?)_/g, '<em>$1</em>');

    // 6. Strikethrough: ~text~
    formatted = formatted.replace(/~(.*?)~/g, '<del>$1</del>');

    // 6. Links: https://example.com
    // Simple regex for URLs
    formatted = formatted.replace(
        /(https?:\/\/[^\s]+)/g,
        '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">$1</a>'
    );

    return formatted;
}
