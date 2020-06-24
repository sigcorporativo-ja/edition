import EditionGeometryBaseImpl from 'impl/editionGeometryBase';

// @namespace("M.impl.control")
export default class EditionInsertGeometry extends EditionGeometryBaseImpl {
  /**
   * @classdesc
   * Main constructor of the class. Creates a EditionInsertGeometry
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
  createInteraction(callback, idFeature, entityLayer) {

    var style = null;

    var layerType = this.layer_.getType();

    if (entityLayer !== null && entityLayer !== undefined) {
      layerType = entityLayer.getType();
    }

    var geometryType = this.getSimpleType(layerType);
    // el estilo cambia segun tipo de geometria
    if (layerType == 'Point') {
      style = new ol.style.Style({
        image: new ol.style.Circle({
          radius: 7,
          fill: new ol.style.Fill({ color: 'withe' }),
          stroke: new ol.style.Stroke({
            color: [255, 0, 0],
            width: 2
          })
        })
      });

    } else if (layerType == 'Polygon') {
      style = new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(255, 255, 255, 0.2)'
        }),
        stroke: new ol.style.Stroke({
          color: '#ffcc33',
          width: 2
        }),
        image: new ol.style.Circle({
          radius: 4,
          fill: new ol.style.Fill({
            color: '#ffcc33'
          })
        })
      });

    } else {
      // TODO: LINE
    }

    this.drawInteraction_ = new ol.interaction.Draw({
      type: geometryType,
      style: style,
    });

    this.drawInteraction_.on('drawend', callback, this);

    this.interactions_.push(this.drawInteraction_);
  }

  /**
   * This function gets the simple type geometry from a complex geometry type
   *
   * @private
   * @param {String} type - Geometry type
   * @function
   * @api stable
   */
  getSimpleType(type) {
    if (type === 'MultiPoint' || type === 'Point') {
      return 'Point';
    } else if (type === 'MultiPolygon' || type === 'Polygon') {
      return 'Polygon';
    } else if (type === 'MultiLineString' || type === 'LineString') {
      return 'LineString';
    }
  }
}
