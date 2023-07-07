const isUrl = (whatever: string) => {
  const urlRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
  return urlRegex.test(whatever)
}

export default function _getBase64(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if(!isUrl(url)) {
      const reader = new FileReader();
      fetch(url).then(result => {
        result.blob().then(blob => {
          reader.readAsDataURL(blob);
          reader.onload = () => resolve(reader.result.toString());
          reader.onerror = error => reject(error);
        });
      })
    } else
      resolve(url)
  });
}
