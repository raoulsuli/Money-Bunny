import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPersJurComponent } from './form-pers-jur.component';

describe('FormPersJurComponent', () => {
  let component: FormPersJurComponent;
  let fixture: ComponentFixture<FormPersJurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormPersJurComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormPersJurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
