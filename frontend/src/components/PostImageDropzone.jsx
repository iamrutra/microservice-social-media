import React, {useCallback, useState} from 'react';
import { useDropzone } from 'react-dropzone';
import styles from '../styles/PostImageDropzone.module.css';

function PostImageDropzone({ onFileSelected }) {
    const [previewUrl, setPreviewUrl] = useState(null);
    const [fileName, setFileName] = useState('');

    const onDrop = useCallback(acceptedFiles => {
        const file = acceptedFiles[0];
        if (!file) return;
        onFileSelected(file);
        setFileName(file.name);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
    }, [onFileSelected]);

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <div className={styles.wrapper}>
            <div {...getRootProps()} className={styles.dropzone}>
                <input {...getInputProps()} />
                <div className={styles.prompt}>
                    <div className={styles.icon} aria-hidden>
                        📷
                    </div>
                    <div className={styles.texts}>
                        <strong>Drag & drop image</strong>
                        <span>or click to browse</span>
                    </div>
                </div>
                {fileName && <div className={styles.fileName}>{fileName}</div>}
            </div>
            {previewUrl && (
                <div className={styles.preview}>
                    <img src={previewUrl} alt="Preview" />
                </div>
            )}
        </div>
    );
}

export default PostImageDropzone;