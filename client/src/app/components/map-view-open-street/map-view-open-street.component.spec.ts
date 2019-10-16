import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapViewOpenStreetComponent } from './map-view-open-street.component';

describe('MapViewOpenStreetComponent', () => {
  let component: MapViewOpenStreetComponent;
  let fixture: ComponentFixture<MapViewOpenStreetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapViewOpenStreetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapViewOpenStreetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
