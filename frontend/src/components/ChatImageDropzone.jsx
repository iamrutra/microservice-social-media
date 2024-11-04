import React, {useCallback} from 'react';
import { useDropzone } from 'react-dropzone';
import styles from '../styles/ChatImageDropzone.module.css';

function PostImageDropzone({ onFileSelected }) {
    const onDrop = useCallback(acceptedFiles => {
        onFileSelected(acceptedFiles[0]);
        console.log(acceptedFiles[0]);
    }, [onFileSelected]);

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <div {...getRootProps()} className={styles.dropzone}>
            <input {...getInputProps()} />
            <div>
                <label htmlFor="file-input">
                    <img src="https://cdn.icon-icons.com/icons2/1875/PNG/64/imagegallery_120168.png" alt="Image Upload"/>
                </label>
            </div>
        </div>
    );
}

export default PostImageDropzone;