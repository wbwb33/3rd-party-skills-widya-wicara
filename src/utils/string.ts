const Str = {
  sentenceCase: (str: string): string => {
    if (str) {
      return str[0].toUpperCase() + str.slice(1).toLowerCase();
    }
    return '';
  },

  capitalizeEachWord: (str: string): string => {
    if (str) {
      return str
        .toLowerCase()
        .split(' ')
        .map((s: string) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ');
    }
    return '';
  },
};

export default Str;
