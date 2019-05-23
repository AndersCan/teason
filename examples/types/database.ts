import { Category } from './category';

export interface Database {
  /**
   * @minItems 3
   */
  categories: Category[];
}
