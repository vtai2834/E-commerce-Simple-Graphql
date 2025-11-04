const _ = require('lodash');
const fs = require('fs');
const path = require('path');

// need to import in the correct order
const subDirs = [
  'directives', 'types', 'inputs', 'mutations', 'queries', 'responses',
];

const typeDefs = _.map(subDirs, subDir => {
  const schemaPath = path.join(__dirname, '../schemas', subDir);
  return fs.readdirSync(schemaPath).map(file => {
    // ignore file start with "__" or extension is not .graphql
    if (_.startsWith(file, '__') || !_.endsWith(file, '.graphql')) {
      return '';
    }
    // only read graphql file
    const filePath = path.join(schemaPath, file);
    return `${fs.readFileSync(filePath, 'utf8').toString()}`;
  });
});

module.exports = typeDefs;

