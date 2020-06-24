import EditionSelectGeometryImpl from 'impl/editionSelectGeometry';

// @namespace("M.control")
export default class EditionSelectGeometry extends M.Control {
  /**
   * @classdesc Main constructor of the class. Creates a EditionSelectGeometry
   * control to draw features on the map.
   *
   * @constructor
   * @param {M.Map} map - Facade map
   * @param {object} layer - Layer for use in control
   * @extends {M.Control}
   * @api stable
   */
  constructor(map, layer) {
    if (M.utils.isUndefined(EditionSelectGeometryImpl)) {
      M.exception('La implementación usada no puede crear controles EditionSelectGeometry');
    }

    // 2. implementation of this control
    let impl = new EditionSelectGeometryImpl(map, layer);
    super(impl, "editionSelectGeometry");
    /**
     * Name of the control
     * @public
     * @type {String}
     */
    this.name = 'editionSelectGeometry';

  }


  /**
   * This function activates this interaction control
   *
   * @function
   * @api stable
   * @param {object} callback - Callback function in activation
   * @param {object} idFeature
   */
  activate(callback, idFeature) {
    this.getImpl().activate(callback, idFeature);
    this.activated = true;
  }

  /**
   * This function checks if an object is equals to this control
   *
   * @function
   * @api stable
   * @param {*} obj - Object to compare
   * @returns {boolean} equals - Returns if they are equal or not
   */
  equals(obj) {
    return (obj instanceof M.control.EditionSelectGeometry);
  }

  /**
   * This function set layer for draw
   *
   * @public
   * @function
   * @param {object} layer - Layer
   * @api stable
   */
  setLayer(layer) {
    this.getImpl().layer_ = layer;
  }
}
