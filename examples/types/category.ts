import { Product } from './product';

export interface Category {
  /**
   * @faker random.number
   * @TJS-type string
   */
  id: string;
  /**
   * @faker commerce.department
   * @TJS-type string
   */
  name: string;
  /**
   * @minItems 3
   */
  products: Product[];
}
