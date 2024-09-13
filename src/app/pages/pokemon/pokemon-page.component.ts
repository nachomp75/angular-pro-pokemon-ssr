import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Pokemon } from '../../pokemons/interfaces';
import { PokemonService } from '../../pokemons/services/pokemon.service';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'pokemon-page',
  standalone: true,
  imports: [],
  templateUrl: './pokemon-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PokemonPageComponent implements OnInit {
  private _pokemonService = inject(PokemonService);
  private _route = inject(ActivatedRoute);
  private _title = inject(Title);
  private _meta = inject(Meta);

  pokemon = signal<Pokemon | null>(null);

  ngOnInit(): void {
    const id = this._route.snapshot.paramMap.get('id');
    if (!id) return;

    this._pokemonService
      .loadPokemon(id)
      .pipe(
        tap(({ name, id }) => {
          const pageTitle = `#${id} - ${name}`;
          const pageDescription = `${name}'s page`;

          this._title.setTitle(pageTitle);
          this._meta.updateTag({
            name: 'description',
            content: pageDescription,
          });
          this._meta.updateTag({ name: 'og:title', content: pageTitle });
          this._meta.updateTag({
            name: 'og:description',
            content: pageDescription,
          });
          this._meta.updateTag({
            name: 'og:image',
            content: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
          });
        })
      )
      .subscribe(this.pokemon.set);
  }
}
