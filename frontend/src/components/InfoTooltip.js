import React from 'react';

export const InfoTooltip = ({isOpen, onClose, onCloseOverlay, infoMessage}) => {
  return (
      <div className={`popup ${isOpen && "popup_opened"}`} onClick={onCloseOverlay}>
        <div className="popup__container">
          <img className="popup__tooltip-img" src={infoMessage.icon} alt="#"/>
          <h2 className="popup__caption">{infoMessage.caption}</h2>
          <button
              className="popup__close-button"
              type="button"
              onClick={onClose}
          > </button>
        </div>
      </div>
  )
}