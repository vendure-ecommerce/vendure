# Solution for E2E Test Output Directory Configuration

This README describes the problem that has been solved regarding the output directory configuration for end-to-end (E2E) tests, and how to verify the solution using a specific command.

## Problem Solved

Previously, the output directory path for E2E tests was hard-coded in the test configuration scripts. This made it difficult to run E2E tests in projects with different monorepo structures, where the standard output path was not valid.

## Solution

The configuration has been modified so that the output directory path (`outDir`) is read directly from the `e2e-common/tsconfig.e2e.json` file. This was achieved by creating a `globalSetup` script for Vitest, which is responsible for reading and setting the correct path before the tests are run.

## Solution Verification

To verify that the solution works correctly, you can run the E2E tests for the `@vendure/core` package using the following command:

```bash
npm run e2e -- --scope=@vendure/core
```
