import EditionGeometryBaseImpl from 'impl/editionGeometryBase';

// @namespace("M.impl.control")
export default class EditionHighlightGeometry extends EditionGeometryBaseImpl {
  /**
   * @classdesc Main constructor of the class. Creates a EditionHighlightGeometry
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
    this.highlightInteraction_ = null;
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
    var this_ = this;
    // el estilo debe depender del tipo de geometria
    this.highlightStyle = [
      new ol.style.Style({
        fill: new ol.style.Fill({
          color: [249, 177, 10, 0.2]
        })
      }),
      new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: 'orange',
          width: 2.5
        })
      })
    ];

    this.highlightInteraction_ = new ol.interaction.Select({
      layers: [this.layer_.sandBoxLayer_.getImpl().getOL3Layer()],
      condition: ol.events.condition.pointerMove,
      style: this_.highlightStyle
    });

    this.interactions_.push(this.highlightInteraction_);
  }
}
