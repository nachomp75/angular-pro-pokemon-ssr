import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'pricing-page',
  standalone: true,
  imports: [],
  templateUrl: './pricing-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PricingPageComponent implements OnInit {
  private _title = inject(Title);
  private _meta = inject(Meta);
  // private _platform = inject(PLATFORM_ID);

  ngOnInit(): void {
    // if (isPlatformBrowser(this._platform)) {
    //   document.title = 'Pricing page';
    // }

    this._title.setTitle('Pricing page');
    this._meta.updateTag({
      name: 'description',
      content: 'This is my Pricing page',
    });
    this._meta.updateTag({ name: 'og:title', content: 'Pricing page' });
    this._meta.updateTag({
      name: 'keywords',
      content: 'Pricing,Curso,Fernando,Herrera,Angular,PRO',
    });
  }
}
