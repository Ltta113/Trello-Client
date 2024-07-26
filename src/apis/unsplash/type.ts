/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Photo {
  [x: string]: string | undefined
  img: any
  id: number
  width: number
  height: number
  urls: { large: string; regular: string; raw: string; small: string }
  color: string | null
  user: {
    username: string
    name: string
  }
}
