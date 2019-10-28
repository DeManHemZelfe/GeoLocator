import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarFunctionsDrawComponent } from './sidebar-functions-draw.component';

describe('SidebarFunctionsDrawComponent', () => {
  let component: SidebarFunctionsDrawComponent;
  let fixture: ComponentFixture<SidebarFunctionsDrawComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarFunctionsDrawComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarFunctionsDrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
