import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { List, ListItem } from '../../src/components/defaults/List'
import type { List as ListNode, ListItem as ListItemNode } from 'mdast'

describe('List component', () => {
  it('should render unordered list', () => {
    const node: ListNode = {
      type: 'list',
      ordered: false,
      children: [],
    }

    const { container } = render(<List node={node}>Items</List>)
    expect(container.querySelector('ul')).toBeInTheDocument()
  })

  it('should render ordered list', () => {
    const node: ListNode = {
      type: 'list',
      ordered: true,
      children: [],
    }

    const { container } = render(<List node={node}>Items</List>)
    expect(container.querySelector('ol')).toBeInTheDocument()
  })

  it('should add start attribute for custom start', () => {
    const node: ListNode = {
      type: 'list',
      ordered: true,
      start: 5,
      children: [],
    }

    const { container } = render(<List node={node}>Items</List>)
    expect(container.querySelector('ol')).toHaveAttribute('start', '5')
  })

  it('should not add start attribute for default start', () => {
    const node: ListNode = {
      type: 'list',
      ordered: true,
      start: 1,
      children: [],
    }

    const { container } = render(<List node={node}>Items</List>)
    expect(container.querySelector('ol')).not.toHaveAttribute('start')
  })
})

describe('ListItem component', () => {
  it('should render basic list item', () => {
    const node: ListItemNode = {
      type: 'listItem',
      children: [],
    }

    render(<ListItem node={node}>Content</ListItem>)
    expect(screen.getByRole('listitem')).toHaveTextContent('Content')
  })

  it('should render checked task item', () => {
    const node: ListItemNode = {
      type: 'listItem',
      checked: true,
      children: [],
    }

    render(<ListItem node={node}>Done</ListItem>)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeChecked()
  })

  it('should render unchecked task item', () => {
    const node: ListItemNode = {
      type: 'listItem',
      checked: false,
      children: [],
    }

    render(<ListItem node={node}>Todo</ListItem>)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()
  })

  it('should have readonly checkbox', () => {
    const node: ListItemNode = {
      type: 'listItem',
      checked: false,
      children: [],
    }

    render(<ListItem node={node}>Todo</ListItem>)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveAttribute('readonly')
  })
})
