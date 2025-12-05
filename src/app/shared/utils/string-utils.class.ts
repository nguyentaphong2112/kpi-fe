export class StringUtils {
  static isNullOrEmpty = (str: string) => {
    return (str === undefined || str === null || str === '');
  };
}
