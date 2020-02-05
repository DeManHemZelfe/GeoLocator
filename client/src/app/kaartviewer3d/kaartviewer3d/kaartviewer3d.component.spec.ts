import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Kaartviewer3dComponent } from './kaartviewer3d.component';

describe('Kaartviewer3dComponent', () => {
  let component: Kaartviewer3dComponent;
  let fixture: ComponentFixture<Kaartviewer3dComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Kaartviewer3dComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Kaartviewer3dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
