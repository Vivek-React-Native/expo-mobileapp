import AsyncStorage from '@react-native-async-storage/async-storage';

export const setStorage = async (key: string, value: string) => {
  try {
    console.log('123');
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    // saving error
  }
};

export const getStorage = async (key: string) => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (e) {
    // get error
  }
};
