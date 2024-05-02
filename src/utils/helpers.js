export async function readFilesToDataURL(files) {
  return Promise.all(
    files.map(async (file) => {
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }),
  );
}

export function downloadFromDataURL(dataURL, filename) {
  const link = document.createElement("a");
  link.href = dataURL;
  link.download = filename;
  link.click();
}
