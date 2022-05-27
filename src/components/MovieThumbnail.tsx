// import { useRecoilState } from 'recoil'
import Image from 'next/image'
import { Movie } from '../../types/index'
import { useRouter } from 'next/router'

interface Props {
  movie: Movie
}

function Thumbnail({ movie }: Props) {
  const router = useRouter()

  return (
    <div
      className={`relative h-28 min-w-[180px] cursor-pointer transition duration-200 ease-out hover:z-10 md:h-36 md:min-w-[260px] md:hover:scale-105`}
      onClick={() => {
        router.push(`/movie/${movie.id}`)
      }}
    >
      <Image
        src={`https://image.tmdb.org/t/p/w500${
          movie.backdrop_path || movie.poster_path
        }`}
        className="rounded-sm object-cover md:rounded"
        layout="fill"
      />
    </div>
  )
}

export default Thumbnail
