import {Region} from './region.model';
import {Category} from './category.model';
import {RiaItem} from './ria-item.model';

export class Car {
  key: string;
  userID: string;
  year: number;
  mileage: number;
  price: number;
  capacity: number;
  color: RiaItem = new RiaItem();
  engineType: RiaItem = new RiaItem();
  region: Region = new Region();
  category: Category = new Category();
  photoURLs?: string[] = [];
  options: RiaItem[] = [];
}
