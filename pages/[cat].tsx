import type { NextPage } from 'next'
import Container from '@Components/Container'
import React, { useState } from 'react'
import { Movie } from '../types/index'
import requests from '@Utils/requests'
import Thumbnail from '@Components/MovieThumbnail'
import Button from '@Components/Button'

interface Props {
  url: string
  title: string
  movies: Movie[]
}

const Home = ({ title, url, movies }: Props) => {
  const [allmovies, setAllmovies] = useState(movies)
  const [page, setPage] = useState(1)
  async function LoadMovies() {
    setPage(page + 1)
    const res = await fetch(url + `&page=${page}`).then(res => res.json())
    setAllmovies([...allmovies, ...res.results])
  }
  return (
    <Container title={title}>
      <div className="flex flex-col items-start space-y-3">
        <div className="grid grid-cols-3 gap-1">
          {allmovies.map(movie => (
            <Thumbnail key={movie.id} movie={movie} />
          ))}
        </div>
        <Button text={'More'} type="primary" onClick={() => LoadMovies()} />
      </div>
    </Container>
  )
}

export default Home

export const getServerSideProps = async context => {
  const cat = context.query.cat as string
  let url =
    requests[
      Object.keys(requests).find(
        s => s.toLowerCase() === 'fetch' + cat.replace('-', '')
      )
    ]
  const res = await fetch(url + '&page=1').then(res => res.json())

  return {
    props: {
      title: cat.replace('-', ' ').toUpperCase(),
      url,
      movies: res.results,
    },
  }
}
