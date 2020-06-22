import EditionGeometryBaseImpl from 'impl/editionGeometryBase';

// @namespace("M.impl.control")
export default class EditionTemporalGeometry extends EditionGeometryBaseImpl {
  /**
   * @classdesc
   * Main constructor of the class. Creates a EditionTemporalGeometry
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
    this.drawInteraction_ = null;

  }

  /**
   * This function creates the interaction to draw
   *
   * @private
   * @function
   * @param {object} callback - Callback function in activation
   * @api stable
   */
  createInteraction(callback, geometryType) {
    var style = new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(255, 255, 255, 0.2)'
      }),
      stroke: new ol.style.Stroke({
        color: '#ffa733',
        width: 2
      }),
      image: new ol.style.Circle({
        radius: 4,
        fill: new ol.style.Fill({
          color: '#ffcc33'
        })
      })
    });

    this.drawInteraction_ = new ol.interaction.Draw({
      type: geometryType === 'Point' ? 'Point' : geometryType === 'LineString' ? 'LineString' : 'Polygon',
      style: style,
    });

    this.drawInteraction_.on('drawend', callback, this);
    this.interactions_.push(this.drawInteraction_);
  }
}
