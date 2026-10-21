
const { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } = require('node:fs');
const path = require('node:path');

mkdirSync(path.resolve(__dirname, 'reports'), { recursive: true });
// Typecheck through the npm script; at runtime prefer TypeScript sources over
// stale JavaScript build artifacts for extensionless imports.
require('ts-node').register({ preferTsExts: true, transpileOnly: true });

const { testConfig } = require('./config/test-config');

const sensitiveValues = [testConfig.username, testConfig.password, testConfig.invalidPassword]
  .filter((value) => typeof value === 'string' && value.length > 0);

function collectFeatureValues(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      collectFeatureValues(entryPath);
    } else if (entry.isFile() && entry.name.endsWith('.feature')) {
      const source = readFileSync(entryPath, 'utf8');
      const credentialPattern = /\b(?:user[\s_-]*name|password)\s+(['"])(.*?)\1/gi;
      const customerPattern = /customer details\s+(?:\\?["'])([^"'\\]*)(?:\\?["'])\s+(?:\\?["'])([^"'\\]*)(?:\\?["'])\s+(?:\\?["'])([^"'\\]*)(?:\\?["'])/gi;
      for (const match of source.matchAll(credentialPattern)) {
        if (match[2]) sensitiveValues.push(match[2]);
      }
      for (const match of source.matchAll(customerPattern)) {
        sensitiveValues.push(...match.slice(1).filter(Boolean));
      }
    }
  }
}

collectFeatureValues(path.resolve(__dirname, 'features'));

function redactSensitiveText(value) {
  let redacted = value
    .replace(/(\busername\s+)(['"])[^'"]*\2/gi, '$1$2[REDACTED]$2')
    .replace(/(\bpassword\s+)(['"])[^'"]*\2/gi, '$1$2[REDACTED]$2')
    .replace(/(customer details\s+)(\\?["'])([^"'\\]*)(\\?["'])\s+(\\?["'])([^"'\\]*)(\\?["'])\s+(\\?["'])([^"'\\]*)(\\?["'])/gi,
      '$1$2[REDACTED]$4 $5[REDACTED]$7 $8[REDACTED]$10');

  for (const sensitiveValue of sensitiveValues) {
    redacted = redacted.split(sensitiveValue).join('[REDACTED]');
  }
  return redacted;
}

for (const stream of [process.stdout, process.stderr]) {
  const write = stream.write.bind(stream);
  stream.write = (chunk, encoding, callback) => {
    if (typeof chunk === 'string') chunk = redactSensitiveText(chunk);
    else if (Buffer.isBuffer(chunk)) chunk = Buffer.from(redactSensitiveText(chunk.toString('utf8')));
    return typeof encoding === 'function'
      ? write(chunk, encoding)
      : write(chunk, encoding, callback);
  };
}

process.once('beforeExit', () => {
  const reportPath = path.resolve(__dirname, 'reports/cucumber-report.html');
  if (existsSync(reportPath)) {
    writeFileSync(reportPath, redactSensitiveText(readFileSync(reportPath, 'utf8')));
  }
});

module.exports = {
  default: {
    require: [
      'support/**/*.ts',
      'step-definitions/**/*.ts'
    ],
    format: [
      'progress',
      'html:reports/cucumber-report.html'
    ],
    backtrace: true,
    parallel: testConfig.parallel,
    publishQuiet: true
  }
};
