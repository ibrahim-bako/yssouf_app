import { Staff } from "./Staff"

export interface Presence {
  id?: number
  date: Date
  one: boolean
  two: boolean
  three: boolean
  staff: number | Staff
}
