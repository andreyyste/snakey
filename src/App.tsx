import Game from './Game'

function App() {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-8">
        Snakey Game
      </h1>
      <div className="rounded-xl overflow-hidden shadow-2xl border-4 border-gray-800">
        <Game />
      </div>
    </div>
  )
}

export default App
