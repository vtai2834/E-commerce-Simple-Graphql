const { genUrlSvc } = require("./utils/url.utils");

const SERVICE_NAMES = ["patient", "physician", "facility", "careplan", "authen"];

const subgraphs = SERVICE_NAMES.map(name => {
  const url = genUrlSvc(name);

  if (!url) {
    throw new Error(
      `Missing subgraph URL for '${name}'. 
       Please set either ${name.toUpperCase()}_URL 
       or PORT_${name.toUpperCase()}.`
    );
  }
  return { name, url };
});

module.exports = { subgraphs };
