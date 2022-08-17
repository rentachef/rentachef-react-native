export default function _getBase64(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    fetch(url).then(result => {
      result.blob().then(blob => {
        reader.readAsDataURL(blob);
        reader.onload = () => resolve(reader.result.toString());
        reader.onerror = error => reject(error);
      });
    })
  });
}
