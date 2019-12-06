import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayerbuttonComponent } from './layerbutton.component';

describe('LayerbuttonComponent', () => {
  let component: LayerbuttonComponent;
  let fixture: ComponentFixture<LayerbuttonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayerbuttonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayerbuttonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
