import { Component, Input } from '@angular/core';
import { Editor } from '@tiptap/core';

@Component({
  selector: 'app-tiptap-menu-bar',
  templateUrl: './tiptap-menu-bar.component.html',
  styleUrls: ['./tiptap-menu-bar.component.scss']
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
