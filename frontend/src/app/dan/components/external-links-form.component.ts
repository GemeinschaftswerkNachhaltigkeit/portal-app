import { Component, Input, OnInit } from '@angular/core';
import {
  FormGroupDirective,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { FormFieldErrorComponent } from 'src/app/shared/components/form/form-field-error/form-field-error.component';
import { ValidCheckComponent } from 'src/app/shared/components/form/valid-check.component';
import { SocialMediaType } from 'src/app/shared/models/social-media-type';

@Component({
  selector: 'app-external-links-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    ValidCheckComponent,
    FormFieldErrorComponent,
    TranslateModule
  ],
  template: `
    <ng-container [formGroup]="form">
      <mat-form-field appearance="outline">
        <mat-label>{{ 'forms.labels.url' | translate }}</mat-label>
        <input
          matInput
          [placeholder]="'forms.labels.url' | translate"
          formControlName="url"
        />
        <app-valid-check [form]="form" controlName="url"></app-valid-check>
        <mat-error>
          <app-form-field-error
            [field]="form.get('url')"
          ></app-form-field-error>
        </mat-error>
      </mat-form-field>

      @for (type of socialMediaTypes; track type) {
        <mat-form-field appearance="outline">
          <mat-label>{{ 'forms.labels.' + type | translate }}</mat-label>
          <input
            matInput
            [placeholder]="'forms.labels.' + type | translate"
            [formControlName]="type"
          />
          <app-valid-check [form]="form" [controlName]="type"></app-valid-check>
          <mat-error>
            <app-form-field-error
              [field]="form.get(type)"
            ></app-form-field-error>
          </mat-error>
        </mat-form-field>
      }
    </ng-container>
  `,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;
  `
})
export class ExternalLinksFormComponent implements OnInit {
  @Input() formGroupName!: string;
  form!: FormGroup;
  socialMediaTypes = Object.values(SocialMediaType);

  constructor(private rootFormGroup: FormGroupDirective) {}

  ngOnInit(): void {
    this.form = this.rootFormGroup.control.get(this.formGroupName) as FormGroup;
  }
}
