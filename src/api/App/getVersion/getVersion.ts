// @ts-ignore
import * as packageJson from '../../../../package.json';

export default {
  Query: {
    getVersion: (): string => {
      return packageJson.version;
    }
  }
}
