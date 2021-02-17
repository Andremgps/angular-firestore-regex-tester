import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  private dataSource = new BehaviorSubject(undefined);
  public currentData = this.dataSource.asObservable();

  constructor() {}

  changeData(data: any) {
    this.dataSource.next(data);
  }
}
