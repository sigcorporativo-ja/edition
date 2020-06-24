// @namespace("M.impl")
export default class EditionGeometryBase extends M.impl.Control {
  /**
   * @classdesc
   * Main constructor of the class.
   *
   * @constructor
   * @param {M.Map} map - Facade map
   * @param {object} layer - Layer for use in control
   * @extends {M.Control}
   * @api stable
   */
  constructor(map, layer) {

    super();
    /**
     * Layer for use in control
     * @private
     * @type {M.layer.WFS}
     */
    this.layer_ = layer;
    /**
     * Store modified features
     * @public
     * @type {array}
     * @api stable
     */
    this.modifiedFeatures = [];
    /**
     * Name of the control
     * @public
     * @type {String}
     */
    this.interactions_ = [];
  }

  /**
   * This function adds the control to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map - Map to add the plugin
   * @param {HTMLElement} element - Container control
   * @api stable
   */
  addTo(map, element) {
    super.addTo(map, element);
  }

  /**
   * This function activates this interaction control
   *
   * @function
   * @api stable
   * @param {object} callback - Callback function in activation
   * @param {object} idFeature
   */
  activate(callback, idFeature, entityLayer) {
    if (this.interactions_.length < 1) {
      this.createInteraction(callback, idFeature, entityLayer);
      for (let i = 0; i < this.interactions_.length; i++) {
        this.layer_.map_.getMapImpl().addInteraction(this.interactions_[i]);
      }
    }

    for (let i = 0; i < this.layer_.map_.getControls().length; i++) {
      if (this.layer_.map_.getControls()[i].activated) {
        this.layer_.map_.getControls()[i].deactivate();
      }
    }

    for (let i = 0; i < this.interactions_.length; i++) {
      this.interactions_[i].setActive(true);
    }
  }

  /**
   * This function deactivate control
   *
   * @public
   * @function
   * @api stable
   */
  deactivate() {
    if (this.interactions_.length > 0) {
      for (let i = 0; i < this.interactions_.length; i++) {
        this.interactions_[i].setActive(false);
        this.layer_.map_.getMapImpl().removeInteraction(this.interactions_[i]);
      }
      this.interactions_ = [];
    }
  }

  /**
   * This function destroys this control and cleaning the HTML
   *
   * @public
   * @function
   * @api stable
   */
  destroy() {
    this.layer_.map_.getMapImpl().removeControl(this);
    this.layer_ = null;
    this.interactions_ = [];
    this.modifiedFeatures = null;
  }

}
