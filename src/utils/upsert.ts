export default function upsert(array: any, element: any, searchKey: any) { // (1)
  const i = array.findIndex((_element: any) => _element[searchKey] === element[searchKey]);
  if (i > -1)
    array[i] = element; // (2)
  else
    array.push(element);
}
