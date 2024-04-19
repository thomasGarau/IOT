import React, { useState } from 'react';
import './Record.css';
import { startRecord as apiStartRecord, saveRecord as apiSaveRecord, cancelRecord as apiCancelRecord, stopRecord as apiStopRecord } from './RecordAPI';

function Record() {
    const [isRecording, setIsRecording] = useState(false);
    const [fileName, setFileName] = useState('');
    const [showSaveOptions, setShowSaveOptions] = useState(false);

    // Start recording: call the API function and update state
    const handleStartRecord = () => {
        apiStartRecord(); // Calling the external API function
        setIsRecording(true);
        setShowSaveOptions(false);
    };

    // Stop recording and show save options
    const handleStopRecord = () => {
        apiStopRecord();
        setIsRecording(false);
        setShowSaveOptions(true);
    };

    // Save the recording: call the API function to save and reset states
    const handleSaveRecord = () => {
        console.log(`Saving record as ${fileName}`);
        apiSaveRecord(fileName); // Calling the external API function
        setShowSaveOptions(false);
        setFileName('');
    };

    // Cancel the recording: call the API function to cancel and reset states
    const handleCancelRecord = () => {
        console.log('Record canceled');
        apiCancelRecord(); // Calling the external API function
        setShowSaveOptions(false);
        setFileName('');
    };

    // Handle file name input changes
    const handleFileNameChange = (e) => {
        setFileName(e.target.value);
    };

    return (
        <div className="record-container">
            <h1>Recording Control Panel</h1>
            {!isRecording ? (
                <button className="record-btn" onClick={handleStartRecord}>Enregistrer</button>
            ) : (
                <button className="record-btn" onClick={handleStopRecord}>Stop</button>
            )}

            {showSaveOptions && (
                <div>
                    <input
                        type="text"
                        placeholder="Enter file name"
                        value={fileName}
                        onChange={handleFileNameChange}
                        className="filename-input"
                    />
                    <button className="save-btn" onClick={handleSaveRecord}>Save</button>
                    <button className="cancel-btn" onClick={handleCancelRecord}>Cancel</button>
                </div>
            )}
        </div>
    );
}

export default Record;
