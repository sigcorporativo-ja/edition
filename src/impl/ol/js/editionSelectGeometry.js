import EditionGeometryBaseImpl from 'impl/editionGeometryBase';

// @namespace("M.impl.control")

export default class EditionSelectGeometry extends EditionGeometryBaseImpl {

  /**
   * @classdesc Main constructor of the class. Creates a EditionSelectGeometry
   *            control
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
     * @type {ol.interaction.Select}
     */
    this.selectInteraction_ = null;
  }


  /**
   * This function activates this interaction control
   *
   * @function
   * @api stable
   * @param {object} callback - Callback function in activation
   * @param {object} idFeature
   */
  createInteraction(callback, idFeature) {
    this.selectInteraction_ = new ol.interaction.Select({
      layers: [this.layer_.sandBoxLayer_.getImpl().getOL3Layer()],
      multi: true,
      condition: ol.events.condition.click
    });

    this.selectInteraction_.on('select', callback, this);
    this.interactions_.push(this.selectInteraction_);
  }
}
