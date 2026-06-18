import * as React from 'react'

export type PopShapeName =
  | 'circle' | 'ring' | 'dot' | 'square' | 'lozenge' | 'triangle' | 'star' | 'slash'

export interface PopShapeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Which geometric mark to draw. */
  name: PopShapeName
  /** Size step. Default "md". */
  size?: 'sm' | 'md' | 'lg'
  /** Token colour. Default "tomato". */
  color?: 'tomato' | 'ink' | 'coffee' | 'ivory' | 'current'
  /** Centered mono label — turns the shape into an editorial badge
   *  (e.g. "NEW", "03"). On filled shapes it reads as negative ink. */
  label?: string
}

/** Geometric ornament primitive — editorial badges, corner marks, dividers. */
export function PopShape(props: PopShapeProps): React.JSX.Element
