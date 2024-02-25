export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function lowercaseFirstLetter(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

export function snakeToCamel(
  str: string,
  isFirstCapital: boolean = false
): string {
  const capitalizedStr = isFirstCapital
    ? str.charAt(0).toUpperCase() + str.slice(1)
    : str;
  return capitalizedStr.replace(/_([a-z])/g, (_, letter) =>
    isFirstCapital ? letter.toUpperCase() : letter
  );
}
