import { Component } from '@angular/core';

export type Breadcrumb = {
  path: (string | number)[];
  name: string;
};

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent {}
