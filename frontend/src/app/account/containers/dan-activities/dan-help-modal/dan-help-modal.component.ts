import { Component } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { AccountContentFacadeService } from 'src/app/account/account-content-facade.service';
import { MessageInputDialogComponent } from 'src/app/shared/components/message-input-dialog/message-input-dialog.component';

@Component({
  selector: 'app-dan-help-modal',
  templateUrl: './dan-help-modal.component.html',
  styleUrls: ['./dan-help-modal.component.scss'],
  providers: [AccountContentFacadeService]
})
export class DanHelpModalComponent {
  content$ = this.content.danHelpModal$;

  constructor(
    public dialogRef: MatDialogRef<MessageInputDialogComponent>,
    private content: AccountContentFacadeService
  ) {}

  close() {
    this.dialogRef.close();
  }
}
