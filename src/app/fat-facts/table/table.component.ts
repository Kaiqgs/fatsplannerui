import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { PlanningResponse } from 'src/common/models/factplanning.model';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  @Output()
  onSelected = new EventEmitter<boolean>();

  @Input()
  limit: number = 25;

  @Input()
  displayColumns: Array<string> = [];

  @Input()
  data!: PlanningResponse;

  form: FormGroup;

  get selected() {
    return false;
  }

  constructor(private _fb: FormBuilder) {
    const initialData: TableData = {
      selected: false
    }

    this.form = this.generateForm(initialData);
    this.form.valueChanges.subscribe({
      next: (next) => console.log(next),
      error: (err) => console.error(err),
    });
    console.log('Subscribed' + JSON.stringify(this.form.value));
  }

  generateForm(data: TableData): FormGroup {
    const form = this._fb.group({ selected: [data.selected] });
    return form;
  }

  ngOnInit(): void {}

 onSelectChange(event:Event) {
    event.preventDefault();
    console.log((event.target as HTMLInputElement).checked);
  }
}

export interface TableData {
  selected: boolean;
}
