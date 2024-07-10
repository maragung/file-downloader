'use client';

import { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Home() {
  const [url, setUrl] = useState('');
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState(null);
  const [fileSize, setFileSize] = useState(0);
  const [md5Hash, setMd5Hash] = useState('');

  const downloadFile = async () => {
    try {
      // Reset state before new download
      setProgress(0);
      setFile(null);
      setFileSize(0);
      setMd5Hash('');

      // Get file size and MD5 hash
      const headResponse = await axios.head(url);
      setFileSize(headResponse.headers['content-length']);
      setMd5Hash(headResponse.headers['content-md5']);

      // Download file with progress tracking
      const downloadResponse = await axios.get(url, {
        responseType: 'blob',
        onDownloadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          setProgress(Math.round((loaded * 100) / total));
        },
      });

      const fileBlob = downloadResponse.data;
      const fileName = getFileNameFromUrl(url);

      const fileURL = URL.createObjectURL(fileBlob);
      setFile(fileURL);

    } catch (error) {
      console.error(error);
      alert('Error downloading file.');
    }
  };

  const getFileNameFromUrl = (url) => {
    const parts = url.split('/');
    return parts[parts.length - 1];
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="text-center">
        <h1>Unduh File</h1>
        <p>Masukkan URL file:</p>
        <input
          type="text"
          className="form-control mb-3"
          id="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
        />
        <button className="btn btn-primary mb-3" onClick={downloadFile}>
          Start Download
        </button>

        {progress > 0 && (
          <div>
            <p>Progres: {progress}%</p>
          </div>
        )}

        {file && (
          <div>
            <a href={file} download={getFileNameFromUrl(url)} className="btn btn-success mb-3">
              Save File
            </a>
            <p>Ukuran File: {fileSize} bytes</p>
          </div>
        )}
      </div>
    </div>
  );
}
