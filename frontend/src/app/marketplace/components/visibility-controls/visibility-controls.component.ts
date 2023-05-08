import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-visibility-controls',
  templateUrl: './visibility-controls.component.html',
  styleUrls: ['./visibility-controls.component.scss']
})
export class VisibilityControlsComponent implements OnInit, OnDestroy {
  @Input() formGroupName!: string;
  form!: FormGroup;
  unsubscribe = new Subject();

  constructor(private rootFormGroup: FormGroupDirective) {}

  handleVisibilityChange(): void {
    this.form
      .get('featured')
      ?.valueChanges.pipe(takeUntil(this.unsubscribe))
      .subscribe((val) => {
        if (!val) {
          this.form.get('featuredText')?.setValue(null);
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next(null);
    this.unsubscribe.complete();
  }

  ngOnInit(): void {
    this.form = this.rootFormGroup.control.get(this.formGroupName) as FormGroup;
    this.handleVisibilityChange();
  }
}
