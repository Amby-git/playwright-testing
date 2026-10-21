"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const test_config_1 = require("./config/test-config");
exports.default = (0, test_1.defineConfig)({
    testDir: './tests',
    timeout: test_config_1.testConfig.timeout,
    fullyParallel: test_config_1.testConfig.parallel > 0,
    workers: test_config_1.testConfig.parallel > 0 ? test_config_1.testConfig.parallel : 1,
    reporter: [['html', { open: 'never' }]],
    use: {
        baseURL: test_config_1.testConfig.baseURL,
        browserName: 'chromium',
        headless: test_config_1.testConfig.headless,
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...test_1.devices['Desktop Chrome'] },
        },
    ],
});
//# sourceMappingURL=playwright.config.js.map