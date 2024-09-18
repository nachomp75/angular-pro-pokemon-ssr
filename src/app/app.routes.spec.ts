import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { routes } from './app.routes';
import { Location } from '@angular/common';

describe('App routes', () => {
  let router: Router;
  let location: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes)],
    });

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });

  it('should navigate to "about"', async () => {
    await router.navigate(['about']);

    expect(location.path()).toBe('/about');
  });

  it('should navigate to "pokemons/page/1"', async () => {
    await router.navigate(['pokemons/page/1']);

    expect(location.path()).toBe('/pokemons/page/1');
  });

  it('should redirect to "about" when the page is unknow', async () => {
    await router.navigate(['unknown-page']);

    expect(location.path()).toBe('/about');
  });

  it('should load the proper component', async () => {
    const aboutRoute = routes.find(({ path }) => path === 'about')!;
    expect(aboutRoute).toBeDefined();
    const aboutComponent = (await aboutRoute.loadComponent!()) as any;
    expect(aboutComponent.default.name).toBe('AboutPageComponent');

    const pokemonsPageRoute = routes.find(
      ({ path }) => path === 'pokemons/page/:page'
    )!;
    expect(pokemonsPageRoute).toBeDefined();
    const pokemonsPageComponent =
      (await pokemonsPageRoute.loadComponent!()) as any;
    expect(pokemonsPageComponent.default.name).toBe('PokemonsPageComponent');
  });
});
