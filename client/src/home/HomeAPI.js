import axios from 'axios';

export const getFileInfo = async () => {
    try{
        const response = await axios.get('http://localhost:3000/file/getFileInfo')
        return response.data
    }catch(error) {
        console.error('Error:', error);
    }
}

export const deleteFileInfo = async (id) => {
    try{
        await axios.delete('http://localhost:3000/file/delFile', { data: { id } })
    }catch(error) {
        console.error('Error:', error);
    }
}

