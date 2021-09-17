import React from 'react';

export default function Component1({ name, photo, width, thumbnail }) {
  return (
    <div className="Component1">
      <a download={name} href={photo} target="_blank" rel="noreferrer">
        <img src={thumbnail} alt={name} />
      </a>
      <div
        className={
          width > 1024
            ? 'bottom-wrapper big-screen'
            : 'bottom-wrapper little-screen'
        }
      >
        <p className="photo-name">{name}</p>

        <label htmlFor={name}>
          <input id={name} type="checkbox" />
        </label>
      </div>
    </div>
  );
}
