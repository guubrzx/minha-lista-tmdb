import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from 'firebase/firestore'
import { db } from './firebase'

const API_KEY = '7fcdde2676e1310fb24f750c6ffccd9b'

interface Content {
  id: number
  title: string
  poster_path: string
}

export default function App() {
  const [search, setSearch] = useState('')
  const [results, setResults] = useState<Content[]>([])
  const [watchList, setWatchList] = useState<Content[]>([])

  useEffect(() => {
    async function carregarLista() {
      const snapshot = await getDocs(collection(db, 'watchlist'))
      const lista: Content[] = snapshot.docs.map(doc => ({
        ...(doc.data() as Content)
      }))
      setWatchList(lista)
    }
    carregarLista()
  }, [])

  const handleSearch = async () => {
    if (!search) return
    const res = await axios.get(`https://api.themoviedb.org/3/search/multi`, {
      params: {
        api_key: API_KEY,
        language: 'pt-BR',
        query: search
      }
    })
    const filtrado = res.data.results.filter((item: any) => item.title)
    setResults(filtrado)
  }

  const toggleWatch = async (item: Content) => {
    const existe = watchList.find(i => i.id === item.id)
    if (existe) {
      // Remover do Firestore
      const snapshot = await getDocs(collection(db, 'watchlist'))
      const docToDelete = snapshot.docs.find(doc => doc.data().id === item.id)
      if (docToDelete) {
        await deleteDoc(doc(db, 'watchlist', docToDelete.id))
      }
      setWatchList(watchList.filter(i => i.id !== item.id))
    } else {
      // Adicionar ao Firestore
      await addDoc(collection(db, 'watchlist'), item)
      setWatchList([...watchList, item])
    }
  }

  const isInList = (id: number) => watchList.some(i => i.id === id)

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
              onClick={() => toggleWatch(item)}
            >
              {isInList(item.id) ? 'Remover da Lista' : 'Adicionar à Lista'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
