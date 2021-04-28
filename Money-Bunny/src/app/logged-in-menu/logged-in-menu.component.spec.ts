import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoggedInMenuComponent } from './logged-in-menu.component';

describe('LoggedInMenuComponent', () => {
  let component: LoggedInMenuComponent;
  let fixture: ComponentFixture<LoggedInMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoggedInMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoggedInMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
