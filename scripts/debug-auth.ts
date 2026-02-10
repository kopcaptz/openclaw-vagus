import { loadConfig } from "../src/config/config.js";
import { resolveGatewayAuth, authorizeGatewayConnect } from "../src/gateway/auth.js";
import process from "node:process";

async function main() {
  console.log("--- OpenClaw Auth Debugger ---");

  const envToken = process.env.OPENCLAW_GATEWAY_TOKEN;
  console.log(`Environment OPENCLAW_GATEWAY_TOKEN: ${envToken ? "SET (length " + envToken.length + ")" : "NOT SET"}`);

  try {
    const config = loadConfig();
    console.log("Config loaded successfully.");

    const auth = resolveGatewayAuth({ authConfig: config.gateway?.auth });
    console.log(`Resolved Auth Mode: ${auth.mode}`);
    console.log(`Resolved Token: ${auth.token ? "SET (length " + auth.token.length + ")" : "NOT SET"}`);

    if (process.argv[2]) {
        const testToken = process.argv[2];
        console.log(`\nTesting against provided token: "${testToken}"`);

        const result = await authorizeGatewayConnect({
            auth,
            connectAuth: { token: testToken, password: testToken }, // check both
        });

        if (result.ok) {
            console.log("SUCCESS: Token is valid.");
        } else {
            console.log(`FAILURE: Token rejected. Reason: ${result.reason}`);
        }
    } else {
        console.log("\nUsage: npx tsx scripts/debug-auth.ts <token-to-test>");
    }

  } catch (err) {
    console.error("Failed to load config:", err);
  }
}

main();
