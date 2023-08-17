export function convertCapsWithSpacingToCamelCaseWithSpacing(input: string): string {
  const words = input.toLowerCase().split(' ');
  const camelWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
  return camelWords.join(' ');
}