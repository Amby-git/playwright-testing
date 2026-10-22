# Playwright Testing

End-to-end tests for [SauceDemo](https://www.saucedemo.com/) using Playwright and Cucumber. The project includes Gherkin scenarios under `features/` and Playwright specs under `tests/ui/`.

## Requirements

- Node.js and npm
- A network connection to the configured application (`https://www.saucedemo.com` by default)

## Setup

```sh
npm install
npx playwright install chromium
```

## Run tests

Run the Cucumber scenarios (the default):

```sh
npm test
```

Run the Playwright specs:

```sh
npm run test:playwright
```

Run Playwright with a visible browser:

```sh
npm run test:headed
```

Other useful commands:

```sh
npm run test:tagged       # Cucumber scenarios tagged @test
npm run test:visible      # Tagged Cucumber scenarios with a visible browser
npm run typecheck         # TypeScript type check
```

To run one Cucumber feature, pass its path to the Cucumber CLI:

```sh
npx cucumber-js features/login.feature
```

To filter Cucumber scenarios by name:

```sh
npm run test:scenario -- "Successful login"
```

### Combine test selections

Cucumber accepts tag expressions, feature paths, and scenario names together. These examples run different useful subsets:

```sh
# Run all features tagged @test (same as npm run test:tagged)
npx cucumber-js --tags "@test"

# Run only login scenarios
npx cucumber-js features/login.feature

# Run tagged shopping scenarios
npx cucumber-js features/shoppingCart.feature --tags "@test"

# Run a named scenario from the checkout feature
npx cucumber-js features/checkout.feature --name "Successful purchase"

# Combine several features with a tag expression
npx cucumber-js features/login.feature features/shoppingCart.feature --tags "@test and not @slow"

# Run a visible browser, tagged scenarios, and two workers
HEADLESS=false PARALLEL=2 npx cucumber-js --tags "@test"
```

Tag expressions support `and`, `or`, and `not`; add tags such as `@smoke`, `@regression`, or `@slow` above a scenario to create reusable suites. Keep tags meaningful and apply them consistently. For Playwright, filter by file, title, or project:

```sh
npx playwright test tests/ui/login.spec.ts
npx playwright test --grep "cart"
npx playwright test --project=chromium
```

### Create another test

For a Cucumber test, add a scenario to the relevant `.feature` file and implement any new Given/When/Then steps in `step-definitions/`. Reuse existing steps and page objects where possible. A `Scenario Outline` plus an `Examples` table is useful when the same behavior should be checked with several inputs. The sorting checks in `features/shoppingCart.feature` show this pattern:

```gherkin
@test
Scenario Outline: Products can be sorted by name
  Given I am logged in as the standard user
  When I sort products by name from "<direction>"
  Then products should be sorted by name from "<direction>"

  Examples:
    | direction |
    | A to Z    |
    | Z to A    |
```

Each examples row runs as its own scenario. Add a new Playwright test in `tests/ui/` with a `.spec.ts` suffix, use the `test` and `expect` APIs, and prefer accessible locators such as `getByRole` and `getByText`. Use the shared `authenticatedPage` fixture from `tests/fixtures/test.ts` when a test needs an already logged-in user; use `page` from `@playwright/test` for login coverage. Keep each test independent so it can run alone or in parallel.

For example, a focused Playwright test can verify that adding a product changes the cart badge:

```ts
import { test, expect } from '../fixtures/test';

test('cart badge updates after adding a product', async ({ authenticatedPage }) => {
  const backpack = authenticatedPage
    .locator('.inventory_item')
    .filter({ has: authenticatedPage.getByText('Sauce Labs Backpack', { exact: true }) });

  await backpack.getByRole('button', { name: 'Add to cart' }).click();
  await expect(authenticatedPage.locator('.shopping_cart_badge')).toHaveText('1');
});
```

For additional guidance, see the [Playwright best practices](https://playwright.dev/docs/best-practices), [parameterized tests](https://playwright.dev/docs/test-parameterize), and [test projects](https://playwright.dev/docs/test-projects). Public examples I reviewed include a [Playwright + Cucumber TypeScript SauceDemo project](https://github.com/cosminCirstea/demo.playwright.ts.cuke) and a [layered Playwright/Cucumber framework](https://github.com/vladimirTarasencoo/playwright-cucumber-bdd). The examples here follow the patterns relevant to this repository: Gherkin scenarios, page objects, data-driven examples, and independently runnable browser tests.

## Configuration

Configuration is read from environment variables in `config/test-config.ts`:

| Variable | Default | Purpose |
| --- | --- | --- |
| `BASE_URL` | `https://www.saucedemo.com` | Application URL |
| `HEADLESS` | `true` | Run without a visible browser (`false` shows the browser) |
| `PARALLEL` | `0` (off) | Cucumber workers; set to a number, or `true` for the worker count below |
| `PARALLEL_WORKERS` | `2` | Worker count when `PARALLEL=true` |
| `TIMEOUT` | `30000` | Test timeout in milliseconds |
| `SAUCEDEMO_USERNAME` | `standard_user` | Valid login username |
| `SAUCEDEMO_PASSWORD` | `secret_sauce` | Valid login password |
| `SAUCEDEMO_INVALID_USERNAME` | `not_the_username` | Username used in invalid-login scenarios |
| `SAUCEDEMO_INVALID_PASSWORD` | `not_the_password` | Password used in invalid-login scenarios |

Example:

```sh
HEADLESS=false PARALLEL=2 npm test 
```

## Reports

Cucumber writes an HTML report to `reports/cucumber-report.html`. Playwright writes its HTML report to `playwright-report/`.

```sh
npm run report             # Open the Cucumber report
npm run report:playwright  # Open the Playwright report
```

## Project layout

- `features/` — Gherkin feature files
- `step-definitions/` — Cucumber step implementations
- `support/` — Cucumber hooks, world, and logger
- `pages/` — Page Object Model classes
- `tests/ui/` — Playwright test specs
- `config/` — Shared test configuration
- `cucumber.js` and `playwright.config.ts` — Test runner configuration
