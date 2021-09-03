import React from 'react';

export default function Component1({ name, photo }) {
  return (
    <div className="Component1">
      <a download={name} href={photo} target="_blank" rel="noreferrer">
        <img src={photo} alt={name} />
      </a>
      <div
        className={
          window.screen.width > 1024
            ? 'bottom-wrapper big-screen'
            : 'bottom-wrapper little-screen'
        }
      >
        <p>{name}</p>
        <label htmlFor={name}>
          {window.screen.width > 1024
            ? 'check box to download'
            : 'touch photo to download'}
          <input id={name} type="checkbox" />
        </label>
      </div>
    </div>
  );
}
