import React from 'react';

export default function Background({ image, children }) {
   return (
      <div className="session-wrapper">
         <div className="background-wrapper">
            <img src={image} alt="background" className="background-home" />
            <div className="overlay-home"></div>
         </div>
         {children}
      </div>
   );
}
