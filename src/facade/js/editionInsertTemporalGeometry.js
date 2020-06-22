import EditionTemporalGeometryImpl from 'impl/editionInsertTemporalGeometry';

// @namespace("M.control")
export default class EditionTemporalGeometry extends M.Control {
  /**
   * @classdesc Main constructor of the class. Creates a EditionTemporalGeometry
   * control to draw features on the map.
   *
   * @constructor
   * @param {M.Map} map - Facade map
   * @param {object} layer - Layer for use in control
   * @extends {M.Control}
   * @api stable
   */
  constructor(map, layer) {
    if (M.utils.isUndefined(EditionTemporalGeometryImpl)) {
      M.exception('La implementación usada no puede crear controles EditionInsertLine');
    }
    /**
     * Name of the control
     * @public
     * @type {String}
     */
    let impl = new EditionTemporalGeometryImpl(map, layer);
    super(impl, "editionInsertLine");

    this.name = 'editionInsertLine';
  }


  /**
   * This function activates this interaction control
   *
   * @function
   * @api stable
   * @param {object} callback - Callback function in activation
   * @param {object} idFeature
   */
  activate(callback, idFeature, layer) {
    this.getImpl().activate(callback, idFeature, layer);
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
    return (obj instanceof M.control.EditionTemporalGeometry);
  }
}
