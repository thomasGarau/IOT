import React, { useEffect, useState } from 'react';
import './Home.css';
import { getFileInfo, deleteFileInfo } from './HomeAPI';

function Home() {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        getFileInfo()
            .then(data => {
                console.log("Fetched data:", data);
                setFiles(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    };
    fetchData();

    const handleDelete = (id) => {
        deleteFileInfo(id)
            .then(() => {
                console.log("File deleted");
                fetchData();
            })
            .catch(error => {
                console.error('Error deleting file:', error);
            });

    };

    return (
        <div className="file-container">
            <h1>Welcome to Your File Manager</h1>
            <p>Here you can view and manage all your files.</p>
            {loading ? <div className="loading-spinner"></div> : (
                <div className="files-wrapper">
                    {files.map((file) => (
                        <div key={file._id} className="file-card">
                            <h3>{file.name}</h3>
                            <p>Created: {file.creationDate}</p>
                            <p>Duration: {file.duration}</p>
                            <p>Size: {file.size}</p>
                            <button onClick={() => handleDelete(file._id)}>Delete</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Home;
