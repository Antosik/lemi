interface ILocaleScheme {
  const?: string;
  one?: string;
  singularNominative?: string;
  singularGenitive?: string;
  pluralGenitive?: string;
}

function declension(scheme: ILocaleScheme, count: number) {
  if (scheme.const) {
    return scheme.const;
  }

  // scheme for count=1 exists
  if (scheme.one !== undefined && count === 1) {
    return scheme.one;
  }

  const mod10 = count % 10;
  const mod100 = count % 100;

  // 1, 21, 31, ...
  if (mod10 === 1 && mod100 !== 11) {
    return scheme.singularNominative.replace('{{count}}', count.toString())

    // 2, 3, 4, 22, 23, 24, 32 ...
  } else if ((mod10 >= 2 && mod10 <= 4) && (mod100 < 10 || mod100 > 20)) {
    return scheme.singularGenitive.replace('{{count}}', count.toString())

    // 5, 6, 7, 8, 9, 10, 11, ...
  } else {
    return scheme.pluralGenitive.replace('{{count}}', count.toString())
  }
}

export function getLocaleFn(scheme: ILocaleScheme) {
  return function (count: number) {
    return declension(scheme, count)
  }
}