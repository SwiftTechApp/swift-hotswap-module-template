const fetch = require("node-fetch");
const config = require("./config.json");

async function getSessionToken() {
    console.log("Requesting modauth token from remote server");
    try {
        const req = await fetch("https://modules.swifttech.app/generateModuleAuth", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                modname: config.name,
                modid: config.id,
                modperms: config.permissions
            })
        });
        const res = req.json();
        if (res.error) {
            console.error("Failed to fetch token from remote server, error:", res.message);
            return undefined
        }
        return res.token
    } catch (e) {
        console.error("Failed to fetch token from remote server, error:", e);
    }
}

module.exports = {
    getSessionToken: getSessionToken
}