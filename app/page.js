'use client';

import { useState } from 'react';
import axios from 'axios';

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
    <div>
      <h1>Unduh File</h1>
      <p>Masukkan URL file:</p>
      <input
        type="text"
        id="url"
        value={url}
        onChange={(event) => setUrl(event.target.value)}
      />
      <button onClick={downloadFile}>Unduh File</button>

      {progress > 0 && (
        <div>
          <p>Progres: {progress}%</p>
        </div>
      )}

      {file && (
        <div>
          <a href={file} download={getFileNameFromUrl(url)}>
            Unduh File
          </a>
          <p>Ukuran File: {fileSize} bytes</p>
          <p>MD5 Hash: {md5Hash}</p>
        </div>
      )}
    </div>
  );
}
