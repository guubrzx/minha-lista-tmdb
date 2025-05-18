// src/components/ListaConteudos.tsx
import { useEffect, useState } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";

interface Conteudo {
  id?: string;
  titulo: string;
  tipo: string;
  status: string;
}

export default function ListaConteudos() {
  const [conteudos, setConteudos] = useState<Conteudo[]>([]);
  const [titulo, setTitulo] = useState("");
  const [tipo, setTipo] = useState("filme");
  const [status, setStatus] = useState("quero assistir");

  useEffect(() => {
    async function carregarDados() {
      const querySnapshot = await getDocs(collection(db, "minhaLista"));
      const lista: Conteudo[] = [];
      querySnapshot.forEach((doc) => {
        lista.push({ id: doc.id, ...(doc.data() as Conteudo) });
      });
      setConteudos(lista);
    }
    carregarDados();
  }, []);

  async function adicionarConteudo() {
    if (!titulo.trim()) return;
    const novo = { titulo, tipo, status };
    await addDoc(collection(db, "minhaLista"), novo);
    setConteudos([...conteudos, novo]);
    setTitulo("");
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Minha Lista</h2>
      <div className="flex flex-col gap-2 mb-4">
        <input
          className="p-2 border rounded"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
        <select className="p-2 border rounded" value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="filme">Filme</option>
          <option value="série">Série</option>
          <option value="anime">Anime</option>
          <option value="desenho">Desenho</option>
        </select>
        <select className="p-2 border rounded" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="quero assistir">Quero assistir</option>
          <option value="assistido">Assistido</option>
        </select>
        <button className="bg-blue-600 text-white p-2 rounded" onClick={adicionarConteudo}>
          Adicionar
        </button>
      </div>

      <ul>
        {conteudos.map((c) => (
          <li key={c.id} className="mb-2 border-b pb-2">
            <strong>{c.titulo}</strong> — {c.tipo} ({c.status})
          </li>
        ))}
      </ul>
    </div>
  );
}
