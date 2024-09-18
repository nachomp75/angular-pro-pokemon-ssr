import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, tap } from 'rxjs';
import { PokemonListComponent } from '../../pokemons/components/pokemon-list/pokemon-list.component';
import { SimplePokemon } from '../../pokemons/interfaces';
import { PokemonService } from '../../pokemons/services/pokemon.service';
import { PokemonListSkeletonComponent } from './ui/pokemon-list-skeleton/pokemon-list-skeleton.component';

@Component({
  selector: 'pokemons-page',
  standalone: true,
  imports: [PokemonListComponent, PokemonListSkeletonComponent, RouterLink],
  templateUrl: './pokemons-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PokemonsPageComponent {
  private _pokemonService = inject(PokemonService);
  private _route = inject(ActivatedRoute);
  private _title = inject(Title);

  pokemons = signal<SimplePokemon[]>([]);
  readonly currentPage = toSignal<number>(
    this._route.params.pipe(
      map(({ page }) => page ?? '1'),
      map((page) => (isNaN(+page) ? 1 : +page)),
      map((page) => Math.max(1, page))
    )
  );

  loadOnPageChanged = effect(
    () => {
      this.loadPokemons(this.currentPage());
    },
    { allowSignalWrites: true }
  );

  loadPokemons(page = 0) {
    this._pokemonService
      .loadPage(page)
      .pipe(tap(() => this._title.setTitle(`Pokemons SSR - Page ${page}`)))
      .subscribe(this.pokemons.set);
  }
}
