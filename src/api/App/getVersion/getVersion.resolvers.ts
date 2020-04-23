const pkg = require('../../../../package.json');

export default {
  Query: {
    getVersion: (): string => {
      console.log('Version', pkg.version);
      return pkg.version;
    }
  }
}
