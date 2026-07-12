import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ProofFeature } from './ProofFeature'
import type { IssueRecord, ProofSpread } from '../content/issues'

const spread: ProofSpread = {
  type: 'proof',
  kicker: 'THE PROOF · 校正刷り',
  title: 'Proof of Hand.',
  titleJp: '手による校正。',
  deck: 'The machine drafted the screen; you decide whose words stand.',
  byline: 'BY THE EDITORS · KERNEL.CHAT',
  signoff: 'Decide whose hand fills it.',
  lines: [
    {
      id: 'p1',
      slot: 'HEADLINE',
      machine: 'Start Something New',
      hand: 'Blank on purpose.',
    },
    {
      id: 'p3',
      slot: 'PRIMARY ACTION',
      machine: 'Create Project',
      hand: 'Begin',
    },
  ],
  ledgerNote: 'The ledger counts your marks only — session-only, unrecorded.',
  machineNote: 'The machine lines are real gemma3:12b output, verbatim, raw JSON filed.',
}

const issue: IssueRecord = {
  number: '417',
  month: 'JUL',
  year: '2026',
  feature: 'PROOF OF HAND',
  featureJp: '手による校正',
  price: '¥0 · BYOK',
  tagline: 'MAGAZINE FOR CITY CODERS · 街のコーダーのために',
  headline: { prefix: 'Proof of', emphasis: 'Hand', suffix: '.', swash: '' },
  contents: [],
  accent: 'pool',
  spread,
}

describe('ProofFeature', () => {
  it('loads calm: every line keeps the machine, ledger reads all-machine', () => {
    render(<ProofFeature spread={spread} issue={issue} />)
    expect(screen.getByText('2 MACHINE')).toBeInTheDocument()
    expect(screen.getByText('0 HAND')).toBeInTheDocument()
    expect(screen.getByText('0 STRUCK')).toBeInTheDocument()
    const machineRadios = screen.getAllByRole('radio', { name: 'Keep machine' })
    machineRadios.forEach((r) => expect(r).toHaveAttribute('aria-checked', 'true'))
  })

  it('keeps all three versions in the DOM whatever stands (the rule-4 law)', () => {
    render(<ProofFeature spread={spread} issue={issue} />)
    // Machine stands by default; the hand's version is still printed.
    expect(screen.getByText('Blank on purpose.')).toBeInTheDocument()
    fireEvent.click(screen.getAllByRole('radio', { name: 'Take the hand' })[0])
    // Hand stands now; the machine's version is still printed.
    expect(screen.getByText('Start Something New')).toBeInTheDocument()
    expect(screen.getByText('1 MACHINE')).toBeInTheDocument()
    expect(screen.getByText('1 HAND')).toBeInTheDocument()
  })

  it('strike returns the blank and the ledger follows', () => {
    render(<ProofFeature spread={spread} issue={issue} />)
    fireEvent.click(screen.getAllByRole('radio', { name: 'Strike' })[0])
    expect(screen.getByText('STRUCK — BLANK RETURNS')).toBeInTheDocument()
    expect(screen.getByText('1 STRUCK')).toBeInTheDocument()
    // The struck line's machine text survives in its proof row (rule 4)…
    expect(screen.getByText('Start Something New')).toBeInTheDocument()
    // …and the resolved screen shows a blank for that slot.
    expect(screen.getByLabelText('HEADLINE: struck — blank')).toBeInTheDocument()
  })

  it('resolved screen composes from the marks', () => {
    render(<ProofFeature spread={spread} issue={issue} />)
    fireEvent.click(screen.getAllByRole('radio', { name: 'Take the hand' })[0])
    const screenFrame = screen.getByLabelText('The resolved screen')
    expect(screenFrame).toHaveTextContent('Blank on purpose.')
    expect(screenFrame).toHaveTextContent('Create Project')
  })

  it('keeps both honesty notes on the surface', () => {
    render(<ProofFeature spread={spread} issue={issue} />)
    expect(screen.getByText(/session-only, unrecorded/i)).toBeInTheDocument()
    expect(screen.getByText(/real gemma3:12b output/i)).toBeInTheDocument()
  })
})
