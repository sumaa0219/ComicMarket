import 'firebase/compat/database';
import { database } from './firebase';



export const addData = (path, data) => {
    const newDataRef = database.ref(path);
    return newDataRef.set(data);
};

export const addDataHash = (path, data) => { //ランダム値をつけて
    const newDataRef = database.ref(path).push();
    return newDataRef.set(data);
};

// データの編集
export const updateData = (path, updatedData) => {
    return database.ref(`${path}`).update(updatedData);
};

// データの削除
export const deleteData = (path, dataId) => {
    return database.ref(`${path}/${dataId}`).remove();
};

export const updateOneData = (path, dataId, updatedData) => {
    const dataToUpdate = {
        [dataId]: updatedData
    };
    console.log(dataToUpdate)
    return database.ref(`${path}`).update(dataToUpdate);
};

// データの読み取り
export const fetchData = async (path) => {
    try {
        const snapshot = await database.ref(path).once('value');
        const data = snapshot.val();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};