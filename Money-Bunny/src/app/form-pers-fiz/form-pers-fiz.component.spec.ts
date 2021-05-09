import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPersFizComponent } from './form-pers-fiz.component';

describe('FormPersFizComponent', () => {
  let component: FormPersFizComponent;
  let fixture: ComponentFixture<FormPersFizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormPersFizComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormPersFizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
