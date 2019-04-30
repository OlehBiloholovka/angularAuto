import {Make} from './make.model';
import {RiaItem} from './ria-item.model';

export class Category extends RiaItem {
  bodyStyle: RiaItem = new RiaItem();
  gearBox: RiaItem = new RiaItem();
  driverType: RiaItem = new RiaItem();
  options: RiaItem[] = [];
  make: Make = new Make();
}
