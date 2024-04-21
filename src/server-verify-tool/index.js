const ping = require("ping");
const { Client } = require("ssh2");
const axios = require("axios");
const {
  getSSHKeyFromDatabase,
} = require("../utils/ssh-key-generator");

function checkBlockStatusInIran(
  ip,
  nodes = [
    "ir1.node.check-host.net",
    "ir3.node.check-host.net",
    "ir5.node.check-host.net",
    "ir6.node.check-host.net",
  ]
) {
  return new Promise(async (resolve, reject) => {
    for (let node of nodes) {
      try {
        const checkResponse = await axios.get(
          `https://check-host.net/check-ping?host=${ip}&node=${node}`,
          {
            headers: { Accept: "application/json" },
          }
        );

        const requestId = checkResponse.data.request_id;

        // Wait and poll for the results
        let result;
        for (let i = 0; i < 10; i++) {
          await new Promise((resolve) => setTimeout(resolve, 20000));

          const resultResponse = await axios.get(
            `https://check-host.net/check-result/${requestId}`,
            {
              headers: { Accept: "application/json" },
            }
          );

          if (resultResponse.data) {
            result = resultResponse.data;
            break;
          }
        }

        // If the ping check was not successful, reject the promise
        if (
          !result ||
          !Array.isArray(result[node]) ||
          !result[node].some((subArray) =>
            subArray.some((item) => item[0] === "OK")
          )
        ) {
          reject(`IP ${ip} has been rejected.`);
        } else {
          resolve(`IP ${ip} has been accepted.`);
        }
      } catch (error) {
        reject("Error performing ping check: " + error);
        return; // stop further processing
      }
    }

    // If all ping checks were successful, resolve the promise
    resolve(true);
  });
}

const verifyServer = async (server) => {
  try {
    const { ServerIP, SSH_Password, SSHKeyID } = server;
    const userName = "root"; // replace with actual username if it's not always 'root'

    const sshKey = await getSSHKeyFromDatabase(SSHKeyID);
    // Check if the server is up

    const isAlive = await ping.promise.probe(ServerIP);

    if (!isAlive.alive) {
      throw new Error("Server is down or not reachable.");
    }

    // Check if we can connect via SSH
    const client = new Client();
    return new Promise((resolve, reject) => {
      client
        .on("ready", () => {
          client.end();
          resolve(true);
        })
        .on("error", (err) => {
          reject(err);
        })
        .connect({
          host: ServerIP,
          port: 22,
          username: userName,
          password: SSH_Password,
          privateKey: sshKey.privateKey,
        });
    });
  } catch (e) {
    throw new Error(`Error verifying server: ${e}`);
  }
};

const verifyAndCheckBlockStatus = async ({
  ServerIP,
  SSH_Password,
  SSHKeyID,
}) => {
  console.log("Verifying server", ServerIP, SSH_Password, SSHKeyID);
  if (!ServerIP) throw new Error("ServerIP is required");
  if (!SSH_Password && !SSHKeyID)
    throw new Error("Either SSH_Password or SSHKey is required");

  try {
    // Verify server
    const serverIsUp = await verifyServer({ ServerIP, SSH_Password, SSHKeyID });

    if (!serverIsUp) {
      throw new Error("Server is down or not reachable via SSH.");
    }
    await checkBlockStatusInIran(ServerIP);

    console.log("Server is not blocked");
    return true; // Server is not blocked
  } catch (error) {
    if (
      error.message &&
      (error.message.includes("Server is down or not reachable via SSH.") ||
        error.message.includes("Timed out while waiting for handshake"))
    ) {
      throw new Error("Server is down or not reachable via SSH.");
    }
    throw new Error("Server is blocked", error);
  }
};

function isValidIP(ip) {
  const ipFormat =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ip.match(ipFormat);
}

function isValidUsername(username) {
  const usernameFormat = /^[a-zA-Z0-9_-]{2,30}$/;
  return username.match(usernameFormat);
}

async function validateSSHConnection(ip, username, password) {
  const conn = new Client();

  try {
    await new Promise((resolve, reject) => {
      conn.on("ready", resolve).on("error", reject).connect({
        host: ip,
        port: 22, // change to your SSH server's port if necessary
        username: username,
        password: password,
      });
    });
    conn.end();
    return true;
  } catch (error) {
    console.error("SSH connection error:", error);
    return false;
  }
}

exports.isValidIP = isValidIP;
exports.validateSSHConnection = validateSSHConnection;
exports.isValidUsername = isValidUsername;
exports.verifyAndCheckBlockStatus = verifyAndCheckBlockStatus;
exports.verifyServer = verifyServer;
exports.checkBlockStatusInIran = checkBlockStatusInIran;
