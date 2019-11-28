import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LossekaartComponent } from './lossekaart.component';

describe('LossekaartComponent', () => {
  let component: LossekaartComponent;
  let fixture: ComponentFixture<LossekaartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LossekaartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LossekaartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
