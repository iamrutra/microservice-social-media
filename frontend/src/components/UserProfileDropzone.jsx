import React, {useCallback, useState} from 'react';
import { useDropzone } from 'react-dropzone';
import styles from '../styles/UserProfileDropzone.module.css';
import axios from "axios";

function UserProfileDropzone({ userProfileId }) {
    const [isFileSelected, setIsFileSelected] = useState(false);
    const [selectedProfileFile, setSelectedProfileFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const onDrop = useCallback(acceptedFiles => {
        setSelectedProfileFile(acceptedFiles[0]);
        setIsFileSelected(true);
    }, []);

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    const handleUpload = () => {
        if (selectedProfileFile) {
            setIsUploading(true); // Начало загрузки
            const formData = new FormData();
            formData.append('file', selectedProfileFile);

            axios.post(`http://localhost:8222/api/v1/users/${userProfileId}/image/upload`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "Authorization": `Bearer ${localStorage.getItem('jwtToken')}`
                    }
                }
            ).then((response) => {
                console.log("Файл загружен успешно");
                setIsUploading(false); // Завершение загрузки
            }).catch(err => {
                console.log("Ошибка при загрузке изображения профиля:", err);
                setIsUploading(false); // Если произошла ошибка
            });
        }
    };

    return (
        <div>
            {!isFileSelected && (
                <div {...getRootProps()} className={styles.dropzone}>
                    <input {...getInputProps()} />
                    <button type="button" id="chIm" disabled={isUploading}>Change Image</button>
                </div>
            )}
            {selectedProfileFile && (
                <>
                    <p>Selected file: {selectedProfileFile.name}</p>
                    <button type="button" onClick={handleUpload} disabled={isUploading}>Upload</button>
                </>
            )}
        </div>
    );
}

export default UserProfileDropzone;