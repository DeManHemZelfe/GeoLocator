import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropDownLayersComponent } from './drop-down-layers.component';

describe('DropDownLayersComponent', () => {
  let component: DropDownLayersComponent;
  let fixture: ComponentFixture<DropDownLayersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropDownLayersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropDownLayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
