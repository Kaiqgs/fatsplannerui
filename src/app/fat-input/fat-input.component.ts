import { Component, EventEmitter, AfterViewInit, Output } from '@angular/core';
import {
  FatsecretContainer,
  FatFacts,
  FatsecretContainerContainer,
} from 'src/common/models/fatfacts.model';
import { FatSource } from 'src/common/models/fatsource.model';
import { initial } from './fat-input.constants';

@Component({
  selector: 'app-fat-input',
  templateUrl: './fat-input.component.html',
  styleUrls: ['./fat-input.component.scss'],
})
export class FatInputComponent implements AfterViewInit {
  @Output()
  changeSource = new EventEmitter<FatsecretContainerContainer>();

//   @Output()
//   createSource = new EventEmitter<AllSecFacts>();

//   @Output()
//   destroySource = new EventEmitter<string>();

  inputs: Array<FatSource> = [];

  constructor() {}

  ngAfterViewInit(): void {
    this.addInputSource( initial);
  }

  addInputSource(obj: FatSource = { html: '', brief: '' }) {
    if (!this.inputs.find((x) => x.brief == obj.brief)) {
	  obj.html = obj.html.replace(/,+/g, '.').replace(/\s+/g, ' '); 
      this.inputs.push(obj);
      this.onChangeSource();
    }
  }

  removeInputSource(brief: string) {
    this.inputs = this.inputs.filter((x) => x.brief != brief);
    this.onChangeSource();
  }

  onChangeSource(index: number = -1, update: any = {}) {
    if (index >= 0) {
      if (update.html) {
        this.inputs[index].html = update.html.value;
      } else if (update.brief) {
        this.inputs[index].brief = update.brief.value;
      }
    }
    const sourceData = this.inputs.map((src) => new FatFacts(src).allfatdata);
    this.changeSource.emit(sourceData);
  }

//   private _onSourcesCreate(value: FatSource) {
//     this.createSource.emit(new FatFacts(value).allfatdata);
//   }

//   private _onSourcesDestroy(brief: string) {
//     this.destroySource.emit(brief);
//   }
}
