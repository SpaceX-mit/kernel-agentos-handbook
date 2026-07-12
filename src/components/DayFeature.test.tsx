import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DayFeature } from './DayFeature'
import type { DaySpread, IssueRecord } from '../content/issues'

const spread: DaySpread = {
  type: 'day',
  kicker: 'THE DAY · 一日',
  title: 'One Day.',
  titleJp: '街の一日。',
  deck: 'Nine moments an agent handled; you decide whether to look.',
  byline: 'BY THE EDITORS · KERNEL.CHAT',
  signoff: 'Mark the moments where you insist on being there.',
  moments: [
    {
      id: 'd1',
      time: '06:10',
      label: 'THE MORNING BRIEF',
      vignette: 'kettle',
      situation: 'The agent kept six items of 214.',
      ride: 'You start the day ahead; the cousin surfaces in three days.',
      stepIn: 'You find the invitation; the coffee goes lukewarm.',
      cost: '+7 MIN',
    },
    {
      id: 'd2',
      time: '07:42',
      label: 'THE REROUTE',
      vignette: 'train',
      situation: 'A reroute was accepted before the announcement finished.',
      ride: 'A seat and nine quiet minutes.',
      stepIn: 'You gamble on the express and lose fourteen.',
      cost: '+3 MIN',
    },
  ],
  ledgerNote: 'The ledger counts your marks, changes, and the clock — session-only, unrecorded.',
}

const issue: IssueRecord = {
  number: '418',
  month: 'JUL',
  year: '2026',
  feature: 'ONE DAY',
  featureJp: '街の一日',
  price: '¥0 · BYOK',
  tagline: 'MAGAZINE FOR CITY CODERS · 街のコーダーのために',
  headline: { prefix: 'One', emphasis: 'Day', suffix: '.', swash: '' },
  contents: [],
  accent: 'cobalt',
  spread,
}

describe('DayFeature', () => {
  it('loads calm: both consequences printed, all moments unmarked', () => {
    render(<DayFeature spread={spread} issue={issue} />)
    // Rule 4 — both authored consequences are on the page before any touch.
    expect(screen.getByText(/the cousin surfaces in three days/i)).toBeInTheDocument()
    expect(screen.getByText(/the coffee goes lukewarm/i)).toBeInTheDocument()
    expect(screen.getByText('0 LET RIDE')).toBeInTheDocument()
    expect(screen.getByText('0 STEPPED IN')).toBeInTheDocument()
    expect(screen.getByText('2 UNMARKED')).toBeInTheDocument()
    expect(screen.getAllByText('UNMARKED')).toHaveLength(2)
  })

  it('marking selects a branch without hiding the other (the rule-4 law)', () => {
    render(<DayFeature spread={spread} issue={issue} />)
    const rideButtons = screen.getAllByRole('radio', { name: /let it ride/i })
    fireEvent.click(rideButtons[0])
    expect(rideButtons[0]).toHaveAttribute('aria-checked', 'true')
    // The unchosen consequence is STILL in the document and legible.
    expect(screen.getByText(/the coffee goes lukewarm/i)).toBeInTheDocument()
    expect(screen.getByText('1 LET RIDE')).toBeInTheDocument()
    expect(screen.getByText('1 UNMARKED')).toBeInTheDocument()
  })

  it('counts a change of mind when a mark is reversed, not when repeated', () => {
    render(<DayFeature spread={spread} issue={issue} />)
    const rideButtons = screen.getAllByRole('radio', { name: /let it ride/i })
    const stepButtons = screen.getAllByRole('radio', { name: /step in/i })

    fireEvent.click(rideButtons[0])
    expect(screen.getByText('0 CHANGES OF MIND')).toBeInTheDocument()

    // Repeating the same mark is not a change.
    fireEvent.click(rideButtons[0])
    expect(screen.getByText('0 CHANGES OF MIND')).toBeInTheDocument()

    // Reversing it is.
    fireEvent.click(stepButtons[0])
    expect(screen.getByText('1 CHANGE OF MIND')).toBeInTheDocument()
    expect(screen.getByText('1 STEPPED IN')).toBeInTheDocument()
    expect(screen.getByText('0 LET RIDE')).toBeInTheDocument()
  })

  it('keeps the honesty note on the surface', () => {
    render(<DayFeature spread={spread} issue={issue} />)
    expect(screen.getByText(/session-only, unrecorded/i)).toBeInTheDocument()
  })
})
