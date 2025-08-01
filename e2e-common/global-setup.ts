import { rimraf } from "rimraf";
import path from "path";
import { getE2eConfig } from "./e2e-config-utils";

/**
 * Global setup for e2e tests.
 * This function is called once before all tests are run.
 * It is responsible for cleaning up the test output directory
 * based on the `outDir` path specified in `tsconfig.e2e.json`.
 */
export async function setup() {
  const { compilerOptions } = getE2eConfig();
  const outDir = path.resolve(__dirname, compilerOptions.outDir);
  await rimraf(outDir);
}
