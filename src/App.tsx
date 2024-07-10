import { Toaster } from 'sonner'
import './App.css'
import FlappyBirdGame from '@/components/FlappyBirdGame'

function App() {
  return (
    <>
      <FlappyBirdGame />
      <Toaster richColors closeButton position='top-center' />
    </>
  )
}

export default App
