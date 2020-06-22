/**
 * @module M/plugin/Edition
 */

import 'assets/css/edition.css';
import 'templates/edition.html';
import EditionControl from './editioncontrol';
import api from '../../api.json';
import { getValue } from './i18n/language';

export default class Edition extends M.Plugin {

  /**
   * Name to identify this plugin
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  static get NAME() {
    return 'edition';
  }

  /**
   * @classdesc
   * Main facade plugin object. This class creates a plugin
   * object which has an implementation Object
   *
   * @constructor
   * @extends {M.Plugin}
   * @param {Object} impl implementation object
   * @api stable
   */
  constructor() {

    super();

    // this.userParameters_ = userParameters;
    // this.config_ = userParameters ? userParameters.config : {};
    //this.control_ = null;

    /**
     * Facade of the map
     * @private
     * @type {M.Map}
     */
    this.map_ = null;

    /**
     * Array of controls
     * @private
     * @type {Array<M.Control>}
     */
    this.controls_ = [];

    /**
     * Position of the Plugin
     * @public
     * Posible values: TR | TL | BL | BR
     * @type {String}
     */
    this.position = 'TL';

    /**
     * Metadata from api.json
     * @private
     * @type {Object}
     */
    this.metadata_ = api.metadata;


    /**
     * add your variables
     *
     */

  }

  /**
   * This function adds this plugin into the map
   *
   * @public
   * @function
   * @param {M.Map} map the map to add the plugin
   * @api stable
   */
  addTo(map) {
    this.control_ = new EditionControl();
    this.controls_.push(this.control_);
    this.map_ = map;
    //panel para agregar control - no obligatorio
    this.panel_ = new M.ui.Panel("paneledition", {
      'collapsible': true,
      'className': 'm-edition',
      'collapsedButtonClass': 'g-editiontools-closed',
      'openedButtonClass': 'g-editiontools-opened-vertical',
      'position': M.ui.position[this.position],
      'tooltip': getValue('tooltip')
    });

    this.panel_.addControls(this.controls_);
    map.addPanels(this.panel_);
  }

  /**
   * @getter
   * @public
   */
  get name() {
    return 'edition';
  }

  /**
   * This function gets metadata plugin
   *
   * @public
   * @getter
   * @api stable
   * @return {Object}
   */
  getMetadata() {
    return this.metadata_;
  }

  /**
   * Get the API REST Parameters of the plugin
   *
   * @function
   * @public
   * @api
   */
  getAPIRest() {
    return `${this.name}=${this.position}`;
  }

  /**
   * This function destroys this plugin
   *
   * @public
   * @function
   * @api stable
   */
  destroy() {
    this.control_.destroyControls();
    this.map_.removeControls([this.control_]);
    this.map_ = null;
    this.control_ = null;
    this.panel_ = null;
  }

  /**
   * This function compare if pluging recieved by param is instance of M.plugin.Transparency
   *
   * @public
   * @function
   * @param {M.plugin} plugin to compare
   * @api stable
   */
  equals(plugin) {
    if (plugin instanceof Edition) {
      return true;
    }
    return false;
  }
}
