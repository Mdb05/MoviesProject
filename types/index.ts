export interface Genre {
    id: number
    name: string
  }
  
  export interface Video {
    id: string
    name: string
    iso_3166_1:  string
    iso_639_1:  string
    key:  string
    official: boolean
    published_at:  string
    site:  string
    size: number
    type:  string
  }
  
  type Videos = {
    results:Video[]
  }

  export interface Movie {
    title: string
    backdrop_path: string
    media_type?: string
    release_date?: string
    first_air_date: string
    genre_ids: number[]
    id: number
    name: string
    origin_country: string[]
    original_language: string
    original_name: string
    overview: string
    popularity: number
    poster_path: string
    vote_average: number
    vote_count: number
    tagline:string
    videos: Videos
  }
