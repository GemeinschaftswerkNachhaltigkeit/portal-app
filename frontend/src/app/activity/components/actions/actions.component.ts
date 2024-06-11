import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent {
  @Input() showPrevBtn = true;
  @Input() showNextBtn = true;
  @Input() last = false;
  @Input() finalStep = false;
  @Input() completedButtonText = '';
  @Input() updateButtonText = '';
  @Input() modification = false;

  @Output() completed = new EventEmitter();
  @Output() canceled = new EventEmitter();

  cancelHandler(): void {
    this.canceled.emit();
  }

  completedHandler(): void {
    this.completed.emit();
  }
}
