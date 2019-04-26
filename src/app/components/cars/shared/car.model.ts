import {Region} from './region.model';
import {Category} from './category.model';
import {RiaItem} from './ria-item.model';

export class Car {
  $key: string;
  userID: string;
  year: number;
  mileage: number;
  price: number;
  capacity: number;
  engineType: RiaItem = new RiaItem();
  region: Region = new Region();
  category: Category = new Category();

  // name?: string;
  // model?: string;
  // engine?: number;
  // userID?: string;
  photoURLs?: string[] = [];
  options: any[] = [];
}
