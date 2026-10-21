# SauceDemo QA automation

This project uses Cucumber to execute Gherkin feature files. TypeScript step definitions call reusable Playwright Page Object Model classes. The original Playwright Test specs are also kept and can be run separately.

## Install

From the project directory, install the dependencies and Chromium:

```bash
npm install
npx playwright install chromium
```

## Run scenarios and create the report

Run the Gherkin scenarios with visible Chromium:

```bash
npm run test:visible
```

`HEADLESS=false` is the default. The installed Cucumber 13 built-in HTML formatter writes a self-contained report from that same scenario run to `reports/cucumber-report.html`. It includes feature and scenario names, Given/When/Then steps, result status, durations, and failure details. The test command creates the `reports/` directory if it does not exist. The report is replaced by each subsequent Cucumber run and is generated even when a scenario fails.

Open the most recently generated report on macOS:

```bash
npm run report
```

Or open it directly:

```bash
open reports/cucumber-report.html
```

`npm run report:generate` runs the visible Cucumber suite and generates a fresh report. `npm test` and `npm run test:cucumber` also run Cucumber and generate the report. Cucumber is the runner for `.feature` files; Playwright Test is not used to execute Gherkin.

Run only the shopping-cart feature from IntelliJ's Terminal with:

```bash
npm run test:cucumber -- features/shoppingcart.feature
```

## IntelliJ IDEA feature-file runs

The Gherkin plugin provides `.feature` syntax recognition. IntelliJ also needs the **Cucumber.js** plugin to provide the feature-file Run actions and Cucumber.js run configuration. This IntelliJ installation has Gherkin and Cucumber for Java installed, but does not have Cucumber.js; until it is installed, use the Terminal command above or run the `test:cucumber` npm script from IntelliJ's npm tool window.

To enable in-editor runs, open **Settings | Plugins | Marketplace**, install **Cucumber.js** by JetBrains, and restart IDEA. Then either right-click a feature file and choose **Run `<feature name>`**, or create a configuration from **Run | Edit Configurations | + | Cucumber.js**. Set the feature file to `features/shoppingCart.feature`, the Node runtime to the project runtime, the Cucumber package to `node_modules/@cucumber/cucumber`, and the working directory to the project root. The existing `cucumber.js` supplies TypeScript loading, hooks, step definitions, report output, and default feature discovery.

## Failure screenshots and traces

When a scenario fails, its screenshot and Playwright trace are attached to the Cucumber HTML report when capture succeeds. The trace ZIP is also saved under `test-results/traces/`. Open a local trace with:

```bash
npx playwright show-trace test-results/traces/<trace-file>.zip
```

The failure details in the report preserve the original step error. A screenshot or trace capture problem is attached as an additional message instead of replacing the scenario failure.

## Configuration

Shared settings are in `config/test-config.ts`:

| Environment variable | Default | Purpose |
| --- | --- | --- |
| `BASE_URL` | `https://www.saucedemo.com` | Site under test |
| `HEADLESS` | `false` | Set to `true` to hide Chromium |
| `PARALLEL` | `false` | Sequential by default; `true` uses two workers, or provide a worker count such as `4` |
| `PARALLEL_WORKERS` | `2` | Worker count when `PARALLEL=true` |
| `TIMEOUT` | `30000` | Timeout in milliseconds |
| `SAUCEDEMO_USERNAME` | `standard_user` | Login username |
| `SAUCEDEMO_PASSWORD` | `secret_sauce` | Login password |
| `SAUCEDEMO_INVALID_PASSWORD` | `not_the_password` | Password used by the invalid-login scenario |

For example, use four isolated parallel scenario workers:

```bash
PARALLEL=4 npm run test:visible
```

Every scenario launches its own browser, context, and page, then closes them in the Cucumber hooks. Run `npm run typecheck` to check TypeScript. Run the preserved Playwright Test suite with `npm run test:playwright`.

## Troubleshooting

- If Chromium is missing, run `npx playwright install chromium` and retry.
- If visible Chromium cannot open, make sure macOS is in a logged-in desktop session. For a headless diagnostic run, use `HEADLESS=true npm run test:cucumber`.
- If a scenario fails, open `reports/cucumber-report.html` for its error, screenshot, and trace attachment. The raw trace ZIP is in `test-results/traces/`.
- If the report is missing, first run `npm run test:visible`; the report is created by the Cucumber formatter during that run.
- If SauceDemo cannot be reached, check the network and `BASE_URL`. You can set `TIMEOUT` in milliseconds for a slower environment.
