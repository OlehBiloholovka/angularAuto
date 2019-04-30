import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CheckboxItem} from './shared/checkbox-item.model';
import {RiaItem} from '../cars/shared/ria-item.model';

@Component({
  selector: 'app-checkbox-group',
  templateUrl: './checkbox-group.component.html',
  styleUrls: ['./checkbox-group.component.css']
})
export class CheckboxGroupComponent implements OnInit {
  @Input() options: Array<CheckboxItem>;
  @Input() selectedValues = new Array<RiaItem>();
  @Output() toggle = new EventEmitter<any[]>();

  constructor() { }

  ngOnInit() {
    if (this.selectedValues) {
      this.selectedValues.forEach(value => {
        const element = this.options
          .find(x => Number.parseInt(x.value, 10) === value.id);
        if (element) {
          element.checked = true;
        }
      });
    }
  }

  onToggle() {
    const checkedOptions = this.options.filter(x => x.checked);
    this.selectedValues = checkedOptions.map(x => {
      return {id: Number.parseInt(x.value, 10)};
    });
    this.toggle.emit(checkedOptions.map(x => x.value));
  }
}
