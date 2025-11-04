const genUrlSvc = (name) => {
  const envUrl = process.env[`${name.toUpperCase()}_URL`];
  const envPort = process.env[`PORT_${name.toUpperCase()}`];

  const prefix = process.env.SUBGRAPH_PREFIX || "http://localhost";

  if (envUrl) return envUrl;
  if (envPort) return `${prefix}:${envPort}/graphql`;

  return undefined;
};

module.exports = { genUrlSvc };
