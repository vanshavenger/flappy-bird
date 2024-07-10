import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Bird } from './Bird'
import { Pipe } from './Pipe'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

const GRAVITY = 0.2
const JUMP_STRENGTH = 6
const PIPE_WIDTH = 80
const PIPE_GAP = 200
const PIPE_SPEED = 2.9
const PIPE_SPAWN_RATE = 4000

const FlappyBirdGame: React.FC = () => {
  const [gameSize, setGameSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })
  const [gameStarted, setGameStarted] = useState<boolean>(false)
  const [birdPosition, setBirdPosition] = useState<number>(gameSize.height / 2)
  const [birdVelocity, setBirdVelocity] = useState<number>(0)
  const [pipes, setPipes] = useState<{ x: number; topHeight: number }[]>([])
  const [score, setScore] = useState<number>(0)
  const [highScore, setHighScore] = useState<number>(0)
  const gameLoopRef = useRef<number | null>(null)

  const generatePipe = useCallback(
    () => ({
      x: gameSize.width,
      topHeight: Math.random() * (gameSize.height - PIPE_GAP - 200) + 100,
    }),
    [gameSize.height, gameSize.width]
  )

  const resetGame = useCallback(() => {
    setBirdPosition(gameSize.height / 2)
    setBirdVelocity(0)
    setPipes([])
    setScore(0)
    setGameStarted(true)
  }, [gameSize.height])

  const updateGame = useCallback(() => {
    if (!gameStarted) return

    setBirdPosition((prev) =>
      Math.max(0, Math.min(prev + birdVelocity, gameSize.height - 30))
    )
    setBirdVelocity((prev) => prev + GRAVITY)

    setPipes((prevPipes) => {
      const newPipes = prevPipes
        .map((pipe) => ({ ...pipe, x: pipe.x - PIPE_SPEED }))
        .filter((pipe) => pipe.x > -PIPE_WIDTH)

      if (newPipes.some((pipe) => pipe.x === 50 - PIPE_WIDTH / 2)) {
        setScore((prev) => {
          const newScore = prev + 1
          if (newScore > highScore) {
            setHighScore(newScore)
            toast.info('New High Score!', {
              description: `You've reached ${newScore} points!`,
            })
          }
          return newScore
        })
      }

      return newPipes
    })

    const bird = {
      left: 50,
      right: 80,
      top: birdPosition,
      bottom: birdPosition + 30,
    }
    for (const pipe of pipes) {
      const topPipe = {
        left: pipe.x,
        right: pipe.x + PIPE_WIDTH,
        top: 0,
        bottom: pipe.topHeight,
      }
      const bottomPipe = {
        left: pipe.x,
        right: pipe.x + PIPE_WIDTH,
        top: pipe.topHeight + PIPE_GAP,
        bottom: gameSize.height,
      }

      if (
        (bird.right > topPipe.left &&
          bird.left < topPipe.right &&
          bird.top < topPipe.bottom) ||
        (bird.right > bottomPipe.left &&
          bird.left < bottomPipe.right &&
          bird.bottom > bottomPipe.top) ||
        bird.top <= 0 ||
        bird.bottom >= gameSize.height
      ) {
        setHighScore((prev) => Math.max(prev, score))
        setGameStarted(false)
        toast.success('Game Over', {
          description: `Your score: ${score}`,
        })
      }
      else {
        setScore((prev) => prev + 1)
      }
    }
  }, [gameStarted, birdPosition, birdVelocity, pipes, gameSize.height, score, highScore])

  useEffect(() => {
    const handleResize = () =>
      setGameSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (gameStarted) {
      gameLoopRef.current = requestAnimationFrame(function gameLoop() {
        updateGame()
        gameLoopRef.current = requestAnimationFrame(gameLoop)
      })
    } else if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current)
    }
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current)
    }
  }, [gameStarted, updateGame])

  useEffect(() => {
    if (gameStarted) {
      const pipeInterval = setInterval(() => {
        setPipes((prevPipes) => [...prevPipes, generatePipe()])
      }, PIPE_SPAWN_RATE)
      return () => clearInterval(pipeInterval)
    }
  }, [gameStarted, generatePipe])

  const handleJump = useCallback(() => {
    if (gameStarted) {
      setBirdVelocity(-JUMP_STRENGTH)
    } else {
      resetGame()
    }
  }, [gameStarted, resetGame])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        handleJump()
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleJump])

  return (
    <div
      className='w-full h-full bg-gradient-to-b from-sky-600 to-sky-200 overflow-hidden relative'
      style={{ width: gameSize.width, height: gameSize.height }}
      onClick={handleJump}
    >
      <Bird position={birdPosition} velocity={birdVelocity} />
      {pipes.map((pipe, index) => (
        <Pipe key={index} position={{ x: pipe.x, topHeight: pipe.topHeight }} />
      ))}
      <Card className='absolute top-4 left-4 bg-white/80'>
        <CardHeader>
          <CardTitle>Score: {score}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>High Score: {highScore}</p>
        </CardContent>
      </Card>
      {!gameStarted && (
        <div className='absolute inset-0 bg-black backdrop-blur-xl bg-opacity-50 flex items-center justify-center'>
          <Card className='w-96'>
            <CardHeader>
              <CardTitle className='text-4xl font-bold text-center text-primary'>
                VC-Flappy Bird
              </CardTitle>
            </CardHeader>
            <CardContent className='text-center'>
              <Button onClick={resetGame} className='text-xl px-8 py-4'>
                {score > 0 ? 'Play Again' : 'Start Game'}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default FlappyBirdGame
