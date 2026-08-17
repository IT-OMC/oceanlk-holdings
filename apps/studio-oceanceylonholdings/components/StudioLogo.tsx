import React from 'react'

export function StudioLogo() {
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: '8px', padding: '0 4px'}}>
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{color: '#0284c7'}}
      >
        <path
          d="M3 15C3 15 6 12 12 12C18 12 21 15 21 15M3 18C3 18 6 15 12 15C18 15 21 18 21 18M3 12C3 12 6 9 12 9C18 9 21 12 21 12M12 3V7"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span style={{fontWeight: 700, fontSize: '14px', letterSpacing: '-0.01em', color: 'inherit'}}>
        Ocean Ceylon <span style={{color: '#0284c7'}}>CMS</span>
      </span>
    </div>
  )
}
