import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarFunctionsComponent } from './toolbar-functions.component';

describe('ToolbarFunctionsComponent', () => {
  let component: ToolbarFunctionsComponent;
  let fixture: ComponentFixture<ToolbarFunctionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolbarFunctionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarFunctionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
