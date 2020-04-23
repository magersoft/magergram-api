const pkg = require('../../../../package.json');

export default {
  Query: {
    getVersion: (): string => {
      return pkg.version;
    }
  }
}
