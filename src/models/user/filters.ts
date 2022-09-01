import {KeyValuePair} from "./CustomerSettings";
import {Cuisine} from "../chef/ChefSettings";

export interface Filters {
  sort?: string
  priceRange?: number[]
  dietary?: KeyValuePair[]
  cuisines?: Cuisine[]
}
