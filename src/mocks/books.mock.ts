import type { Book } from '../types/book.types'

// Generate 40 mock books programmatically for variety
const titles = [
  'Cien hojas en blanco',
  'Sombras de la ciudad',
  'El mapa de los recuerdos',
  'Los números del viento',
  'Canciones para la lluvia',
  'Manual del viajero lento',
  'El jardín nocturno',
  'Voces en la penumbra',
  'La estación olvidada',
  'Historias de café',
  'A contraluz',
  'El último anfitrión',
  'Río de arenas',
  'Fragmentos de un otoño',
  'Cuaderno de papel',
  'El color de las palabras',
  'Trazos de ausencia',
  'La ruta de las luces',
  'Cartas a ninguna parte',
  'El misterio de la azotea',
  'Bajo las estrellas rotas',
  'La teoría del abrazo',
  'Rincones del mundo',
  'El oficio de perderse',
  'Sonidos del tiempo',
  'Bruma y sal',
  'Historia mínima',
  'El coleccionista de nombres',
  'Llegada tarde',
  'Memoria de madera',
  'Pequeñas cláusulas',
  'Tierra posible',
  'Habitantes del aire',
  'Caminos de polvo',
  'La casa del péndulo',
  'Sombras en calma',
  'Viento de otoño',
  'Ecos del polen',
  'Diarios compartidos',
]

function makeBook(i: number): Book {
  const idx = i % titles.length
  return {
    id: String(i + 1),
    title: titles[idx] + (i >= titles.length ? ` (${Math.floor(i / titles.length)})` : ''),
    author: `Autor ${((i % 12) + 1)}`,
    price: +(10 + (i % 20) * 1.5).toFixed(2),
    description: `Descripción del libro ${i + 1}: un relato único sobre lugares y personas.`,
    image: `https://picsum.photos/seed/book${i + 1}/400/600`,
  }
}

export const BOOKS_MOCK: Book[] = Array.from({ length: 40 }).map((_, i) => makeBook(i))
