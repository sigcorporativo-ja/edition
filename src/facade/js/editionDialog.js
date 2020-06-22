import template from 'templates/editionDialog';
import { getValue } from './i18n/language';

/**
 * This function shows the edition dialog
 *
 * @public
 * @function
 * @api stable
 * @param {string} Dialog message
 * @param {string} Dialog title
 * @param {object} Message severity
 * @param {object} Accept callback function
 * @param {object} Cancel callback function
 * @returns {Promise}
 */
export const show = (message, title, severity, acceptFn, cancelFn, layers) => {
  const html = M.template.compileSync(template, {
    jsonp: false,
    vars: {
      'message': message,
      'title': title,
      'severity': severity,
      'layers': layers,
      translations: {
        accept_btn: getValue('accept_btn'),
        cancel_btn: getValue('cancel_btn')
      }
    }
  });
  addEvents(html, acceptFn, cancelFn);
};

/**
 * This function closes the edition dialog
 * 
 * @public
 * @function
 * @api stable
 */
export const close = () => {
  var element = document.querySelector('div.m-dialog');
  document.querySelector('div.m-mapea-container').removeChild(element);
};

/**
 * This function add the events to the specified html element
 *
 * @private
 * @function
 * @param {HTMLElement} html template
 * @param {object} Accept callback function
 * @param {object} Cancel callback function
 * @api stable
 */
export const addEvents = (html, acceptFn, cancelFn) => {
  // append new dialog
  var mapeaContainer = document.querySelector('div.m-mapea-container');

  // adds listener to accept button click
  var acceptButton = html.querySelector('#m-edition-dialog-button-aceptar > button');

  // adds listener to cancel button click
  var cancelButton = html.querySelector('#m-edition-dialog-button-cancelar > button');
  if (cancelFn === undefined) {
    cancelButton.addEventListener('click', close, false);
  } else {
    cancelButton.addEventListener('click', cancelFn, false);
  }

  var selectLayer = html.querySelector('.m-layer-selection');
  if (selectLayer) {
    acceptButton.addEventListener('click', function () { acceptFn(selectLayer.value) }, false);
  } else {
    acceptButton.addEventListener('click', acceptFn, false);
  }

  mapeaContainer.appendChild(html);
};
