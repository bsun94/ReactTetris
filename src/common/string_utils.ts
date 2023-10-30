/** Wraps a given name with a prefix, to be assigned to HTML elements. This helps each component track HTML elements native to it. */
export function wrapCssClassNameWithPrefix(className: string, prefix: string): string {
    return `${prefix}-${className}`;
}