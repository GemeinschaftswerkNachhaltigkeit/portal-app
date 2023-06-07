import { Injectable } from '@angular/core';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';

@Injectable({
  providedIn: 'root'
})
export class WysiwygService {
  htmlDecode(inp: string | undefined): string {
    if (inp) {
      const replacements: Record<string, string> = {
        '&lt;': '<',
        '&gt;': '>',
        '&sol;': '/',
        '&quot;': '"',
        '&apos;': "'",
        '&amp;': '&',
        '&laquo;': '«',
        '&raquo;': '»',
        '&nbsp;': ' ',
        '&copy;': '©',
        '&reg;': '®',
        '&deg;': '°'
      };
      for (const r in replacements) {
        inp = inp.replace(new RegExp(r, 'g'), replacements[r]);
      }
      return inp.replace(/&#(\d+);/g, function (match, dec) {
        return String.fromCharCode(dec);
      });
    } else {
      return '';
    }
  }

  getTipTapConfig(placeholder = '') {
    return new Editor({
      extensions: [
        StarterKit,
        Underline,
        Strike,
        BulletList,
        OrderedList,
        ListItem,
        Link.configure({
          openOnClick: false
        }),
        Placeholder.configure({
          emptyEditorClass: 'is-editor-empty',
          placeholder
        })
      ],
      editorProps: {
        attributes: {
          class: 'wysiwyg-editor'
        }
      },
      editable: true,
      injectCSS: false
    });
  }

  getSummaryText(htmlContent: string, maxLength = 140) {
    const editor = this.getTipTapConfig();
    editor.commands.setContent(htmlContent);
    return editor.getText().substr(0, maxLength);
  }
}
