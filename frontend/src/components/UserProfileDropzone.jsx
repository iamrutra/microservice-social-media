import React, {useCallback, useState} from 'react';
import { useDropzone } from 'react-dropzone';
import styles from '../styles/UserProfileDropzone.module.css';
import axios from "axios";

function UserProfileDropzone({ userProfileId }) {
    const [isFileSelected, setIsFileSelected] = useState(false);
    const [selectedProfileFile, setSelectedProfileFile] = useState(null);

    const onDrop = useCallback(acceptedFiles => {
        setSelectedProfileFile(acceptedFiles[0]);
        setIsFileSelected(true);
    }, []);

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    const handleUpload = () => {
        if (selectedProfileFile) {
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
            ).then(() => {
                console.log("Файл загружен успешно");
                window.location.reload();
            }).catch(err => {
                console.log("Ошибка при загрузке изображения профиля:", err);
            });
        }
    };

    return (
        <div>
            {!isFileSelected && (
                <div {...getRootProps()} className={styles.dropzone}>
                    <input {...getInputProps()} />
                    <button id="chIm">Change Image</button>
                </div>
            )}
            {selectedProfileFile && (
                <>
                    <p>Выбран файл: {selectedProfileFile.name}</p>
                    <button onClick={handleUpload}>Upload</button>
                </>
            )}
        </div>
    );
}

export default UserProfileDropzone;
