import packageJson from '../../../../package.json';

export default {
  Query: {
    getVersion: () => {
      return packageJson.version;
    }
  }
}
