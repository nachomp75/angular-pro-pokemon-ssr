import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { PokemonListComponent } from '../../pokemons/components/pokemon-list/pokemon-list.component';
import { SimplePokemon } from '../../pokemons/interfaces';
import { PokemonService } from '../../pokemons/services/pokemon.service';
import { PokemonListSkeletonComponent } from './ui/pokemon-list-skeleton/pokemon-list-skeleton.component';
import { map, tap } from 'rxjs';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'pokemons-page',
  standalone: true,
  imports: [PokemonListComponent, PokemonListSkeletonComponent],
  templateUrl: './pokemons-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PokemonsPageComponent implements OnInit {
  private _pokemonService = inject(PokemonService);
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  private _title = inject(Title);

  pokemons = signal<SimplePokemon[]>([]);
  readonly currentPage = toSignal<number>(
    this._route.queryParamMap.pipe(
      map((params) => params.get('page') ?? '1'),
      map((page) => (isNaN(+page) ? 1 : +page)),
      map((page) => Math.max(1, page))
    )
  );

  // isLoading = signal(true);

  // private _appRef = inject(ApplicationRef);
  // private $appState = this._appRef.isStable.subscribe((isStable) =>
  //   console.log({ isStable })
  // );

  ngOnInit(): void {
    this.loadPokemons();

    // setTimeout(() => {
    //   this.isLoading.set(false);
    // }, 5000);
  }

  // ngOnDestroy(): void {
  //   this.$appState.unsubscribe();
  // }

  loadPokemons(page = 0) {
    const pageToLoad = this.currentPage()! + page;
    this._pokemonService
      .loadPage(pageToLoad)
      .pipe(
        tap(() =>
          this._router.navigate([], { queryParams: { page: pageToLoad } })
        ),
        tap(() => this._title.setTitle(`Pokemons SSR - Page ${pageToLoad}`))
      )
      .subscribe(this.pokemons.set);
  }
}
