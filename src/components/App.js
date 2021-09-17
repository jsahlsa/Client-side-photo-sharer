import React from 'react';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import Photo from './Photo';
import images from '../img/*.jpg';

console.log(DATA);

const DATA = handleData(images);

function makeThumbnails(img) {
  const canvas = document.createElement('canvas');
  let maxWidth = '300px';
  let maxHeight = '300px';

  let width = img.width;
  let height = img.height;

  // calculate height and width constraining proportions
  if (width > height) {
    if (width > maxWidth) {
      height = Math.round((height *= maxWidth / width));
      width = maxWidth;
    }
  } else {
    if (height > maxHeight) {
      width = Math.round((width *= maxHeight / height));
      height = maxHeight;
    }
  }

  // resize canvas and draw image into it
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);

  return canvas.toDataURL('image/jpeg', 1.0);
}

function handleData(imageObject) {
  let data = [];
  // iterate over photo object
  for (let key in imageObject) {
    // split each key value on the period
    let splitName = imageObject[key].split('.');
    // extract filename from array
    let filename = splitName[splitName.length - 2];

    const preview = document.createElement('img');
    
    preview.src = imageObject[key];
    console.log(preview, 'preview');
    let thumbnail = makeThumbnails(preview);
    console.log(thumbnail, 'hi');
    // push each object to data array
    data.push({
      name: filename,
      path: imageObject[key],
      thumbnailImage: thumbnail,
    });
  }

  return data;
}

console.log(handleData(images));

export default function App() {
  let width = window.screen.width;
  //get data of each image
  const fetchData = (file) => fetch(file).then((res) => res.blob());

  function download() {
    // select each input
    const allPhotos = document.querySelectorAll('input');

    let photoArray = [];
    const downloadDiv = document.querySelector('.download-button');
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
      photoArray.length > 0 && width > 1024
        ? downloadDiv.classList.add('download-on')
        : downloadDiv.classList.remove('download-on');
    });
    return photoArray;
  }

  function downloadPhotos() {
    // gets array of checked photos from download function
    let photoArray = download();
    // create new jszip container
    var zip = new JSZip();
    // create folder in jszip container
    var photos = zip.folder('photos');
    // checks if more than one photo is checked & user is on desktop
    if (photoArray.length > 0 && width > 1024) {
      photoArray.map((photo) => {
        // gets data blob from each photo
        const data = fetchData(photo);
        // get file extension
        const fileExtension = photo.split('.').pop();
        const fileNameArray = photo.split('.');
        // get filname from array of file url
        const fileName = fileNameArray[fileNameArray.length - 2];
        // add each photo to zip
        return photos.file(`${fileName}.${fileExtension}`, data, {
          base64: true,
        });
      });
    }

    zip.generateAsync({ type: 'blob' }).then(function (blob) {
      saveAs(blob, 'photos.zip');
    });
  }

  return (
    <div className="App" onChange={download}>
      <header>
        <h1>🎇 4th of July Photos 🎆</h1>
        <h3>Tap or click to download</h3>
        <h4>
          Click checkboxes on a desktop to download multiple as ZIP (May take a
          bit, photos are large)
        </h4>
      </header>
      <div className="photos-wrapper">
        {DATA.map((item) => {
          return (
            <Photo
              photo={item.path}
              name={item.name}
              key={item.name}
              width={width}
              thumbnail={item.thumbnailImage}
            />
          );
        })}
      </div>
      <div className="download-wrapper">
        <button className="download-button" onClick={() => downloadPhotos()}>
          Download
        </button>
      </div>
      <footer>
        <p className="footer">
          Made with 💻 by{' '}
          <a
            className="author"
            href="https://github.com/jsahlsa/Client-side-photo-sharer"
          >
            jsahlsa
          </a>
        </p>
      </footer>
    </div>
  );
}
