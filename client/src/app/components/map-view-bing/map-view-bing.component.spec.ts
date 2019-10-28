import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapViewBingComponent } from './map-view-bing.component';

describe('MapViewBingComponent', () => {
  let component: MapViewBingComponent;
  let fixture: ComponentFixture<MapViewBingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapViewBingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapViewBingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
