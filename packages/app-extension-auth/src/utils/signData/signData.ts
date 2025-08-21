import jwt from 'jsonwebtoken'

export const signData = <Data>(secret: string, data: Data) =>
  jwt.sign({ data }, secret)
