import type { GherkinDocument, PickleStep, TestStepResult } from '@cucumber/messages';
import { testConfig } from '../config/test-config';

const configuredSecrets = [
  testConfig.username,
  testConfig.password,
  testConfig.invalidUsername,
  testConfig.invalidPassword,
].filter((value) => value.length > 0);

export function logStepStarted(stepName: string): void {
  write(`[STEP START] ${stepName}`);
}

export function logStepFinished(stepName: string, result: TestStepResult): void {
  const status = result.status;
  const displayStatus = status === 'PASSED'
    ? 'PASS'
    : status === 'FAILED' || status === 'AMBIGUOUS' || status === 'UNDEFINED'
      ? 'FAIL'
      : status;

  write(`[STEP ${displayStatus}] ${stepName}`);

  if (displayStatus === 'FAIL') {
    const error = result.exception;
    if (error?.message) write(`[STEP ERROR] ${error.message}`);
    if (error?.stackTrace) write(`[STEP STACK] ${error.stackTrace}`);
    else if (result.message && result.message !== error?.message) write(`[STEP ERROR] ${result.message}`);
  }
}

export function logBusinessEvent(message: string): void {
  write(`[INFO] ${message}`);
}

export function formatStepName(document: GherkinDocument, pickleStep: PickleStep): string {
  const astNodeId = pickleStep.astNodeIds[0];
  const keyword = astNodeId ? findStepKeyword(document, astNodeId) : undefined;
  return `${keyword ?? ''}${pickleStep.text}`;
}

function findStepKeyword(document: GherkinDocument, astNodeId: string): string | undefined {
  const feature = document.feature;
  if (!feature) return undefined;

  for (const child of feature.children) {
    const featureSteps = child.background?.steps ?? child.scenario?.steps;
    const featureStep = featureSteps?.find((step) => step.id === astNodeId);
    if (featureStep) return featureStep.keyword;

    for (const ruleChild of child.rule?.children ?? []) {
      const ruleSteps = ruleChild.background?.steps ?? ruleChild.scenario?.steps;
      const ruleStep = ruleSteps?.find((step) => step.id === astNodeId);
      if (ruleStep) return ruleStep.keyword;
    }
  }

  return undefined;
}

function write(message: string): void {
  let safeMessage = message;
  for (const secret of configuredSecrets) {
    safeMessage = safeMessage.split(secret).join('[REDACTED]');
  }

  safeMessage = safeMessage
    .replace(/(\bcustomer details\s+)(?:"[^"]*"|'[^']*'|\S+)(?:\s+(?:"[^"]*"|'[^']*'|\S+)){2}/gi, '$1[REDACTED]')
    .replace(/(\b(?:access[_-]?token|refresh[_-]?token|token)\s*[=:]\s*)[^\s,;]+/gi, '$1[REDACTED]')
    .replace(/(\bauthorization\s*:\s*bearer\s+)[^\s,;]+/gi, '$1[REDACTED]');

  console.log(safeMessage);
}
