import EditionGeometryControlImpl from 'impl/editionGeometryControl';
import {
  show,
  close
} from './editionDialog';
import {
  unionFeature,
  intersects,
  intersection,
  difference,
  dividePolygon,
  getJSTSGeometry
} from './editionSpatialEngine';
import { getValue } from './i18n/language';

// @namespace("M.control")
export default class EditionGeometryControl extends EditionGeometryControlImpl {
  /**
   * @classdesc
   * Main constructor of the class. Creates a EditionGeometryControl
   * control
   *
   * @constructor
   * @extends {M.Control}
   * @api stable
   */
  constructor(base) {
    if (M.utils.isUndefined(EditionGeometryControlImpl)) {
      M.exception('La implementación usada no puede crear controles EditionGeometryControl');
    }

    let impl_ = new EditionGeometryControlImpl(base.facadeMap_);
    super(impl_, "editionGeometryControl");

    this.NAME = "editionGeometryControl";
    this.impl_ = impl_;

    this.facadeMap_ = base.facadeMap_;
    /**
     * Parent prototype by dependency injection
     * @private
     * @type {Object}
     */
    this.base = base;
    /**
     * Html Element
     * @private
     * @type {Object}
     */
    this.element_ = base.element_;
    /**
     * Layer for use in control
     * @private
     * @type {Object}
     */
    this.entityLayer_ = base.sandBoxLayer_;
    /**
     * InsertGeomControl control
     * @private
     * @type {Object}
     */
    this.insertGeomControl = this.base.insertGeomControl;
    /**
     * insertTemporalGeomControl control
     * @private
     * @type {Object}
     */
    this.insertTemporalGeomControl = this.base.insertTemporalGeomControl;
    /**
     * modifyGeomControl control
     * @private
     * @type {Object}
     */
    this.modifyGeomControl = this.base.modifyGeomControl;
    /**
     * translateGeomControl control
     * @private
     * @type {Object}
     */
    this.translateGeomControl = this.base.translateGeomControl;
    /**
     * selectGeomControl control
     * @private
     * @type {Object}
     */
    this.selectGeomControl = this.base.selectGeomControl;
    /**
     * snappingControl control
     * @private
     * @type {Object}
     */
    this.snappingControl = this.base.snappingControl;
    /**
     * highlightControl control
     * @private
     * @type {Object}
     */
    this.highlightControl = this.base.highlightControl;
    /**
     * entityAddWFSControl control
     * @private
     * @type {Object}
     */
    this.entityAddWFSControl = null;
    /**
     * insertPolygonButton button
     * @private
     * @type {Object}
     */
    this.insertPolygonButton = null;
    /**
     * selectPolygonButton button
     * @private
     * @type {Object}
     */
    this.selectPolygonButton = null;
    /**
     * selectPolygonByAreaButton button
     * @private
     * @type {Object}
     */
    this.selectPolygonByAreaButton = null;
    /**
     * selectPolygonByLineButton button
     * @private
     * @type {Object}
     */
    this.selectPolygonByLineButton = null;
    /**
     * selectAllSandboxPolygonButton button
     * @private
     * @type {Object}
     */
    this.selectAllSandboxPolygonButton = null;
    /**
     * modifyPolygonButton button
     * @private
     * @type {Object}
     */
    this.modifyPolygonButton = null;
    /**
     * dividePolygonButton button
     * @private
     * @type {Object}
     */
    this.dividePolygonButton = null;
    /**
     * joinPolygonsButton button
     * @private
     * @type {Object}
     */
    this.joinPolygonsButton = null;
    /**
     * intersectPolygonButton button
     * @private
     * @type {Object}
     */
    this.intersectPolygonButton = null;
    /**
     * emptyPolygonButton button
     * @private
     * @type {Object}
     */
    this.emptyPolygonButton = null;
    /**
     * zoomToSelectedButton button
     * @private
     * @type {Object}
     */
    this.zoomToSelectedButton = null;
    /**
     * addGeomButton button
     * @private
     * @type {Object}
     */
    this.addGeomButton = null;
    /**
     * WFSManager control
     * @private
     * @type {Object}
     */
    this.WFSManagerCtl = null;

    this.addEvents();


  }


  /**
   * This function add the events to the specified html element
   *
   * @public
   * @function
   * @api stable
   */
  addEvents() {
    this.self_ = this;
    this.snappingButton = this.element_.querySelector('#m-snapping-button');
    this.snappingButton.addEventListener('click', this.activateSnapping.bind(this), false);

    this.zoomMenuElement = this.element_.querySelector('#m-zoommenu-button');
    this.zoomMenuPolygonButton = this.element_.querySelector('#m-zoom-button');
    this.zoomMenuPolygonButtonClass = this.zoomMenuPolygonButton.classList.value;
    this.zoomMenuPolygonButton.addEventListener('click', this.manageSelectedClassInDropdown, false);
    this.zoomMenuElement.addEventListener('mouseover', this.showDropdownContent, false);

    this.zoomMenuElement.addEventListener('mouseout', this.hideDropdownContent, false);

    this.zoomDropdownMenu = this.zoomMenuElement.querySelector('#myDropdown');

    this.zoomToSandBoxButton = this.element_.querySelector('button#m-zoomsandbox-button');
    this.zoomToSandBoxButton.addEventListener('click', this.zoomToSandBox.bind(this), false);

    this.zoomToSelectedButton = this.element_.querySelector('button#m-zoomselect-button');
    this.zoomToSelectedButton.addEventListener('click', this.zoomToSelection.bind(this), false);


    this.selectMenuElement = this.element_.querySelector('#m-selectmenu-button');
    this.selectMenuPolygonButton = this.element_.querySelector('#m-select-button');
    this.selectMenuPolygonButtonClass = this.selectMenuPolygonButton.classList.value;
    this.selectMenuPolygonButton.addEventListener('click', this.manageSelectedClassInDropdown, false);
    this.selectMenuElement.addEventListener('mouseover', this.showDropdownContent, false);

    this.selectDropdownMenu = this.selectMenuElement.querySelector('#myDropdown');
    this.selectMenuElement.addEventListener('mouseout', this.hideDropdownContent, false);


    this.removeFromSandBoxButton = this.element_.querySelector('button#m-removefromsandbox-button');
    this.removeFromSandBoxButton.addEventListener('click', this.removeSelectedFeaturesFromSandBox.bind(this), false);

    this.selectPolygonButton = this.element_.querySelector('button#m-selectclick-button');
    this.selectPolygonButton.addEventListener('click', this.selectPolygonByClick.bind(this), false);

    this.selectPolygonByAreaButton = this.element_.querySelector('button#m-selectarea-button');
    this.selectPolygonByAreaButton.addEventListener('click', this.selectPolygonByDraw.bind(this), false);

    this.selectPolygonByLineButton = this.element_.querySelector('button#m-selectline-button');
    this.selectPolygonByLineButton.addEventListener('click', this.selectPolygonByDraw.bind(this), false);

    this.selectAllSandboxPolygonButton = this.element_.querySelector('button#m-selectall-button');
    this.selectAllSandboxPolygonButton.addEventListener('click', this.selectAllSandboxPolygon.bind(this), false);

    this.deselectAllSandboxPolygonButton = this.element_.querySelector('button#m-deselectall-button');
    this.deselectAllSandboxPolygonButton.addEventListener('click', this.deselectAllSandboxPolygon.bind(this), false);

    this.insertPolygonButton = this.element_.querySelector('button#m-draw-button');
    this.insertPolygonButton.addEventListener('click', this.insertPolygon.bind(this), false);

    this.modifyPolygonButton = this.element_.querySelector('button#m-modify-button');
    this.modifyPolygonButton.addEventListener('click', this.modifyPolygon.bind(this), false);

    this.dividePolygonButton = this.element_.getElementsByTagName('button')['m-splitpolygon-button'];
    this.dividePolygonButton.addEventListener('click', this.dividePolygon.bind(this), false);

    this.joinPolygonsButton = this.element_.querySelector('button#m-unir-button');
    this.joinPolygonsButton.addEventListener('click', this.confirmDialogJoinPolygons.bind(this), false);

    this.addGeomButton = this.element_.querySelector('button#m-addgeometry-button');
    this.addGeomButton.addEventListener('click', this.addGeom.bind(this), false);

    this.intersectPolygonButton = this.element_.querySelector('button#m-intersect-button');
    this.intersectPolygonButton.addEventListener('click', this.intersectPolygon.bind(this), false);

    this.emptyPolygonButton = this.element_.querySelector('button#m-vaciado-button');
    this.emptyPolygonButton.addEventListener('click', this.emptyPolygon.bind(this), false);
  }


  /**
   * This function shows the dropdown content
   *
   * @public
   * @function
   * @param {evt} event
   * @api stable
   */
  showDropdownContent(evt) {
    if (evt.currentTarget.children[1].style.width === "" || evt.currentTarget.children[1].style.width === "0px") {
      evt.currentTarget.children[0].style.float = "left";
      evt.currentTarget.children[1].style.left = "40px";
      if (evt.currentTarget.id === "m-zoommenu-button") {
        evt.currentTarget.children[1].style.width = "80px";
      } else {
        evt.currentTarget.children[1].style.width = "200px";
      }
      evt.currentTarget.children[1].style.borderTopRightRadius = '4px';
      evt.currentTarget.children[1].style.borderBottomRightRadius = '4px';
      evt.currentTarget.children[0].style.marginBottom = "-4px";
    }
  }

  /**
   * This function hides the dropdown content
   *
   * @public
   * @function
   * @param {evt} event
   * @api stable
   */
  hideDropdownContent(evt) {
    evt.currentTarget.children[1].style.width = "0px";
  }

  /**
   * This function manages the selected class in dropdown
   *
   * @public
   * @function
   * @param {evt} event
   * @api stable
   */
  manageSelectedClassInDropdown(evt) {
    var selectedClass;
    if (evt.currentTarget.id === 'm-select-button' && evt.currentTarget.classList.value !== 'g-cartografia-flecha') {
      if (this.selectMenuPolygonButtonClass === 'g-cartografia-flecha') {
        selectedClass = this.selectMenuPolygonButtonClass;
        evt.currentTarget.nextElementSibling.style.width = "0px";
        evt.currentTarget.classList.value = selectedClass;
        this.deactiveControls();
      }
    } else if (evt.currentTarget.offsetParent.previousElementSibling !== null && evt.currentTarget.offsetParent.previousElementSibling.id !== "m-zoom-button") {
      selectedClass = evt.currentTarget.classList.value;
      evt.currentTarget.offsetParent.style.width = "0px";
      evt.currentTarget.offsetParent.previousElementSibling.classList.value = selectedClass;
    }
  }

  /**
   * This function restore the default class in dropdown buttons
   *
   * @public
   * @function
   * @api stable
   */
  restoreDefaultClassDropdownButtons() {
    this.selectMenuPolygonButton.classList.value = this.selectMenuPolygonButtonClass;
  }

  /**
   * This function show a confirmation dialog for removing the selected features from SandBox Layer
   *
   * @public
   * @function
   * @api stable
   */
  removeSelectedFeaturesFromSandBox(evt) {
    if (this.entityLayer_.selectedFeatures_.length > 0) {
      var acceptFn = this.removeSelectedFeatures.bind(this);
      show(getValue('dialog_removeFeatures'),
        getValue('dialog_removeFeatures_title'), 'info', acceptFn);
    } else {
      M.dialog.info(getValue('dialog_removeFeatures_noGeometry'), getValue('dialog_removeFeatures_title'));
    }
  }

  /**
   * This function removes the selected features from SandBox Layer
   *
   * @public
   * @function
   * @api stable
   */
  removeSelectedFeatures() {
    this.deactiveControls();
    this.unselectControls();
    this.entityLayer_.removeFeaturesFromSandBox(this.entityLayer_.selectedFeatures_);
    close();
  }

  /**
   * This function activate the snapping interaction
   *
   * @public
   * @function
   * @param {evt} event
   * @api stable
   */
  activateSnapping(evt) {
    if (evt.currentTarget.className.indexOf("selected") < 0) {
      evt.currentTarget.className += " selected";
      evt.currentTarget.title = getValue('snapping_disable');
      this.snappingControl.activate(null, null);
    } else {
      evt.currentTarget.title = getValue('snapping');
      evt.currentTarget.className = this.snappingButton.className.replace(" selected", "");
      this.snappingControl.deactivate();
    }
  }

  /**
   * This function activate the insert geometry interaction
   *
   * @public
   * @function
   * @param {evt} event
   * @api stable
   */
  insertPolygon(evt) {
    this.restoreDefaultClassDropdownButtons();
    this.deactiveControls();
    if (evt.currentTarget.className.indexOf("selected") < 0) {
      this.unselectControls();
      evt.currentTarget.className += " selected";
      var callback = this.onPolygonInserted.bind(this);
      this.insertGeomControl.activate(callback);
      this.snappingControl.deactivate();
      if (this.snappingButton.className.indexOf("selected") > 0) {
        this.snappingControl.activate(null, null);
      }
    } else {
      this.unselectControls();
    }
  }

  /**
   * Callback for the insert geometry interaction
   *
   * @public
   * @function
   * @param {evt} event
   * @api stable
   */
  onPolygonInserted(evt) {
    this.entityLayer_.addNewFeatureToSandBox(evt.feature);
  }

  /**
   * This function activate the select geometry interaction by single click
   *
   * @public
   * @function
   * @param {evt} event
   * @api stable
   */
  selectPolygonByClick(evt) {
    this.manageSelectedClassInDropdown(evt);
    this.deactiveControls();
    if (evt.currentTarget.offsetParent.previousElementSibling.className.indexOf("selected") < 0) {
      this.unselectControls();
      evt.currentTarget.offsetParent.previousElementSibling.className += " selected";
      var callback = this.onPolygonSelected.bind(this);
      this.selectGeomControl.activate(callback);
    } else {
      this.showDropdownContent();
    }
  }

  /**
   * Callback for the select geometry interaction by single click
   *
   * @public
   * @function
   * @param {evt} event
   * @api stable
   */
  onPolygonSelected(evt) {
    var this_ = this;
    var featureInSandBox = null;
    if (evt.selected.length > 0) {
      var sandBoxFeatures = this.entityLayer_.getFeatures();
      sandBoxFeatures.forEach(function (f, index, array) {
        for (let i = 0; i < evt.selected.length; i++) {
          if (evt.selected[i].getId() === this_.entityLayer_.getImplFeature(f).getId()) {
            featureInSandBox = evt.selected[i];
          }
        }
      });

      if (featureInSandBox !== null) {
        var selected = null;
        this.entityLayer_.selectedFeatures_.forEach(function (f, index, array) {
          for (let i = 0; i < evt.selected.length; i++) {
            if (evt.selected[i].getId() === this_.entityLayer_.getImplFeature(f).getId()) {
              selected = evt.selected[i];
            }
          }
        });
        if (selected === null) {
          this.entityLayer_.selectFeature(featureInSandBox);
        } else {
          this.entityLayer_.unselectFeature(featureInSandBox);
        }
      }

      evt.target.getFeatures().clear();
    }
  }

  /**
   * This function activate the select geometry interaction by drawing a polygon
   *
   * @public
   * @function
   * @param {evt} event
   * @api stable
   */
  selectPolygonByDraw(evt) {
    this.manageSelectedClassInDropdown(evt);
    var geometryType = evt.currentTarget.id === 'm-selectarea-button' ? 'Polygon' : 'LineString';
    this.deactiveControls();
    if (evt.currentTarget.offsetParent.previousElementSibling.className.indexOf("selected") < 0) {
      this.unselectControls();
      evt.currentTarget.offsetParent.previousElementSibling.className += " selected";
      var callback = this.onPolygonSelectedByDraw.bind(this);
      this.insertTemporalGeomControl.activate(callback, geometryType);
    } else {
      this.showDropdownContent();
    }
  }

  /**
   * Callback for the select geometry interaction by drawing a polygon
   *
   * @public
   * @function
   * @param {evt} event
   * @api stable
   */
  onPolygonSelectedByDraw(evt) {
    var sandBoxFeatures = this.entityLayer_.getFeatures();
    //var inter = intersects(sandBoxFeatures, evt.feature.getGeometry());
    var inter = intersects(sandBoxFeatures, this.impl_.getGeoJsonFromFeature(evt.feature).geometry);
    for (var i = 0; i < inter.length; i++) {
      var featureInSandBox = null;
      sandBoxFeatures.forEach(function (f, index, array) {
        //if(inter[i].getId()===this_.entityLayer_.getImplFeature(f).getId()){
        if (inter[i].getId() === f.getId()) {
          featureInSandBox = inter[i];
        }
      });

      if (featureInSandBox !== null) {
        var selected = null;
        this.entityLayer_.selectedFeatures_.forEach(function (f, index, array) {
          //if(inter[i].getId()===this_.entityLayer_.getImplFeature(f).getId()){
          if (inter[i].getId() === f.getId()) {
            selected = inter[i];
          }
        });
        if (selected === null) {
          this.entityLayer_.selectFeature(featureInSandBox);
        } else {
          this.entityLayer_.unselectFeature(featureInSandBox);
        }
      }
    }
  }

  /**
   * This function selects all features in sandboxlayer
   *	
   * @public
   * @function
   * @api stable
   */
  selectAllSandboxPolygon() {
    if (this.entityLayer_.getFeatures().length > 0) {
      this.deactiveControls();
      this.unselectControls();
      this.entityLayer_.selectAllFeatures();
    } else {
      M.dialog.info(getValue('dialog_noGeometry'));
    }
  }

  /**
   * This function deselects all features in sandboxlayer
   *	
   * @public
   * @function
   * @api stable
   */
  deselectAllSandboxPolygon() {
    if (this.entityLayer_.selectedFeatures_.length > 0) {
      this.deactiveControls();
      this.unselectControls();
      this.entityLayer_.unselectAllFeatures();
    } else {
      M.dialog.info(getValue('dialog_noGeometry_selected'));
    }
  }

  /**
   * This function activate the modify geometry interaction
   *
   * @public
   * @function
   * @param {evt} event
   * @api stable
   */
  modifyPolygon(evt) {
    if (this.entityLayer_.selectedFeatures_.length > 0) {
      this.restoreDefaultClassDropdownButtons();
      this.deactiveControls();
      if (evt.currentTarget.className.indexOf("selected") < 0) {
        this.unselectControls();
        evt.currentTarget.className += " selected";
        var featuresSelected = this.entityLayer_.selectedFeatures_;
        for (let i = 0; i < featuresSelected.length; i++) {
          var styles = this.impl_.getModifyStyle(this.entityLayer_.getImplFeature(featuresSelected[i]));
          this.entityLayer_.getImplFeature(featuresSelected[i]).setStyle(styles);
        }
        var callback = this.onPolygonModified.bind(this);
        this.modifyGeomControl.activate(callback);
        this.snappingControl.deactivate();
        if (this.snappingButton.className.indexOf("selected") > 0) {
          this.snappingControl.activate(null, null);
        }
      } else {
        this.unselectControls();
      }
    } else {
      M.dialog.info(getValue('dialog_noGeometry_selected'));
    }
  }

  /**
   * Callback for the modify geometry interaction
   *
   * @public
   * @function
   * @param {evt} event
   * @api stable
   */
  onPolygonModified(evt) {
    // eslint-disable-next-line no-unused-vars
    let olFeature = null;
    const features = evt.features.getArray();
    for (var i = 0; i < features.length; i++) {
      var rev = features[i].getRevision();
      if (rev > 1) {
        // eslint-disable-next-line no-unused-vars
        let olFeature = features[i];
      }
    }
  }

  /**
   * This function activate the insert line interaction in order to divide selected polygons
   *
   * @public
   * @function
   * @param {evt} event
   * @api stable
   */
  dividePolygon(evt) {
    this.restoreDefaultClassDropdownButtons();
    this.deactiveControls();
    if (evt.currentTarget.className.indexOf("selected") < 0) {
      this.unselectControls();
      evt.currentTarget.className += " selected";
      var callback = this.onPolygonDivided.bind(this);
      this.insertTemporalGeomControl.activate(callback, 'LineString');
      document.body.style.cursor = 'pointer';
    } else {
      this.unselectControls();
    }
  }

  /**
   * Callback for the insert line interaction in order to divide selected polygons
   *
   * @public
   * @function
   * @param {evt} event
   * @api stable
   */
  onPolygonDivided(evt) {
    var inter;
    var featuresSelected = this.entityLayer_.selectedFeatures_;
    var resultPolygons = [];
    if (featuresSelected.length > 0) {
      var feature = new M.Feature(Math.floor(Math.random() * 1000000), this.impl_.getGeoJsonFromFeature(evt.feature));
      inter = intersects(featuresSelected, feature.getGeometry());
      for (var i = 0; i < inter.length; i++) {
        resultPolygons.push(dividePolygon(feature, inter[i]));
      }
      var topologicalError = false;
      for (var j = 0; j < resultPolygons.length; j++) {
        if (resultPolygons[j] === 0 || resultPolygons[j] === -1 || resultPolygons[j] === -2 || resultPolygons[j] === undefined || resultPolygons[j] === null) {
          topologicalError = true;
        }
      }
      if (!topologicalError) {
        for (var k = 0; k < resultPolygons.length; k++) {
          this.entityLayer_.addFeatures(resultPolygons[k]);
        }
        this.entityLayer_.removeFeaturesFromSandBox(inter);
      } else {
        M.dialog.info(getValue('dialog_noValidGeometry'), getValue('geometry_divide'));
      }
    } else {
      M.dialog.info(getValue('dialog_atLeast_oneSelected'), getValue('geometry_divide'));
      return;
    }
  }

  /**
   * This function show a confirmation dialog for joining selected features
   *
   * @public
   * @function
   * @api stable
   */
  confirmDialogJoinPolygons(evt) {
    var featuresSelected = this.entityLayer_.selectedFeatures_;
    if (featuresSelected.length > 1) {
      var acceptFn = this.joinPolygons.bind(this);
      show(getValue('dialog_union'),
        getValue('dialog_union_title'), 'info', acceptFn);
    } else {
      M.dialog.info(getValue('dialog_atLeast_twoSelected'), getValue('dialog_union_title'));
    }
  }

  /**
   * This function joins adjacent selected polygons
   *
   * @public
   * @function
   * @api stable
   */
  // revisada
  joinPolygons() {
    var featuresSelected = this.entityLayer_.selectedFeatures_,
      pairTargetPolygons = [],
      targetPolygon,
      polygonsToDelete = [],
      union, areAdjacentPolygons, newFeature,
      polygonsToVerify = [];
    this.restoreDefaultClassDropdownButtons();
    close();
    for (let i = 0; i < featuresSelected.length; i++) {
      var clone = new M.Feature(featuresSelected[i].getId(), {
        "type": "Feature",
        "geometry": featuresSelected[i].getGeometry(),
        "geometry_name": "geometry",
        "properties": {}
      });
      polygonsToVerify.push(clone);
    }
    if (featuresSelected.length > 0) {
      this.deactiveControls();
      this.unselectControls();
      for (let j = 0; j < featuresSelected.length; j++) {
        targetPolygon = featuresSelected[j];
        for (let k = 0; k < polygonsToVerify.length; k++) {
          pairTargetPolygons.push(targetPolygon);
          var jstsGeomFeature1 = getJSTSGeometry(targetPolygon.getGeometry());
          var jstsGeomFeature2 = getJSTSGeometry(polygonsToVerify[k].getGeometry());
          areAdjacentPolygons = jstsGeomFeature1.intersects(jstsGeomFeature2);
          if (areAdjacentPolygons === true && targetPolygon.equals(polygonsToVerify[k]) === false) {
            polygonsToDelete.push(this.entityLayer_.getImplFeature(targetPolygon));
            pairTargetPolygons.push(polygonsToVerify[k]);
            union = unionFeature(pairTargetPolygons[0], pairTargetPolygons[1]);
            union.setId(Math.floor(Math.random() * 1000000));
            pairTargetPolygons = [];
            this.entityLayer_.addNewMFeatureToSandBox(union);
            polygonsToDelete.push(polygonsToVerify[k]);
            this.entityLayer_.removeFeaturesFromSandBox(polygonsToDelete);
            for (let l = 0; l < polygonsToDelete.length; l++) {
              var index = polygonsToVerify.indexOf(polygonsToDelete[l]);
              if (index > -1) {
                polygonsToVerify.splice(index, 1);
              }
            }
            var jsonFeature = union.getGeoJSON();
            newFeature = new M.Feature(union.getId(), jsonFeature);
            targetPolygon = newFeature;
            k = 0;
            j = 0;
          } else {
            pairTargetPolygons = [];
          }
        }
      }
    } else {
      M.dialog.info(getValue('dialog_atLeast_twoSelected'));
      return;
    }
  }

  /**
   * This function activate the select geometry interaction in order to intersect selected polygons
   *
   * @public
   * @function
   * @param {evt} event
   * @api stable
   */
  intersectPolygon(evt) {
    this.restoreDefaultClassDropdownButtons();
    var featuresSelected = this.entityLayer_.selectedFeatures_;
    if (featuresSelected.length === 0) {
      M.dialog.info(getValue('dialog_removeFeatures_noGeometry'), getValue('dialog_intersect_title'));
      return;
    }
    this.deactiveControls();
    if (evt.currentTarget.className.indexOf("selected") < 0) {
      this.unselectControls();
      evt.currentTarget.className += " selected";
      document.body.style.cursor = 'pointer';
      var callback = this.onPolygonIntersected.bind(this);
      this.selectGeomControl.activate(callback);
      this.highlightControl.activate();
    } else {
      this.highlightControl.deactivate();
      this.unselectControls();
    }
  }

  /**
   * Callback for the select geometry interaction in order to intersect selected polygons
   *
   * @public
   * @function
   * @param {evt} event
   * @api stable
   */
  onPolygonIntersected(evt) {
    var inter, featuresSelected;
    featuresSelected = this.entityLayer_.selectedFeatures_;
    if (featuresSelected.length > 0) {
      inter = intersects(featuresSelected, this.entityLayer_.getMFeatureById(evt.selected[0].getId()).getGeometry());
      if (inter.length > 0) {
        var args = [];
        args.push(inter);
        args.push(this.entityLayer_.getMFeatureById(evt.selected[0].getId()));
        this.doSpatialProcess(intersection, args);
        this.clear();
      }
    }
  }

  /**
   * This function activate the select geometry interaction in order to empty selected polygons
   *
   * @public
   * @function
   * @param {evt} event
   * @api stable
   */
  emptyPolygon(evt) {
    this.restoreDefaultClassDropdownButtons();
    var featuresSelected = this.entityLayer_.selectedFeatures_;
    if (featuresSelected.length === 0) {
      M.dialog.info(getValue('dialog_removeFeatures_noGeometry'), getValue('dialog_empty_title'));
      return;
    }
    this.deactiveControls();
    if (evt.currentTarget.className.indexOf("selected") < 0) {
      this.unselectControls();
      evt.currentTarget.className += " selected";
      document.body.style.cursor = 'pointer';
      var callback = this.onGeometryEmptied.bind(this);
      this.selectGeomControl.activate(callback);
      this.highlightControl.activate();
    } else {
      this.highlightControl.deactivate();
      this.unselectControls();
    }
  }

  /**
   * Callback for the select geometry interaction in order to empty selected polygons
   *
   * @public
   * @function
   * @param {evt} event
   * @api stable
   */
  onGeometryEmptied(evt) {
    var featuresSelected = this.entityLayer_.selectedFeatures_;
    if (featuresSelected.length > 0) {
      var args = [];
      args.push(featuresSelected);
      args.push(this.entityLayer_.getMFeatureById(evt.selected[0].getId()));
      this.doSpatialProcess(difference, args);
      this.clear();
    }
  }

  /**
   * This function launch the spatialProcess
   *
   * @public
   * @function
   * @param {Object} fnProcess - process function in editionSpatialEngine
   * @param {Array} args - arguments for fnProcess function
   * @api stable
   */
  doSpatialProcess(fnProcess, args) {
    var featuresSelected = args[0];
    var plantillaRecorte = args[1];

    for (let i = 0; i < featuresSelected.length; i++) {
      var olFeature = featuresSelected[i];

      if (plantillaRecorte !== olFeature) {
        var difference = fnProcess.apply(this, [olFeature, plantillaRecorte]);
        var feature = new M.Feature(Math.floor(Math.random() * 1000000) + 1, {
          "type": "Feature",
          "geometry": difference,
          "geometry_name": "geometry",
          "properties": {}
        });
        if (feature.getGeometry().type === "MultiPolygon") {
          var featureTmp = this.impl_.createOLPolygonFeature(feature);
          this.entityLayer_.addNewMFeatureToSandBox(featureTmp);
        } else {
          this.entityLayer_.addNewMFeatureToSandBox(feature);
        }
      }

      if (featuresSelected.length > 1 || (featuresSelected.length === 1 && plantillaRecorte !== olFeature)) {
        this.entityLayer_.removeFeaturesFromSandBox([olFeature]);
      }
    }
  }

  addGeom(evt) {
    let capasVectoriales = [];
    this.facadeMap_.getLayers().forEach(function (layer) {
      if (layer instanceof M.layer.Vector && layer.name != 'editionLayer') {
        if (layer.getFeatures().length > 0) {
          capasVectoriales.push(layer);
        }
      }
    });

    var acceptFn = this.addGeomFromVectorialLayer.bind(this);
    show(getValue('dialog_add_geometry'),
      getValue('dialog_add_geometry_title'), 'info', acceptFn, undefined, capasVectoriales);
  }

  addGeomFromVectorialLayer(layerName) {
    // TODO: Resolver asincronia de spinner
    //showSpinner(mapContainer);
    let layerVectorial = this.facadeMap_.getLayers({ 'name': layerName })[0];
    // TODO: Se debe vaciar la capa sanbox antes de copiar los nuevos elementos?
    this.entityLayer_.removeAllFeatures();
    // Se cambia el tipo de geometria si es necesario
    // Sabemos que la capa no esta vacia
    let tipoGeometria = layerVectorial.getFeatures()[0].getGeometry().type;
    this.entityLayer_.setType(tipoGeometria);

    // Se clonan y añaden los features
    layerVectorial.getFeatures().forEach(element => {
      // En principio se clonan los features, con atributos
      // TODO: M.utils.extends, recursion
      let json = element.getGeoJSON();
      let clon = new M.Feature(element.getId(), json);

      this.entityLayer_.addNewMFeatureToSandBox(clon);
    });
    //closeSpinner(mapContainer);
    close();

  }


  /**
   * This function checks if WFSManager Plugin is loaded
   *
   * @public
   * @function
   * @api stable
   */
  checkWFSManagerPlugin() {
    var wfsCatalog = this.facadeMap_.getPanels('Catalog')[0].getControls()[0];
    if (wfsCatalog) {
      for (let i = 0; i < wfsCatalog.controls_.length; i++) {
        if (wfsCatalog.controls_[i].name === "WFSManagerControl") {
          this.WFSManagerCtl = wfsCatalog.controls_[i];
        }
      }
      return this.WFSManagerCtl !== null;
    } else {
      return false;
    }
  }

  /**
   * This function does a zoom to sandbox layer
   *
   * @public
   * @function
   * @param {evt} event
   * @api stable
   */
  zoomToSandBox(evt) {
    this.manageSelectedClassInDropdown(evt);
    if (this.entityLayer_.getFeatures().length > 0) {
      this.entityLayer_.zoomToFeatures(this.entityLayer_.getFeatures());
    } else {
      M.dialog.info(getValue('dialog_noGeometry'), getValue('dialog_zoom_title'));
    }
  }

  /**
   * This function does a zoom to features selected in sandbox layer
   *
   * @public
   * @function
   * @param {evt} event
   * @api stable
   */
  zoomToSelection(evt) {
    this.manageSelectedClassInDropdown(evt);
    if (this.entityLayer_.selectedFeatures_.length > 0) {
      this.entityLayer_.zoomToFeatures(this.entityLayer_.selectedFeatures_);
    } else {
      M.dialog.info(getValue('dialog_removeFeatures_noGeometry'), getValue('dialog_zoom_select'));
    }
  }

  /**
   * This function does a filtered WFS GetFeature from active service in WFSManager Plugin
   *
   * @public
   * @function
   * @param {evt} event
   * @api stable
   */
  getWfsFeatures(evt) {
    var this_ = this;
    evt.preventDefault();
    var mapContainer = document.getElementsByClassName("m-mapea-container")[0];
    M.EditionSpinner.show(mapContainer);
    var requestParams = this.WFSManagerCtl.getServiceActive();
    var featureRequest = this.impl_.getFeatureRequestBody(requestParams, evt.coordinate);
    var options = { jsonp: requestParams.useProxy };
    var body = new XMLSerializer().serializeToString(featureRequest);
    M.proxy(requestParams.useProxy);

    M.remote.post(requestParams.url, body, options)
      .then(function (response) {
        M.proxy(true);
        if (response.code === 200) {
          var numberFeatures = Number(response.xml.documentElement.getAttribute("numberOfFeatures"));
          if (numberFeatures < 1) {
            M.EditionSpinner.close(mapContainer);
            M.dialog.info(getValue('dialog_not_found') + requestParams.description);
          } else {
            return response.text;
          }
        } else {
          M.dialog.error(getValue('dialog_cannot_consult'));
          return;
        }
      }).then(function (text) {
        var features = this_.entityLayer_.readGML3Features(text);
        if (features.length > 0) {
          for (let i = 0; i < features.length; i++) {
            this_.entityLayer_.addNewFeatureToSandBox(features[i]);
          }
          M.EditionSpinner.close(mapContainer);
        } else {
          M.EditionSpinner.close(mapContainer);
          M.dialog.info(getValue('dialog_not_found') + requestParams.description);
        }
      }).catch(function (e) {
        M.EditionSpinner.close(mapContainer);
        M.dialog.error(getValue('dialog_cannot_consult'));
      });
  }

  /**
   * This function deactivates all controls
   *
   * @public
   * @function
   * @api stable
   */
  deactiveControls() {
    this.insertGeomControl.deactivate();
    this.insertTemporalGeomControl.deactivate();
    this.modifyGeomControl.deactivate();
    //this.translateGeomControl.deactivate();
    this.selectGeomControl.deactivate();
    this.snappingControl.deactivate();
    this.highlightControl.deactivate();
    var mapImpl = this.facadeMap_.getMapImpl();
    mapImpl.un('click', this.getWfsFeatures, this);
  }

  /**
   * This function unselects all controls
   *
   * @public
   * @function
   * @api stable
   */
  unselectControls() {
    this.insertPolygonButton.className = this.insertPolygonButton.className.replace(" selected", "");
    this.addGeomButton.className = this.addGeomButton.className.replace(" selected", "");
    this.selectPolygonButton.className = this.selectPolygonButton.className.replace(" selected", "");
    this.selectPolygonByLineButton.className = this.selectPolygonByLineButton.className.replace(" selected", "");
    this.selectPolygonByAreaButton.className = this.selectPolygonByAreaButton.className.replace(" selected", "");
    this.modifyPolygonButton.className = this.modifyPolygonButton.className.replace(" selected", "");
    this.dividePolygonButton.className = this.dividePolygonButton.className.replace(" selected", "");
    this.intersectPolygonButton.className = this.intersectPolygonButton.className.replace(" selected", "");
    this.emptyPolygonButton.className = this.emptyPolygonButton.className.replace(" selected", "");
    this.removeFromSandBoxButton.className = this.removeFromSandBoxButton.className.replace(" selected", "");

    var featuresSelected = this.entityLayer_.selectedFeatures_;
    for (let i = 0; i < featuresSelected.length; i++) {
      featuresSelected[i].getImpl().getOLFeature().setStyle(this.entityLayer_.getSelectedStyle());
    }

    document.body.style.cursor = 'default';
  }

  /**
   * This function execute both deactivate all controls and unselect all controls functions
   *
   * @public
   * @function
   * @api stable
   */
  clear() {
    this.unselectControls();
    this.deactiveControls();
  }

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @public
   * @function
   * @param {*} obj - Object to compare
   * @returns {boolean} equals - Returns if they are equal or not
   * @api stable
   */
  equals(obj) {
    var equals = false;
    if (obj instanceof M.control.EditionGeometryControl) {
      equals = (this.name === obj.name);
    }
    return equals;
  }

  /**
   * This function destroys this plugin
   *
   * @public
   * @function
   * @api stable
   */
  destroy() {
    this.getImpl().destroy();
  }

}
