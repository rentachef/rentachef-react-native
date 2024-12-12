export default function upsert(array: any, element: any, searchKey: any) {
  const i = array.findIndex((_element: any) => _element[searchKey] === element[searchKey]);
  if (i > -1)
    array[i] = element;
  else
    array.push(element);
}

export function downsert(array: any, element: any, searchKey: any): any {
  const i = array.findIndex((_element: any) => _element[searchKey] === element[searchKey]);
  if (i > -1)
    array.splice(i, 1);
  else
    array.push(element);
}
