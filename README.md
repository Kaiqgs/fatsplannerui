# Fatsplannerui

- [X] fix bug where focused input shift+a stills open another modal;
- [X] fix compose-complex bug where last input does not correspond to last fuzzy search results;
- [ ] fix bug where shift+a opens add-nutrient(complex) in another add-nutrient;
- [ ] fix bug where shift+s submits addNutrient(non-complex) form;
- [X] #1 as dev: compress and split cache for reliable storage;
  - [X] deprecated due to Indexed DB
- [X] #1 as a dev: use reliable indexedDB for local storage
- [ ] #2 as a user: use delete button
  - [ ] .a delete for diary
  - [ ] .b delete for nutrientBank
- [ ] #3 as a user: use edit button
  - [ ] .a edit for diary
  - [ ] .b edit for nutrientBank
- [ ] #4 as a user: see sodium/fiber in macro-display
- [ ] #5 as a dev: hash ComplexNutrients, update hash in a backward propagation manner;
- [ ] #6 as a dev: export target to use macros-bar & secondary nutrient;


 

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.