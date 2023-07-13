import { database } from './firebase';

// データの追加
export const addData = (path, data) => {
  const newDataRef = database.ref(path).push();
  return newDataRef.set(data);
};

// データの編集
export const updateData = (path, dataId, updatedData) => {
  return database.ref(`${path}/${dataId}`).update(updatedData);
};

// データの削除
export const deleteData = (path, dataId) => {
  return database.ref(`${path}/${dataId}`).remove();
};

// データの読み取り
export const fetchData = (path) => {
  return database.ref(path).once('value').then((snapshot) => {
    return snapshot.val();
  });
};
