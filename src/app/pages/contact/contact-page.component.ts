import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'contact-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ContactPageComponent implements OnInit {
  private _title = inject(Title);
  private _meta = inject(Meta);

  ngOnInit(): void {
    this._title.setTitle('Contact page');
    this._meta.updateTag({
      name: 'description',
      content: 'This is my Contact page',
    });
    this._meta.updateTag({ name: 'og:title', content: 'Contact page' });
    this._meta.updateTag({
      name: 'keywords',
      content: 'Contact,Curso,Fernando,Herrera,Angular,PRO',
    });
  }
}
