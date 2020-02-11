import React, {useEffect, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import "../../style/preview.css";

function Previews() {
    const thumbsContainer = {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 16
    };

    const thumbInner = {
        display: 'flex',
        minWidth: 0,
        overflow: 'hidden'
    };

    const img = {
        display: 'block',
        width: 'auto',
        height: '100%'
    };

    const [files, setFiles] = useState([]);
    const {getRootProps, getInputProps} = useDropzone({
        accept: 'image/*',
        onDrop: acceptedFiles => {
            setFiles(acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })));
        }
    });
  
   

    useEffect(() => () => {
        files.forEach(file => URL.revokeObjectURL(file.preview));
    }, [files]);

    return (
        <section className="container">
            <div {...getRootProps({className: 'dropzone'})}>
            <input {...getInputProps()} />
            <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
            <aside style={thumbsContainer}>
                {files.map(file => (
                    <div className="thumb" key={file.name}>
                        <div style={thumbInner}>
                            <img src={file.preview} style={img} />  
                        </div>
                    </div>
                ))}
            </aside>
        </section>
    );

}

  export default Previews;