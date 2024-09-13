import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { PokeAPIResponse, Pokemon, SimplePokemon } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private _http = inject(HttpClient);

  loadPage(page: number): Observable<SimplePokemon[]> {
    if (page !== 0) --page;

    page = Math.max(0, page);

    return this._http
      .get<PokeAPIResponse>(
        `https://pokeapi.co/api/v2/pokemon?offset=${page * 20}&limit=20`
      )
      .pipe(
        map((res) => {
          const simplePokemons: SimplePokemon[] = res.results.map(
            ({ url, name }) => ({
              id: url.split('/').at(-2) ?? '',
              name: name,
            })
          );

          return simplePokemons;
        })
      );
  }

  loadPokemon(id: string) {
    return this._http.get<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${id}`);
  }
}
