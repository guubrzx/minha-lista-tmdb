import React, { useEffect, useState } from 'react'
import axios from 'axios'

const API_KEY = '7fcdde2676e1310fb24f750c6ffccd9b'

interface Content {
  id: number
  title: string
  poster_path: string
}

export default function App() {
  const [search, setSearch] = useState('')
  const [results, setResults] = useState<Content[]>([])
  const [watchList, setWatchList] = useState<number[]>(() => {
    const saved = localStorage.getItem('watchList')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('watchList', JSON.stringify(watchList))
  }, [watchList])

  const handleSearch = async () => {
    if (!search) return
    const res = await axios.get(`https://api.themoviedb.org/3/search/multi`, {
      params: {
        api_key: API_KEY,
        language: 'pt-BR',
        query: search
      }
    })
    setResults(res.data.results)
  }

  const toggleWatch = (id: number) => {
    setWatchList(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Minha Lista</h1>
      <input
        className="w-full p-2 text-black"
        placeholder="Pesquisar filme, série, anime..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSearch()}
      />
      <div className="grid grid-cols-2 gap-4 mt-4">
        {results.map(item => (
          <div key={item.id} className="text-center">
            {item.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
                alt={item.title}
                className="rounded mb-2"
              />
            )}
            <p>{item.title}</p>
            <button
              className="mt-2 px-2 py-1 bg-red-600 rounded"
              onClick={() => toggleWatch(item.id)}
            >
              {watchList.includes(item.id)
                ? 'Remover da Lista'
                : 'Adicionar à Lista'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
