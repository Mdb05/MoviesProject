import Button from '@Components/Button'
import Container from '@Components/Container'
import prisma from '../../prisma/client'
import Image from 'next/image'
import React, { useState } from 'react'
import { Movie, Video } from 'types'
import { getSession } from 'next-auth/react'

interface Props {
  movie: Movie
  movieKey: string
  user: any
  comments: any
}
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

// function SolidHeart() {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       className="h-6 w-6 text-red-500"
//       viewBox="0 0 20 20"
//       fill="currentColor"
//     >
//       <path
//         fillRule="evenodd"
//         d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
//         clipRule="evenodd"
//       />
//     </svg>
//   )
// }
// function OutlineHeart() {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       className="h-6 w-6"
//       fill="none"
//       viewBox="0 0 24 24"
//       stroke="currentColor"
//       strokeWidth={2}
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
//       />
//     </svg>
//   )
// }

const MoviePage = ({ movie, movieKey, user, comments }: Props) => {
  const [isLoading, setLoading] = useState(true)
  const [showModel, setShowModel] = useState(false)
  let comment = React.createRef<HTMLTextAreaElement>()
  async function addComment() {
    if (comment.current.value && user) {
      const response = await fetch(`/api/addcomment/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user,
          movieId: movie.id,
          backdrop_path: movie.backdrop_path,
          text: comment.current.value,
        }),
      })

      if (!response.ok) {
        throw new Error(response.statusText)
      }
    }
  }
  return (
    <Container title="Movies">
      <section className="flex flex-col space-y-3">
        <div className="flex flex-row items-center justify-between px-2">
          <div className="flex items-center gap-x-2">
            <h1 className="text-lg font-medium">
              {movie.title} ({movie.release_date})
            </h1>
          </div>
          <h1 className="text-base font-normal">
            {movie.vote_average / 2}/5 of {movie.vote_count}
          </h1>
        </div>
        <div className="relative min-h-[280px] overflow-hidden rounded-lg bg-gray-200 md:min-h-[480px]">
          {showModel ? (
            <Trailer movieKey={movieKey} />
          ) : (
            <Image
              alt={movie.title}
              src={`https://image.tmdb.org/t/p/original${
                movie.backdrop_path || movie.poster_path
              }`}
              layout="fill"
              objectFit="cover"
              className={cn(
                'duration-700 ease-in-out group-hover:opacity-75',
                isLoading
                  ? 'scale-110 blur-2xl grayscale'
                  : 'scale-100 blur-0 grayscale-0'
              )}
              onLoadingComplete={() => setLoading(false)}
            />
          )}
        </div>
        <div className="flex flex-col space-y-2">
          <div className="space-y-2 px-2">
            <h1 className="text-md font-medium">{movie.tagline}</h1>

            <h1 className="text-lg font-medium">Overview</h1>
            <p className="text-base font-normal">{movie.overview}</p>
            <Button
              text={!showModel ? 'Show Trailer' : 'Close Trailer'}
              type="primary"
              onClick={() => setShowModel(!showModel)}
            />
            <textarea ref={comment} className="w-full ring-1" cols={2} />
          </div>
          <div className="px-2">
            <Button text={'add'} type="primary" onClick={() => addComment()} />
          </div>
          <div className="space-y-2">
            {comments
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              )
              .map(comment => (
                <div className="w-full" key={comment.id}>
                  <div className="flex flex-row justify-between">
                    <h1 className="text-base font-medium">
                      {comment.user.name}
                    </h1>
                    <h2 className="text-base font-normal">
                      {new Date(comment.createdAt).toLocaleString()}
                    </h2>
                  </div>
                  <p className="text-base font-normal">{comment.text}</p>
                </div>
              ))}
          </div>
        </div>
      </section>
    </Container>
  )
}

function Trailer({ movieKey }) {
  return (
    <iframe
      width="100%"
      height="100%"
      src={`https://www.youtube-nocookie.com/embed/${movieKey}`}
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  )
}

export default MoviePage

export const getServerSideProps = async context => {
  let session = await getSession(context)
  const movieId = context.query.id
  const movieUrl = `${process.env.TMDB_URL}/movie/${movieId}?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&append_to_response=videos`
  const movie = (await fetch(movieUrl).then(res => res.json())) as Movie
  let index = movie.videos.results.findIndex(
    (v: Video) => v.type.toLowerCase() === 'trailer'
  )
  const comments = await prisma.comment.findMany({
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
    where: { movieId: { equals: Number(movieId) } },
  })

  return {
    props: {
      user: session ? session.user : null,
      movieId,
      comments,
      movie,
      movieKey: movie.videos?.results[index]?.key,
    },
  }
}
