"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConfig = void 0;
function readBoolean(name, fallback) {
    const value = process.env[name]?.trim().toLowerCase();
    if (value === undefined || value === '')
        return fallback;
    return value === 'true' || value === '1' || value === 'yes';
}
function readParallelWorkers() {
    const value = process.env.PARALLEL?.trim().toLowerCase();
    if (value === undefined || value === '' || value === 'false' || value === '0')
        return 0;
    if (value === 'true')
        return Number(process.env.PARALLEL_WORKERS) || 2;
    const workers = Number(value);
    if (!Number.isInteger(workers) || workers < 0) {
        throw new Error('PARALLEL must be false, true, or a non-negative worker count.');
    }
    return workers;
}
exports.testConfig = {
    baseURL: process.env.BASE_URL ?? 'https://www.saucedemo.com',
    headless: readBoolean('HEADLESS', true),
    parallel: readParallelWorkers(),
    timeout: Number(process.env.TIMEOUT) || 30_000,
    username: process.env.SAUCEDEMO_USERNAME ?? 'standard_user',
    password: process.env.SAUCEDEMO_PASSWORD ?? 'secret_sauce',
    invalidPassword: process.env.SAUCEDEMO_INVALID_PASSWORD ?? 'not_the_password',
    invalidUsername: process.env.SAUCEDEMO_INVALID_USERNAME ?? 'not_the_username',
};
//# sourceMappingURL=test-config.js.map