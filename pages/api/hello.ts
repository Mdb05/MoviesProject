// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import requests from '../../src/utils/requests'
import {Movie} from '../../types/index'

type Data = {
  movies: Movie[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let moviesRes = await fetch(requests.fetchTopRated)
  let movies = await moviesRes.json()
  res.status(200).json({movies} )
}
