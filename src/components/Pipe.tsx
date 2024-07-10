import React from 'react'

interface PipeProps {
  position: { x: number; topHeight: number }
}

export const Pipe: React.FC<PipeProps> = ({ position }) => {
  return (
    <>
      <div
        className='absolute w-20 bg-gradient-to-b from-green-700 to-green-600'
        style={{
          left: `${position.x}px`,
          height: `${position.topHeight}px`,
          top: 0,
        }}
      >
        <div className='absolute bottom-0 left-0 right-0 h-8 bg-green-800 rounded-b-xl shadow-inner' />
        <div className='absolute bottom-8 left-0 right-0 h-3 bg-green-500' />
        <div className='absolute inset-x-0 h-full bg-gradient-to-r from-black/10 via-transparent to-black/10' />
      </div>
      <div
        className='absolute w-20 bg-gradient-to-b from-green-600 to-green-700'
        style={{
          left: `${position.x}px`,
          height: `calc(100vh - ${position.topHeight + 200}px)`,
          bottom: 0,
        }}
      >
        <div className='absolute top-0 left-0 right-0 h-8 bg-green-800 rounded-t-xl shadow-inner' />
        <div className='absolute top-8 left-0 right-0 h-3 bg-green-500' />
        <div className='absolute inset-x-0 h-full bg-gradient-to-r from-black/10 via-transparent to-black/10' />
      </div>
    </>
  )
}
