import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-mobile-menu',
  templateUrl: './mobile-menu.component.html',
  styleUrls: ['./mobile-menu.component.css']
})
export class MobileMenuComponent implements OnInit {

  public searchInput = '';
  public places = [];
  public collations = [];
  public searchThreshold = 2;
  public foundPlace: any = null;
  public selectedItem = [];
  public selectedIndex = -1;

  @Output() _placefound: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }
  onPlaceFound(place) { return this._placefound.emit(place); }

}
