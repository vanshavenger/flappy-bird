import React from 'react'

interface BirdProps {
  position: number
  velocity: number
}

export const Bird: React.FC<BirdProps> = ({ position, velocity }) => {
  return (
    <div
      className='absolute left-[50px] w-12 h-12 transition-transform'
      style={{
        top: `${position}px`,
        transform: `rotate(${Math.min(Math.max(velocity * 3, -30), 30)}deg)`,
      }}
    >
      <svg viewBox='0 0 48 48' className='w-full h-full'>
        <ellipse cx='24' cy='24' rx='23' ry='18' fill='#FDE047' />
        <ellipse cx='24' cy='24' rx='20' ry='16' fill='#FBBF24' />
        <ellipse cx='35' cy='20' rx='6' ry='5' fill='white' />
        <circle cx='37' cy='20' r='2' fill='black' />
        <path
          d='M 15 28 Q 24 32 33 28'
          fill='none'
          stroke='#EA580C'
          strokeWidth='2'
          strokeLinecap='round'
        />
        <path
          d='M 8 18 Q 2 14 0 8'
          fill='none'
          stroke='#FBBF24'
          strokeWidth='4'
          strokeLinecap='round'
        />
        <path d='M 48 20 L 44 18 L 48 16' fill='#FB923C' />
      </svg>
    </div>
  )
}
