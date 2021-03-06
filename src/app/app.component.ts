import { Component, HostBinding, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { EchoesState } from '@store/reducers';
import { getSidebarCollapsed, getAppTheme } from '@store/app-layout';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'body',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  sidebarCollapsed$ = this.store.select(getSidebarCollapsed);
  theme$ = this.store.select(getAppTheme);

  @HostBinding('class') style = 'arctic';

  constructor(
    private store: Store<EchoesState>,
  ) {}

  ngOnInit() {
    this.theme$.subscribe(theme => (this.style = theme));
  }
}
