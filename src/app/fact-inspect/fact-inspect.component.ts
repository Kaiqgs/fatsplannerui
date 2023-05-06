import { Component, Input } from '@angular/core';
import { Focusable } from '../app.component';

@Component({
  selector: 'app-fact-inspect',
  templateUrl: './fact-inspect.component.html',
  styleUrls: ['./fact-inspect.component.scss']
})
export class FactInspectComponent {
  @Input()
  focusedData: Focusable | undefined;
  constructor() { }
}
