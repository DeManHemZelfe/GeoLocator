import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KaartviewerComponent } from './kaartviewer.component';

describe('KaartviewerComponent', () => {
  let component: KaartviewerComponent;
  let fixture: ComponentFixture<KaartviewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KaartviewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KaartviewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
