import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Editor } from '@tiptap/core';

@Component({
  selector: 'app-tiptap-menu-bar',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div *ngIf="editor !== undefined" class="wysiwig-toolbar">
      <!--disabled={!editor.can().liftListItem('listItem')}-->
      <label class="label">
        <ng-content></ng-content>
      </label>
      <div class="counter">
        <ng-content select="[counter]"></ng-content>
      </div>
      <ng-container *ngIf="!disabled">
        <!-- <button type="button" (click)="editor.chain().focus().liftListItem('listItem').run()">
      <mat-icon>format_indent_decrease</mat-icon>
    </button>
    <button type="button" (click)="editor.chain().focus().sinkListItem('listItem').run()">
      <mat-icon>format_indent_increase</mat-icon>
    </button> -->
        <button
          type="button"
          (click)="editor.chain().focus().toggleOrderedList().run()"
          [ngClass]="
            editor.isFocused && editor.isActive('orderedList') ? 'active' : ''
          "
        >
          <mat-icon>format_list_numbered</mat-icon>
        </button>
        <button
          type="button"
          (click)="editor.chain().focus().toggleBulletList().run()"
          [ngClass]="
            editor.isFocused && editor.isActive('bulletList') ? 'active' : ''
          "
        >
          <mat-icon>format_list_bulleted</mat-icon>
        </button>
        <button
          type="button"
          (click)="editor.chain().focus().toggleBold().run()"
          [ngClass]="
            editor.isFocused && editor.isActive('bold') ? 'active' : ''
          "
        >
          <mat-icon>format_bold</mat-icon>
        </button>
        <button
          type="button"
          (click)="editor.chain().focus().toggleItalic().run()"
          [ngClass]="
            editor.isFocused && editor.isActive('italic') ? 'active' : ''
          "
        >
          <mat-icon>format_italic</mat-icon>
        </button>
        <button
          type="button"
          (click)="handleLink()"
          [ngClass]="
            editor.isFocused && editor.isActive('link') ? 'active' : ''
          "
        >
          <mat-icon *ngIf="editor.isActive('link')">link</mat-icon>
          <mat-icon *ngIf="!editor.isActive('link')">add_link</mat-icon>
        </button>
        <button
          *ngIf="editor.isActive('link')"
          type="button"
          (click)="handleRemoveLink()"
          [ngClass]="
            editor.isFocused && editor.isActive('link') ? 'active' : ''
          "
        >
          <mat-icon>link_off</mat-icon>
        </button>
        <button
          type="button"
          (click)="editor.chain().focus().toggleUnderline().run()"
          [ngClass]="
            editor.isFocused && editor.isActive('underline') ? 'active' : ''
          "
        >
          <mat-icon>format_underlined</mat-icon>
        </button>
        <!--     <button type="button" (click)="editor.chain().focus().toggleStrike().run()">
      <mat-icon>format_strikethrough</mat-icon>
    </button> -->
      </ng-container>
      <ng-container *ngIf="disabled">
        <button type="button"><mat-icon></mat-icon></button
      ></ng-container>
    </div>
  `,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;
    @use '@angular/material' as mat;

    .wysiwig-toolbar {
      border: 1px solid mat.m2-get-color-from-palette($wpgwn-app-primary, 500);
      box-sizing: border-box;
      padding: 32px 6px 16px 6px !important;
      //border-radius: 4px;
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 0;
      display: flex;
      justify-content: flex-start;
      align-items: flex-end;
      position: relative;
      flex-wrap: wrap;

      @media screen and (min-width: $breakpoint-xs) {
        padding: 16px 16px 16px 16px !important;
      }

      .counter {
        position: absolute;
        bottom: 0rem;
        right: 1rem;
      }

      .label {
        position: absolute;
        left: 5px;
        top: -6px;
        padding: 0 5px;
        background-color: white;
        display: block;
        font-size: 1.1rem;
        line-height: 1.1rem;
        color: $blue-navy;
      }

      button {
        cursor: pointer;
        background: none;
        border: none;
        color: $blue-navy;

        &.active {
          color: $magenta;
        }

        //  padding: 3px 5px;
        //  margin-right: 15px;

        &:hover {
          color: mat.m2-get-color-from-palette(
            $wpgwn-app-primary,
            500
          ) !important;
        }
      }
    }

    .ng-invalid {
      .wysiwig-toolbar {
        border-color: mat.m2-get-color-from-palette($wpgwn-app-warn, 500);
      }
    }
  `
})
export class TiptapMenuBarComponent {
  @Input() editor: Editor | undefined = undefined;
  @Input() disabled = false;

  handleLink(): void {
    if (this.editor) {
      const prevUrl = this.editor.getAttributes('link')['href'];
      const url = window.prompt('URL', prevUrl);
      if (url === null) {
        return;
      }

      if (url === '') {
        this.editor.chain().focus().extendMarkRange('link').unsetLink().run();

        return;
      }

      this.editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url })
        .run();
    }
  }

  handleRemoveLink(): void {
    if (this.editor) {
      this.editor.chain().focus().extendMarkRange('link').unsetLink().run();
    }
  }
}
