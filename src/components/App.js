import React from 'react';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import Photo from './Photo';
import images from '../img/*.jpg';

console.log(images);

const DATA = [
  {
    name: 'photo1',
    path: images[1],
  },
  {
    name: 'photo2',
    path: images[2],
  },
  {
    name: 'photo3',
    path: images[3],
  },
];

export default function App() {
  //get data of each image
  const fetchData = (file) => fetch(file).then((res) => res.blob());

  function download() {
    // select each input
    const allPhotos = document.querySelectorAll('input');
    console.log(allPhotos);

    let photoArray = [];
    const downloadDiv = document.querySelector('.download-wrapper');
    allPhotos.forEach((item) => {
      if (item.checked) {
        // select photos parent container
        const pNode = item.parentNode.parentNode.parentNode;
        // finds link in parent container
        const link = pNode.querySelector('a');
        // push each href to an array
        photoArray.push(link.href);
        // add a new class if checked
        pNode.classList.add('checked-on');
      } else {
        const pNode = item.parentNode.parentNode.parentNode;
        // remove class if unchecked
        pNode.classList.remove('checked-on');
      }
      // show download button only on large screens when one or
      // more are checked
      photoArray.length > 0 && window.screen.width > 1024
        ? downloadDiv.classList.add('download-on')
        : downloadDiv.classList.remove('download-on');
    });
    return photoArray;
  }

  function downloadPhotos() {
    // gets array of checked photos from download function
    let photoArray = download();
    console.log(photoArray);
    // create new jszip container
    var zip = new JSZip();
    // create folder in jszip container
    var photos = zip.folder('photos');
    // checks if more than one photo is checked & user is on desktop
    if (photoArray.length > 0 && window.screen.width > 1024) {
      photoArray.map((photo) => {
        // gets data blob from each photo
        const data = fetchData(photo);
        // get file extension
        console.log(data, 'Hello');
        const fileExtension = photo.split('.').pop();
        const fileNameArray = photo.split('.');
        // get filname from array of file url
        const fileName = fileNameArray[fileNameArray.length - 2];
        console.log(fileName);
        // add each photo to zip
        return photos.file(`${fileName}.${fileExtension}`, data, {
          base64: true,
        });
      });
    }

    console.log(photos);
    zip.generateAsync({ type: 'blob' }).then(function (blob) {
      saveAs(blob, 'photos.zip');
    });
  }

  return (
    <div className="App" onChange={download}>
      <header>
        <h1>4th of July Photos</h1>
      </header>
      <div className="photos-wrapper">
        {DATA.map((item) => {
          return <Photo photo={item.path} name={item.name} key={item.name} />;
        })}
      </div>
      <div className="download-wrapper">
        <button className="download-button" onClick={() => downloadPhotos()}>
          Download
        </button>
      </div>
      <footer></footer>
    </div>
  );
}
