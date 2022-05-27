import type { NextPage } from 'next'
import Container from '@Components/Container'
import React from 'react'
import ExternalLink from '@Components/ExternalLink'
import { Movie } from '../types/index'
import Row from '@Components/row'
import requests from '@Utils/requests'

interface Props {
  netflixOriginals: content
  trendingNow: content
  topRated: content
  actionMovies: content
  comedyMovies: content
  horrorMovies: content
  romanceMovies: content
  documentaries: content
}
type content = {
  url: string
  results: Movie[]
}

const Home = ({
  netflixOriginals,
  actionMovies,
  comedyMovies,
  documentaries,
  horrorMovies,
  romanceMovies,
  topRated,
  trendingNow,
}: Props) => {
  return (
    <Container title="Movies">
      <div className="flex flex-col items-start space-y-3">
        <section className="md:space-y-12">
          <Row title="Trending" content={trendingNow} />
          <Row title="Top Rated" content={topRated} />
          <Row title="Netflix Originals" content={netflixOriginals} />
          <Row title="Action Movies" content={actionMovies} />
          <Row title="Comedy Movies" content={comedyMovies} />
          <Row title="Horror Movies" content={horrorMovies} />
          <Row title="Romance Movies" content={romanceMovies} />
          <Row title="Documentaries" content={documentaries} />
        </section>
      </div>
    </Container>
  )
}

export default Home

export const getServerSideProps = async () => {
  const [
    netflixOriginals,
    trendingNow,
    topRated,
    actionMovies,
    comedyMovies,
    horrorMovies,
    romanceMovies,
    documentaries,
  ] = await Promise.all([
    fetch(requests.fetchNetflixOriginals).then(res => res.json()),
    fetch(requests.fetchTrending).then(res => res.json()),
    fetch(requests.fetchTopRated).then(res => res.json()),
    fetch(requests.fetchActionMovies).then(res => res.json()),
    fetch(requests.fetchComedyMovies).then(res => res.json()),
    fetch(requests.fetchHorrorMovies).then(res => res.json()),
    fetch(requests.fetchRomanceMovies).then(res => res.json()),
    fetch(requests.fetchDocumentaries).then(res => res.json()),
  ])

  return {
    props: {
      netflixOriginals: {
        results: netflixOriginals.results,
        url: requests.fetchNetflixOriginals,
      },
      trendingNow: {
        results: trendingNow.results,
        url: requests.fetchTrending,
      },
      topRated: { results: topRated.results, url: requests.fetchTopRated },
      actionMovies: {
        results: actionMovies.results,
        url: requests.fetchActionMovies,
      },
      comedyMovies: {
        results: comedyMovies.results,
        url: requests.fetchComedyMovies,
      },
      horrorMovies: {
        results: horrorMovies.results,
        url: requests.fetchHorrorMovies,
      },
      romanceMovies: {
        results: romanceMovies.results,
        url: requests.fetchRomanceMovies,
      },
      documentaries: {
        results: documentaries.results,
        url: requests.fetchDocumentaries,
      },
    },
  }
}
