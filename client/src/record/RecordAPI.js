import axios from 'axios';

export const startRecord = async () => {
    try{
        await axios.post('http://localhost:3000/file/startRecord')
        return true;
    }catch(error) {
        console.error('Error:', error);
    }
}

export const stopRecord = async () => {
    try{
        await axios.post('http://localhost:3000/file/stopRecord')
        return true;
    }catch(error) {
        console.error('Error:', error);
    }
}

export const saveRecord = async (fileName) => {
    try{
        await axios.post('http://localhost:3000/file/saveRecord', { fileName })
        return true;
    }catch(error) {
        console.error('Error:', error);
    }
}

export const cancelRecord = async () => {
    try{
        await axios.post('http://localhost:3000/file/cancelRecord')
        return true;
    }catch(error) {
        console.error('Error:', error);
    }
}