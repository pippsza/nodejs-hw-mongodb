function parseType(value) {
  if (value == 'undefind') {
    return undefined;
  }
  const keys = ['home', 'work', 'personal'];

  if (!keys.includes(value)) {
    return undefined;
  }
  return value;
}

function parseFavourite(value) {
  if (value == 'undefind') {
    return undefined;
  }
  return value === 'true';
}

export function parseFilterParams(query) {
  const { type, isFavourite } = query;
  const parsedType = parseType(type);
  const parsedIsFavourite = parseFavourite(isFavourite);
  return {
    type: parsedType,
    isFavourite: parsedIsFavourite,
  };
}
