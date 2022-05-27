import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline'
import { join } from 'path'
import { useRef, useState } from 'react'
import { Movie } from '../../types/index'
import Thumbnail from './MovieThumbnail'
import { useRouter } from 'next/router'
interface Props {
  id?: string
  title: string
  content: {
    url: string
    results: Movie[]
  }
}
type Videos = {
  results: Movie[]
}

function Row({ title, content }: Props) {
  const rowRef = useRef<HTMLDivElement>(null)
  const [isMoved, setIsMoved] = useState(false)
  const router = useRouter()
  const handleClick = (direction: string) => {
    setIsMoved(true)
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current

      const scrollTo =
        direction === 'left'
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' })
    }
  }

  return (
    <div className="h-40 max-w-3xl space-y-0.5 md:space-y-2">
      <h2
        className="w-56 cursor-pointer px-2 text-sm font-semibold text-black-secondary transition duration-200 dark:text-white-secondary md:text-2xl"
        onClick={() => {
          router.push(title.split(' ').join('-').toLowerCase())
        }}
      >
        {title}
      </h2>
      <div className="group relative md:-ml-2">
        <ChevronLeftIcon
          className={`absolute top-0 bottom-0 left-2 z-40 m-auto h-9 w-9 cursor-pointer text-white opacity-0 transition hover:scale-125 group-hover:opacity-100 ${
            !isMoved && 'hidden'
          }`}
          onClick={() => handleClick('left')}
        />
        <div
          className="scrollbar-hide flex items-center space-x-0.5 overflow-x-scroll md:space-x-2.5 md:p-2"
          ref={rowRef}
        >
          {content.results.map(movie => (
            <Thumbnail key={movie.id} movie={movie} />
          ))}
        </div>
        <ChevronRightIcon
          className="absolute top-0 bottom-0 right-2 z-40 m-auto h-9 w-9 cursor-pointer text-white opacity-0 transition hover:scale-125 group-hover:opacity-100"
          onClick={() => handleClick('right')}
        />
      </div>
    </div>
  )
}

export default Row
