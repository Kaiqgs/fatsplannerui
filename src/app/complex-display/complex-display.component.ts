import { Component, Input } from '@angular/core';
import { ComplexNutrient } from 'src/common/models/fatfacts.model';

@Component({
  selector: 'app-complex-display',
  templateUrl: './complex-display.component.html',
  styleUrls: ['./complex-display.component.scss']
})
export class ComplexDisplayComponent {
  @Input()
  complex!: ComplexNutrient;

  @Input()
  width: number = 1;

  @Input()
  level: number = 0;

  identifier: string = this.generateUUID();

  generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'infoCollapse' + 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16;//random number between 0 and 16
      if (d > 0) {//Use timestamp until depleted
        r = (d + r) % 16 | 0;
        d = Math.floor(d / 16);
      } else {//Use microseconds since page-load if supported
        r = (d2 + r) % 16 | 0;
        d2 = Math.floor(d2 / 16);
      }
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

}
