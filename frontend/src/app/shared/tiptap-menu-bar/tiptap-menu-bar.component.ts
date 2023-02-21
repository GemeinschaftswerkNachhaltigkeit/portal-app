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
}
