import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrtpasteelComponent } from './brtpasteel.component';

describe('BrtpasteelComponent', () => {
  let component: BrtpasteelComponent;
  let fixture: ComponentFixture<BrtpasteelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrtpasteelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrtpasteelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
