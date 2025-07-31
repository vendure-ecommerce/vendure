import fs from "fs";
import path from "path";

/**
 * A simple JSONC (JSON with comments) parser. It's not fully spec-compliant
 * but works for the tsconfig.json files used in this project.
 */
function parseJsonc(jsonString: string): any {
  const withoutComments = jsonString.replace(
    /\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm,
    "$1"
  );
  return JSON.parse(withoutComments);
}

/**
 * Reads and parses the tsconfig.e2e.json file to get its values.
 */
export function getE2eConfig() {
  const tsconfigPath = path.join(__dirname, "tsconfig.e2e.json");
  const tsconfigFile = fs.readFileSync(tsconfigPath, "utf-8");
  return parseJsonc(tsconfigFile);
}
