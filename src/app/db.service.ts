import { Injectable } from '@angular/core';
import Dexie from 'dexie';

@Injectable({
  providedIn: 'root'
})
export class DbService extends Dexie {

  constructor() {
    super('socram');

    this.version(1).stores({
      diary: '++id, record, datetime',
      nutrientBank: 'hash, record, datetime',
      settings: 'lastChange, macros'
    });




  }
}
