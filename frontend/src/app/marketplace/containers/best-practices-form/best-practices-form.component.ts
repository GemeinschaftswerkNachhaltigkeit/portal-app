import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  NgForm,
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil, debounceTime } from 'rxjs';
import {
  ContactControlsComponent,
  defaultContactGroupFields
} from 'src/app/shared/components/form/contact-controls/contact-controls.component';
import { urlPattern } from 'src/app/shared/components/validator/url.validator';
import { wysiwygContentRequired } from 'src/app/shared/components/validator/wysiwyg-content-required.validator';
import { DropzoneService } from 'src/app/shared/services/dropzone.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { BestPracticesCategories } from '../../models/best-practices-categories';
import { BestPracticesWipDto } from '../../models/best-practices-wip-dto';
import { environment } from 'src/environments/environment';
import { MimeTypeEnum } from 'src/app/shared/models/mimetype';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { CommonModule } from '@angular/common';
import { PageWithHeaderLayoutComponent } from 'src/app/shared/components/layout/page-with-header-layout.component';
import { MatButtonModule } from '@angular/material/button';
import { FormSectionListComponent } from '../../components/form-section-list.component';
import { FormSectionComponent } from '../../components/form-section.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { LoadingIndicatorComponent } from 'src/app/shared/components/base/loading-indicator.component';
import { UploadImageComponent } from 'src/app/shared/components/form/upload-image/upload-image.component';
import { ContentWrapperComponent } from 'src/app/shared/components/layout/content-wrapper.component';
import { TranslateModule } from '@ngx-translate/core';
import { ContentControlsComponent } from '../../components/content-controls.component';
import { ThematicFocusControlComponent } from 'src/app/shared/components/form/thematic-focus-control.component';
import { CategoryControlComponent } from 'src/app/shared/components/form/category-control.component';
import { AuthService } from 'src/app/auth/services/auth.service';
import { BestPracticeFormService } from '../../best-practice-form.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { SpinnerComponent } from 'src/app/shared/components/base/spinner.component';

@Component({
  selector: 'app-best-practices-form',
  standalone: true,
  imports: [
    CommonModule,
    PageWithHeaderLayoutComponent,
    MatButtonModule,
    FormSectionListComponent,
    FormSectionComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    LoadingIndicatorComponent,
    UploadImageComponent,
    ContactControlsComponent,
    ContentWrapperComponent,
    TranslateModule,
    ContentControlsComponent,
    ThematicFocusControlComponent,
    CategoryControlComponent,
    SpinnerComponent
  ],
  templateUrl: './best-practices-form.component.html',
  styleUrls: ['./best-practices-form.component.scss']
})
export class BestPracticesFormComponent implements OnInit, OnDestroy {
  @ViewChild('form') form!: NgForm;

  public dzService = inject(DropzoneService);
  private bestPracticeFormService = inject(BestPracticeFormService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private auth = inject(AuthService);
  private utils = inject(UtilsService);

  categories = Object.keys(BestPracticesCategories).map((key) => ({
    key,
    label: `marketplace.labels.${key}`
  }));

  formGroup: FormGroup;
  unsubscribe$ = new Subject();
  debounce$ = new Subject();
  loading = this.bestPracticeFormService.loading;
  bestPracticeWip = this.bestPracticeFormService.bestPracticeWip;
  orgId: number | null = null;
  uuid: string | null = null;
  token = this.bestPracticeFormService.token;
  isModification = false;
  image = '';

  constructor(fb: FormBuilder) {
    this.handleIntialValues();
    this.formGroup = fb.group({
      bestPractiseCategory: fb.control<string>('SUSTAINABILITY_REPORTING', {
        validators: [Validators.required]
      }),
      thematicFocus: fb.control<string[]>([], [Validators.required]),
      content: fb.group({
        name: fb.control<string>('', [
          Validators.required,
          Validators.maxLength(100)
        ]),
        description: fb.control<string>('', [
          Validators.required,
          wysiwygContentRequired(100, 1500)
        ]),
        url: fb.control<string>('', [Validators.maxLength(1000), urlPattern()])
      }),
      contact: fb.group(defaultContactGroupFields)
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    const routeParams = this.route.snapshot.params;
    this.orgId = routeParams['orgId'];
    this.uuid = routeParams['uuid'];
    this.isModification = this.route.snapshot.queryParams['edit'] === 'true';
    this.handleSaveOnChange();
    this.loadExistingBestPracticeWip();
  }

  getImageUploadConfig(
    orgId: number,
    uuid: string
  ): DropzoneConfigInterface & { disablePreviews: boolean } {
    return {
      clickable: true,
      maxFiles: 1,
      autoReset: 1,
      errorReset: 1,
      cancelReset: null,
      url: `${environment.apiUrl}/${this.getUploadEndpoint(orgId, uuid)}`,
      method: 'put',
      maxFilesize: 1048576,
      disablePreviews: true,
      acceptedFiles: [MimeTypeEnum.Image_Jpeg, MimeTypeEnum.Image_Png].join(
        ','
      ),
      headers: {
        Authorization: `Bearer ${this.auth.getAccessToken()}`
      }
    };
  }

  getUploadEndpoint(orgId: number, uuid: string): string {
    return `organisations/${orgId}/marketplace-wip/best-practise/${uuid}/image`;
  }

  handleDelteImage(): void {
    if (this.orgId && this.uuid) {
      this.bestPracticeFormService.deleteImage(this.orgId, this.uuid);
    }
  }

  handleSave(): void {
    if (this.orgId && this.uuid && this.form.dirty) {
      this.bestPracticeFormService.saveBestPracticesWip(
        this.orgId,
        this.uuid,
        this.getPayload()
      );
    }
  }

  handleSubmit(): void {
    if (this.formGroup.invalid && this.form?.submitted) {
      this.formGroup.markAllAsTouched();
    } else {
      if (this.orgId && this.uuid) {
        this.bestPracticeFormService.releaseBestPracticesWip(
          this.orgId,
          this.uuid,
          this.getPayload()
        );
        this.goBackToBestPracticeList();
      }
    }
  }

  handleCancelation(): void {
    this.goBackToBestPracticeList();
  }

  private goBackToBestPracticeList(): void {
    this.router.navigate(['/account/best-practices']);
  }

  private getPayload(): BestPracticesWipDto {
    const values = this.formGroup.value;
    const payload: BestPracticesWipDto = {
      bestPractiseCategory: values.bestPractiseCategory,
      name: values.content.name || '',
      description: values.content.description || '',
      contact: values.contact,
      location: {
        address: {},
        url: values.content.url
      },
      thematicFocus: values.thematicFocus
    };
    return payload;
  }

  private handleSaveOnChange(): void {
    this.formGroup.valueChanges
      .pipe(debounceTime(500), takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.handleSave();
      });
  }

  private handleIntialValues(): void {
    toObservable(this.bestPracticeWip)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((wipDto: BestPracticesWipDto | null) => {
        if (wipDto) {
          this.initalizeForm(wipDto);
        }
      });
  }

  private loadExistingBestPracticeWip(): void {
    if (this.orgId && this.uuid) {
      this.bestPracticeFormService.getBestPracticesWip(this.orgId, this.uuid);
    }
  }

  private initalizeForm(wipDto: BestPracticesWipDto): void {
    const formData = {
      bestPractiseCategory:
        wipDto.bestPractiseCategory ||
        BestPracticesCategories.SUSTAINABILITY_REPORTING,
      thematicFocus: wipDto.thematicFocus,
      content: {
        name: wipDto.name,
        description: wipDto.description,
        url: wipDto.location?.url
      },
      contact: wipDto.contact
    };
    this.image = wipDto.image || '';
    this.formGroup.patchValue(formData);

    if (this.formGroup.invalid && this.form?.submitted) {
      this.formGroup.markAllAsTouched();
    }
  }
}
