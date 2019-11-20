import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrtwaterComponent } from './brtwater.component';

describe('BrtwaterComponent', () => {
  let component: BrtwaterComponent;
  let fixture: ComponentFixture<BrtwaterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrtwaterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrtwaterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
