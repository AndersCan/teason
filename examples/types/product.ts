import { Quality } from './product-type';

export interface Product {
  /**
   * @faker random.number
   * @TJS-type string
   */
  id: string;
  /**
   * @faker commerce.productName
   * @TJS-type string
   */
  name: string;
  /**
   * @faker commerce.price
   * @minimum 0
   * @TJS-type integer
   */
  price: number;
  /**
   * @minimum 0
   * @faker lorem.paragraph
   * @TJS-type string
   */
  description: string;
  /**
   * @minimum 0
   * @faker image.animals
   * @TJS-type string
   */
  imageUrl: string;
  quality: Quality;
}
