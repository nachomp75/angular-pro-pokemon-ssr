import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { PokeAPIResponse, SimplePokemon } from '../interfaces';
import { PokemonService } from './pokemon.service';
import { catchError } from 'rxjs';

const mockPokeAPIResponse: PokeAPIResponse = {
  count: 1302,
  next: 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20',
  previous: '',
  results: [
    {
      name: 'Bulbasaur',
      url: 'https://pokeapi.co/api/v2/pokemon/1/',
    },
    {
      name: 'Ivysaur',
      url: 'https://pokeapi.co/api/v2/pokemon/2/',
    },
  ],
};

const expectedPokemons: SimplePokemon[] = [
  { id: '1', name: 'Bulbasaur' },
  { id: '2', name: 'Ivysaur' },
];

const mockPokemon = {
  id: '1',
  name: 'Bulbasaur',
};

describe('PokemonService', () => {
  let service: PokemonService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(PokemonService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load a page of SimplePokemons', () => {
    service.loadPage(1).subscribe((pokemons) => {
      expect(pokemons).toEqual(expectedPokemons);
    });

    const req = httpMock.expectOne(
      `https://pokeapi.co/api/v2/pokemon?offset=0&limit=20`
    );

    expect(req.request.method).toBe('GET');

    req.flush(mockPokeAPIResponse);
  });

  it('should load page 5 of SimplePokemons', () => {
    service.loadPage(5).subscribe((pokemons) => {
      expect(pokemons).toEqual(expectedPokemons);
    });

    const req = httpMock.expectOne(
      `https://pokeapi.co/api/v2/pokemon?offset=80&limit=20`
    );

    expect(req.request.method).toBe('GET');

    req.flush(mockPokeAPIResponse);
  });

  it('should load a Pokemon by id', () => {
    service.loadPokemon('1').subscribe((pokemon) => {
      expect(pokemon.name).toEqual(mockPokemon.name);
    });

    const req = httpMock.expectOne(`https://pokeapi.co/api/v2/pokemon/1`);

    expect(req.request.method).toBe('GET');

    req.flush(mockPokemon);
  });

  it('should load a Pokemon by name', () => {
    service.loadPokemon('bulbasaur').subscribe((pokemon) => {
      expect(pokemon.name).toEqual(mockPokemon.name);
    });

    const req = httpMock.expectOne(
      `https://pokeapi.co/api/v2/pokemon/bulbasaur`
    );

    expect(req.request.method).toBe('GET');

    req.flush(mockPokemon);
  });

  it('should catch error if Pokemon not found', () => {
    const pokemonName = 'Unknown';

    service
      .loadPokemon(pokemonName)
      .pipe(
        catchError((err) => {
          expect(err.message).toContain('Pokemon not found');
          return [];
        })
      )
      .subscribe();

    const req = httpMock.expectOne(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
    );

    expect(req.request.method).toBe('GET');

    req.flush('Pokemon not found', { status: 404, statusText: 'Not Found' });
  });
});
