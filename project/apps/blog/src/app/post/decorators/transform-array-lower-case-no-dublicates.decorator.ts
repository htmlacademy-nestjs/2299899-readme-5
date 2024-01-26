import { Transform } from 'class-transformer';

export function TransformArrayLowerCaseNoDiblicates() {
  return Transform((data) => {
    const lowerCaseArray = data.value.map((element: string) => element.toLowerCase());
    return [...new Set(lowerCaseArray)];
  });
}
