import EditionGeometryBaseImpl from 'impl/editionGeometryBase';

// @namespace("M.impl.control")
export default class EditionSnapping extends EditionGeometryBaseImpl {

  /**
   * @classdesc
   * Main constructor of the class. Creates a EditionSnapping
   * control
   *
   * @constructor
   * @param {M.Map} map - Facade map
   * @param {object} layer - Layer for use in control
   * @extends {M.Control}
   * @api stable
   */
  constructor(map, layer) {
    super(map, layer);
    /**
     * Facade map object
     * @public
     * @type {M.Map}
     */
    this.map_ = map;
    /**
     * OpenLayers interaction object
     * @public
     * @type {ol.interaction}
     */
    this.snapInteraction_ = null;
  }

  /**
   * This function creates the interaction to draw
   *
   * @private
   * @function
   * @param {object} callback - Callback function in activation
   * @api stable
   */
  createInteraction(callback, idFeature) {
    this.snapInteraction_ = new ol.interaction.Snap({
      source: this.layer_.getImplLayer().getSource()
    });

    this.interactions_.push(this.snapInteraction_);
  }
}
