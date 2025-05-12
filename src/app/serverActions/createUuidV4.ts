'use server'
import { v4 as uuidv4 } from 'uuid'

export async function createUuidV4() {
  const uuid = uuidv4()

  return { uuid }
}
