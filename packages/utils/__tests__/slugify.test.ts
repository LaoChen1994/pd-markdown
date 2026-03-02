import { describe, it, expect } from 'vitest'
import { slugify, uniqueSlugify } from '../src/string/slugify'

describe('slugify', () => {
  it('should convert text to lowercase', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })

  it('should replace spaces with hyphens', () => {
    expect(slugify('hello world')).toBe('hello-world')
  })

  it('should replace underscores with hyphens', () => {
    expect(slugify('hello_world')).toBe('hello-world')
  })

  it('should remove special characters', () => {
    expect(slugify('Hello! World?')).toBe('hello-world')
  })

  it('should handle multiple consecutive spaces', () => {
    expect(slugify('hello   world')).toBe('hello-world')
  })

  it('should remove leading and trailing hyphens', () => {
    expect(slugify('  hello world  ')).toBe('hello-world')
  })

  it('should preserve Chinese characters', () => {
    expect(slugify('你好世界')).toBe('你好世界')
  })

  it('should handle mixed Chinese and English', () => {
    expect(slugify('Hello 你好 World')).toBe('hello-你好-world')
  })

  it('should handle Japanese characters', () => {
    expect(slugify('こんにちは')).toBe('こんにちは')
  })

  it('should return empty string for only special characters', () => {
    expect(slugify('!@#$%')).toBe('')
  })

  it('should handle numbers', () => {
    expect(slugify('Chapter 1')).toBe('chapter-1')
  })
})

describe('uniqueSlugify', () => {
  it('should return base slug when no duplicates', () => {
    const existing = new Set<string>()
    expect(uniqueSlugify('Hello World', existing)).toBe('hello-world')
  })

  it('should add counter for duplicates', () => {
    const existing = new Set(['hello-world'])
    expect(uniqueSlugify('Hello World', existing)).toBe('hello-world-1')
  })

  it('should increment counter for multiple duplicates', () => {
    const existing = new Set(['hello-world', 'hello-world-1', 'hello-world-2'])
    expect(uniqueSlugify('Hello World', existing)).toBe('hello-world-3')
  })

  it('should add generated slug to existing set', () => {
    const existing = new Set<string>()
    uniqueSlugify('Hello World', existing)
    expect(existing.has('hello-world')).toBe(true)
  })
})
