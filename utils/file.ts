import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export function convertToCSV(data: any, columns: string[]) {
  if (data.length === 0) return '';

  const keys = Object.keys(data[0]);
  let csv = columns.join(',') + '\n';

  data.forEach((row) => {
    csv += keys.map((key) => row[key]).join(',') + '\n';
  });

  return csv;
}

export async function shareCSV(data: any, columns: string[], fileName: string) {
  const csvData = convertToCSV(data, columns);
  const fullPathName = FileSystem.cacheDirectory + fileName;

  await FileSystem.writeAsStringAsync(fullPathName, csvData, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  const isAvailable = await Sharing.isAvailableAsync();
  if (!isAvailable) {
    return;
  }

  await Sharing.shareAsync(fullPathName);
  await FileSystem.deleteAsync(fullPathName);
}

export async function shareFile(filePath: string) {
  const isAvailable = await Sharing.isAvailableAsync();
  if (!isAvailable) {
    return;
  }

  await Sharing.shareAsync(filePath);
}
