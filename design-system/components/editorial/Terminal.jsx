import React from 'react'

/**
 * Terminal — the magazine's mac-chrome terminal window, an ink
 * ground with a hard tomato offset-block shadow. Pass `title` for the
 * window-bar label and an array of `lines` ({ prompt, text, agent,
 * dim }) for the body, or arbitrary children. The quiet utility core
 * inside the loud editorial frame.
 */
export function Terminal({ title = 'kbot — kernel.chat', lines, children, className = '', ...rest }) {
  const classes = ['pop-terminal', className].filter(Boolean).join(' ')
  return (
    <div className={classes} {...rest}>
      <div className="pop-terminal-bar">
        <span className="pop-term-dot pop-term-dot--red" />
        <span className="pop-term-dot pop-term-dot--yellow" />
        <span className="pop-term-dot pop-term-dot--green" />
        {title && <span className="pop-terminal-title">{title}</span>}
      </div>
      <div className="pop-terminal-body">
        {lines
          ? lines.map((line, i) => (
              <div className="pop-terminal-line" key={i}>
                {line.prompt && <span className="pop-terminal-prompt">{line.prompt}</span>}
                {line.agent && <span className="pop-terminal-agent">{line.agent} </span>}
                <span className={line.dim ? 'pop-terminal-dim' : undefined}>{line.text}</span>
              </div>
            ))
          : children}
      </div>
    </div>
  )
}
