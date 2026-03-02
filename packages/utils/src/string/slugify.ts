/**
 * Convert text to URL-safe slug
 *
 * @param text - Text to slugify
 * @returns URL-safe slug
 */
export function slugify(text: string): string {
  return (
    text
      // Convert to lowercase
      .toLowerCase()
      // Replace Chinese characters with pinyin-like representation (keep as-is for simplicity)
      // Replace spaces and special chars with hyphens
      .replace(/[\s_]+/g, '-')
      // Remove characters that aren't alphanumeric, hyphens, or common CJK
      .replace(/[^\w\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff-]/g, '')
      // Replace multiple consecutive hyphens with single hyphen
      .replace(/-+/g, '-')
      // Remove leading/trailing hyphens
      .replace(/^-+|-+$/g, '')
  )
}

/**
 * Generate unique slug with counter suffix for duplicates
 *
 * @param text - Text to slugify
 * @param existingSlugs - Set of existing slugs to check against
 * @returns Unique slug
 */
export function uniqueSlugify(text: string, existingSlugs: Set<string>): string {
  const baseSlug = slugify(text)
  let slug = baseSlug
  let counter = 1

  while (existingSlugs.has(slug)) {
    slug = `${baseSlug}-${counter}`
    counter++
  }

  existingSlugs.add(slug)
  return slug
}
