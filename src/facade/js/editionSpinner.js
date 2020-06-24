/**
 * This function shows the spinner
 *
 * @public
 * @function
 * @param {HTMLElement} target - Target element for showing the spinner
 * @api stable
 * @returns {Promise}
 */
export const show = (target) => {
  return M.template.compile('editionSpinner.html', {
    'jsonp': false
  }).then(function(html) {
    if (target !== undefined) {
      html.style.height = "100%";
      html.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
      append(html, target);
    } else {
      append(html);
    }
  });
};

/**
 * This function appends the spinner to the container
 *
 * @public
 * @api stable
 * @param {HTMLElement} html - Spinner template
 * @param {HTMLElement} target - Target element for showing the spinner
 */
export const append = (html, target) => {
  if (target !== undefined) {
    target.appendChild(html);
  } else {
    var editorContainer = document.getElementsByClassName("m-editor-container");
    editorContainer[1].appendChild(html);
  }
};

/**
 * This function close the spinner element
 * 
 * @public
 * @api stable
 * @param {HTMLElement} target - Target element for showing the spinner
 */
export const close = (target) => {
  var EditionSpinner = document.getElementById("m-edition-spinner");
  if (target !== undefined && EditionSpinner) {
    target.removeChild(EditionSpinner);
  } else {
    if (EditionSpinner) {
      var editorContainer = document.getElementsByClassName("m-edition-container");
      editorContainer[1].removeChild(EditionSpinner);
    }
  }
};
