import editionLayer from '../../impl/ol/js/editionLayer';
import EditionSelectGeometry from './editionSelectGeometry';
import EditionImplControl from 'impl/editioncontrol';
import EditionHighlightGeometry from './editionHighlightGeometry';
import EditionInsertGeometry from './editionInsertGeometry';
import EditionModifyGeometry from './editionModifyGeometry';
import EditionTemporalGeometry from './editionInsertTemporalGeometry';
import EditionSnapping from './editionSnapping';
import EditionGeometryControl from './editionGeometryControl';
import template from 'templates/edition';
import { getValue } from './i18n/language';

// @namespace("M.control")
export default class editionControl extends M.Control {

  /**
   * @classdesc
   * Main constructor of the class. Creates a PluginControl
   * control
   *
   * @constructor
   * @extends {M.Control}
   * @api stable
   */
  constructor() {
    // 1. checks if the implementation can create PluginControl
    if (M.utils.isUndefined(EditionImplControl)) {
      M.exception('La implementación usada no puede crear controles editionControl');
    }
    // 2. implementation of this control
    let impl = new EditionImplControl();
    super(impl, "edition");

    /**	
     * Edition layer
     * @private
     * @type {Object}
     */
    this.sandBoxLayer_ = null;
  }

  /**
   * This function creates the view
   *
   * @public
   * @function
   * @param {M.Map} map to add the control
   * @api stable
   */
  createView(map) {
    var this_ = this;
    this.facadeMap_ = map;
    return new Promise((success, fail) => {
      const html = M.template.compileSync(template, {
        vars: {
          translations: {
            import_btn: getValue('import_btn'),
            select_btn: getValue('select_btn'),
            select_click: getValue('select_click'),
            select_line: getValue('select_line'),
            select_area: getValue('select_area'),
            select_all: getValue('select_all'),
            deselect_all: getValue('deselect_all'),
            zoom: getValue('zoom'),
            zoom_sandbox: getValue('zoom_sandbox'),
            zoom_selection: getValue('zoom_selection'),
            geometry_draw: getValue('geometry_draw'),
            snapping: getValue('snapping'),
            modify_polygon: getValue('modify_polygon'),
            geometry_divide: getValue('geometry_divide'),
            union: getValue('union'),
            empty_polygon: getValue('empty_polygon'),
            intersection: getValue('intersection'),
            delete_selected: getValue('delete_selected'),
          },
        },
      });
      this_.element_ = html;
      this_.sandBoxLayer_ = new editionLayer(this);
      this_.createControls();
      success(html);
    });
  }

  /**
   * This function creates the edition controls
   *
   * @public
   * @function
   * @api stable
   */
  createControls() {
    this.highlightControl = new EditionHighlightGeometry(this.facadeMap_, this.sandBoxLayer_);
    this.insertGeomControl = new EditionInsertGeometry(this.facadeMap_, this.sandBoxLayer_);
    this.modifyGeomControl = new EditionModifyGeometry(this.facadeMap_, this.sandBoxLayer_);
    this.insertTemporalGeomControl = new EditionTemporalGeometry(this.facadeMap_, this.sandBoxLayer_);
    this.snappingControl = new EditionSnapping(this.facadeMap_, this.sandBoxLayer_);
    this.selectGeomControl = new EditionSelectGeometry(this.facadeMap_, this.sandBoxLayer_);
    this.geomControl = new EditionGeometryControl(this);
  }

  /**
   * This function is called on the control activation
   *
   * @public
   * @function
   * @api stable
   */
  activate() {
    super.activate();
  }

  /**
   * This function is called on the control deactivation
   *
   * @public
   * @function
   * @api stable
   */
  deactivate() {
    super.deactivate();
    this.getImpl().deactivateClick(this.map_);
  }

  /**
   * This function gets activation button
   *
   * @public
   * @function
   * @param {HTML} html of control
   * @api stable
   */
  getActivationButton(html) {
    return html.querySelector('.m-edition button');
  }

  /**
   * This function destroy the controls
   *
   * @public
   * @function
   * @api stable
   */
  destroyControls() {
    this.geomControl.clear();
    this.sandBoxLayer_.destroy();
  }

  /**
   * This function compares controls
   *
   * @public
   * @function
   * @param {M.Control} control to compare
   * @api stable
   */
  equals(control) {
    return control instanceof editionControl;
  }
}
