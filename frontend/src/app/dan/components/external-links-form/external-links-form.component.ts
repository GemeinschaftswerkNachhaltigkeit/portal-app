import { Component, Input, OnInit } from '@angular/core';
import { FormGroupDirective, FormGroup } from '@angular/forms';
import { SocialMediaType } from 'src/app/shared/models/social-media-type';

@Component({
  selector: 'app-external-links-form',
  templateUrl: './external-links-form.component.html',
  styleUrls: ['./external-links-form.component.scss']
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
