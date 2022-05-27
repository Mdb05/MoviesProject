// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma  from '../../prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import {Movie} from '../../types/index'
import { getSession } from 'next-auth/react'

type Data = {
  data: Movie[] |string
}

  const  handler = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
)=>  { 
  const { text, movieId , backdrop_path, user} = req.body
    if(user){
      let isUser = await prisma.user.findFirst({ where: { email: { equals: user.email } },})
      let movie = await prisma.movie.findFirst({ where: { id: { equals: movieId } },})
    if (req.method === "POST") {
      if(isUser){
        try {
          if(movie){
            let comment = await prisma.comment.create({
              data: {
                text,
                userId:user.id,
                createdAt:Date.now(),
                movieId:movie.id
              },
            })
            res.status(200).json({data:"comment created"} )
          }else{
            let createdMovie = await prisma.movie.create({ data: { id: movieId, backdrop_path },})
            let comment = await prisma.comment.create({
              data: {
        text,
        userId:user.id,
        movieId:createdMovie.id,
        createdAt:Date.now()
      },
    })
    res.status(200).json({data:"comment created"} )
          }
        }
          catch(err){
            console.log(err)
            res.status(404).json({data:"error"} )
          }
        }else{
          let createdUser = await prisma.user.create({data:{
            id:user.id,
            email:user.email,
            name:user.name
          }})
        }
        }
    }else{
      res.status(404).json({data:"unauthorozed"} )
    }
}
export default handler