import EditionGeometryBaseImpl from 'impl/editionGeometryBase';

// @namespace("M.impl.control")
export default class EditionModifyGeometry extends EditionGeometryBaseImpl {
  /**
   * @classdesc
   * Main constructor of the class. Creates a EditionModifyGeometry
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
     * @type {ol.interaction.Modify}
     */
    this.modifyInteraction_ = null;

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
    var featuresCollection = this.layer_.getSelectedFeatureCollection();
    // Son features OL
    var style = new ol.style.Style({
      image: new ol.style.Circle({
        radius: 4,
        fill: new ol.style.Fill({
          color: '#ffcc33'
        })
      })
    });

    this.modifyInteraction_ = new ol.interaction.Modify({
      features: featuresCollection,
      deleteCondition: function(event) {
        return ol.events.condition.shiftKeyOnly(event) && ol.events.condition.singleClick(event);
      },
      style: style
    });

    this.modifyInteraction_.on('modifyend', callback, this);
    this.interactions_.push(this.modifyInteraction_);
  }
}
