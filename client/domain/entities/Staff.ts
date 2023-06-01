import { Presence } from "./Presence"

export interface Staff {
  id?: number
  first_name: string
  last_name: string
  card_number: string
  birthday: Date
  tel: string
  occupation: string
  emergency_person: string
  emergency_tel: string
  presence: number[] | Presence[]
}
