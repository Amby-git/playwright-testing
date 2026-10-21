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
