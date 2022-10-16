const config = require("./config.json");
const server = require("./conn.js");
const modauth = require("./modauth.js");

async function main() {
    console.log(`Starting module: ${config.name}`);

    const token = await modauth.getSessionToken();
    console.debug("MODAUTH TOKEN:", token);

    server.connect(token);
    // Add module's main code here
}

main()