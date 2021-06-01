import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRenameCardComponent } from './modal-rename-card.component';

describe('ModalRenameCardComponent', () => {
  let component: ModalRenameCardComponent;
  let fixture: ComponentFixture<ModalRenameCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalRenameCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalRenameCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
