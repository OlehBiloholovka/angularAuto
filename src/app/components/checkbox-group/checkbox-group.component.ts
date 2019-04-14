import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CheckboxItem} from './shared/checkbox-item.model';

@Component({
  selector: 'app-checkbox-group',
  templateUrl: './checkbox-group.component.html',
  styleUrls: ['./checkbox-group.component.css']
})
export class CheckboxGroupComponent implements OnInit {
  @Input() options = Array<CheckboxItem>();
  @Input() selectedValues;
  @Output() toggle = new EventEmitter<any[]>();

  constructor() { }

  ngOnInit() {
    this.selectedValues.forEach(value => {
      const element = this.options.find(x => x.value === value);
      if (element) {
        element.checked = true;
      }
    });
  }

  onToggle() {
    const checkedOptions = this.options.filter(x => x.checked);
    this.selectedValues = checkedOptions.map(x => x.value);
    this.toggle.emit(checkedOptions.map(x => x.value));
  }
}
