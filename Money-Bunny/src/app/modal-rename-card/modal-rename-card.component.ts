import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-rename-card',
  templateUrl: './modal-rename-card.component.html',
  styleUrls: ['./modal-rename-card.component.css']
})
export class ModalRenameCardComponent implements OnInit {
  @Input() public name: string = '';
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  passBack() {
    this.passEntry.emit(this.name);
    this.activeModal.close(this.name);
  }
}
