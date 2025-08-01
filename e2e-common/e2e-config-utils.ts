import fs from "fs";
import path from "path";
import * as jsonc from 'jsonc-parser';

/**
 * Reads and parses the tsconfig.e2e.json file to get its values.
 */
export function getE2eConfig() {
  const tsconfigPath = path.join(__dirname, "tsconfig.e2e.json");
  const tsconfigFile = fs.readFileSync(tsconfigPath, "utf-8");
  // Using a dedicated library is safer than a custom regex against ReDoS attacks,
  // which was being flagged as a security hotspot by Sonar.
  return jsonc.parse(tsconfigFile);
}
