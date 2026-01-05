import { Category } from "./Category"

export type Product = {
  id?: number,
  name: string,
  description: string,
  price: number,
  category: Category,
  active: boolean
}