# Wpgwn App

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.0.4.

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

## Formatting

### Check formatting

`npm run format:check`

### Fix formatting for all files

`npm run format:fix`

## Linting

### Check for linting errors

`npm run lint`

### Fix linting errors

`npm run lint:fix`

## Validate code

Runs:

- linting
- formatting
- builds app

`npm run validate`

# Modules

## Core Module

This module is imported only once in AppModule

Contains:

- singleton services -> services used in the whole application (Logging, Auth ...)
- singleton components -> components which are instanciated once but impact the application as a whole (Gloable App Layout, Main Menu and more)
- configuration
- exports of third party modules which are needed by the AppModule

## Shared Module

This module can be imported in multiple other feature modules which need functionality provided by the shared module.

Contains:

- Services, Directives, Components, Types ... which are reusable
- exports commonly used angular modules (like CommonModule)
