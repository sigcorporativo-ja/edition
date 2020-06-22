// @namespace("M.impl")
export default class editionLayer extends M.impl.Layer {

  /**
   * @classdesc
   * Main constructor of the class. 
   *
   * @constructor
   * @extends {M.impl.Layer}
   * @api stable
   */
  constructor(base) {

    super();
    /**
     * Type of the layer
     * @private
     * @type {String}
     */
    this.base_ = base;
    /**
     * Type of the layer
     * @private
     * @type {String}
     */
    this.map_ = base.facadeMap_;
    /**
     * Type of the layer
     * @private
     * @type {String}
     */
    this.ol3Layer_ = null;
    /**
     * Name of the layer
     * @private
     * @type {String}
     */
    this.isVisible_ = true;
    /**
     * Name of the layer
     * @private
     * @type {String}
     */
    this.isModified_ = false;
    /**
     * Name of the layer
     * @private
     * @type {String}
     */
    this.sandBoxFeatures_ = [];
    /**
     * Name of the layer
     * @private
     * @type {String}
     */
    this.sandBoxLayer_ = null;
    /**
     * Name of the layer
     * @private
     * @type {String}
     */
    this.selectedFeatures_ = [];
    /**
     * Name of the layer
     * @private
     * @type {String}
     */
    this.deletedFeatures_ = [];
    /**
     * Facade of the map
     * @private
     * @type {M.Map}
     */
    this.geometry = undefined;

    this.type_ = 'MultiPolygon';

    this.addTo(this.map_);

  }

  /**
   * This function sets the map object of the layer
   *
   * @public
   * @function
   * @param {M.Map} map
   * @api stable
   */
  addTo() {
    this.sandBoxLayer_ = new M.layer.Vector();
    this.sandBoxLayer_.name = 'editionLayer';
    this.sandBoxLayer_.setZIndex(M.impl.Map.Z_INDEX[M.layer.type.WFS] + 999);
    this.map_.addLayers(this.sandBoxLayer_);
    this.ol3Layer_ = this.sandBoxLayer_.getImpl().getOL3Layer();
    this.ol3Layer_.setStyle(this.selectableStyle(this.getSandBoxStyle()));
    this.sandBoxLayer_.setStyle(new M.style.Polygon({
      fill: {
        color: 'red',
        opacity: 0.5,
      },
      stroke: {
        color: '#FF0000',
        width: 2
      }
    }))
    this.setVisible(true);
  }


  setStyle(style) {
    this.sandBoxLayer_.setStyle(style);
  }


  /**
   * This function sets the map object of the layer
   *
   * @public
   * @function
   * @param {M.Map} map
   * @api stable
   */
  selectableStyle(style) {
    var this_ = this;
    return function() {
      if (this_.base_.highlightControl.getImpl().highlightInteraction_ === null) {
        return style;
      } else {
        return this_.base_.highlightControl.getImpl().highlightInteraction_.getFeatures().getArray().indexOf(this) == -1 ? style : this_.base_.highlightControl.getImpl().highlightStyle;
      }
    };
  }

  /**
   * This function sets the map object of the layer
   *
   * @public
   * @function
   * @param {M.Map} map
   * @api stable
   */
  getType() {
    // TODO: Poder especificar tipo de geometria de la capa en el plugin
    return this.type_;
  }

  /**
   * This function sets the map object of the layer
   *
   * @public
   * @function
   * @param {M.Map} map
   * @api stable
   */
  setType(tipoGeometria) {

    this.type_ = tipoGeometria;

    // Se adapta el estilo al tipo de geometria
    if (tipoGeometria === 'MultiPoint' || tipoGeometria === 'Point') {
      this.sandBoxLayer_.setStyle(new M.style.Point({
        radius: 5,
        fill: {
          color: 'red',
          opacity: 0.5
        },
        stroke: {
          color: '#FF0000'
        }
      }));
    } else if (tipoGeometria === 'MultiPolygon' || tipoGeometria === 'Polygon') {
      this.sandBoxLayer_.setStyle(new M.style.Polygon({
        fill: {
          color: 'red',
          opacity: 0.5,
        },
        stroke: {
          color: '#FF0000',
          width: 2
        }
      }));
    } else if (tipoGeometria === 'MultiLineString' || tipoGeometria === 'LineString') {
      // TODO: LINEAL
    }
  }


  /**
   * This function sets the map object of the layer
   *
   * @public
   * @function
   * @param {M.Map} map
   * @api stable
   */
  getImplLayer() {
    return this.ol3Layer_;
  }

  /**
   * This function returns an olFeature when a Mapea feature is passed as a paremeter
   *
   * @public
   * @function
   * @param {Object} Mfeature
   * @returns {Object} olFeature
   * @api stable
   */
  getImplFeature(Mfeature) {
    return Mfeature.getImpl().getOLFeature();
  }

  /**
   * This function sets the map object of the layer
   *
   * @public
   * @function
   * @param {M.Map} map
   * @api stable
   */
  getFeatureCollectionById(idFeature) {
    var features = this.ol3Layer_.getSource().getFeatures();
    for (let i = 0; i < features.length; i++) {
      if (features[i].getId() === idFeature) {
        return new ol.Collection([features[i]]);
      }
    }
  }

  /**
   * This function sets the map object of the layer
   *
   * @public
   * @function
   * @param {M.Map} map
   * @api stable
   */
  getFeatureCollection() {
    var features = this.ol3Layer_.getSource().getFeatures();
    return new ol.Collection([features]);
  }

  /**
   * This function sets the map object of the layer
   *
   * @public
   * @function
   * @param {M.Map} map
   * @api stable
   */
  // DEVUELVE OL.
  getSelectedFeatureCollection() {
    var features = [];
    for (let i = 0; i < this.selectedFeatures_.length; i++) {
      features.push(this.selectedFeatures_[i].getImpl().getOLFeature());
    }
    return new ol.Collection(features);
  }

  /**
   * This function sets the map object of the layer
   *
   * @public
   * @function
   * @param {M.Map} map
   * @api stable
   */
  getOLFeatures() {
    return this.ol3Layer_.getSource().getFeatures();
  }

  /**
   * This function sets the map object of the layer
   *
   * @public
   * @function
   * @param {M.Map} map
   * @api stable
   */
  getFeatures() {
    return this.sandBoxLayer_.getFeatures();
  }

  /**
   * This function sets the map object of the layer
   *
   * @public
   * @function
   * @param {M.Map} map
   * @api stable
   */
  addFeatures(features) {
    return this.sandBoxLayer_.addFeatures(features);
  }

  /**
   * This function sets the map object of the layer
   *
   * @public
   * @function
   * @param {M.Map} map
   * @api stable
   */
  hasGeometry() {
    var features = this.ol3Layer_.getSource().getFeatures();
    return features.length > 0;
  }

  /**
   * This function sets the map object of the layer
   *
   * @public
   * @function
   * @param {M.Map} map
   * @api stable
   */
  getGeometry() {
    return this.geometry;
  }

  /**
   * Zooms the view to the layer extent
   *
   * @public
   * @function
   * @api stable
   */
  getCoordinatesFromFeature(feature) {
    return feature.getGeometry().getCoordinates();
  }

  /**
   * Zooms the view to the layer extent
   *
   * @public
   * @function
   * @api stable
   */
  getCoordinatesFromFeatureById(idFeature) {
    const foundFeature = this.getFeatureById(idFeature);
    if (foundFeature !== null) {
      return foundFeature.getGeometry().getCoordinates();
    } else {
      return null;
    }
  }

  /**
   * This function sets the map object of the layer
   *
   * @public
   * @function
   * @param {M.Map} map
   * @api stable
   */
  readGML3Features(gmlText) {
    var proj = new ol.proj.Projection({
      code: 'http://www.opengis.net/gml/srs/epsg.xml#25830',
      axis: 'enu'
    });
    ol.proj.addEquivalentProjections([ol.proj.get(this.map_.getProjection().code), proj]);
    return new ol.format.GML3().readFeatures(gmlText, this.map_.getProjection());
  }

  /**
   * This function sets the map object of the layer
   *
   * @public
   * @function
   * @param {M.Map} map
   * @api stable
   */
  addFeature(olFeature) {
    var geojsonFormat = new ol.format.GeoJSON();
    var jsonFeature = geojsonFormat.writeFeatureObject(olFeature);
    var newFeature = new M.Feature(olFeature.getId(), jsonFeature);
    this.sandBoxLayer_.addFeatures(newFeature);
    return newFeature;
  }

  /**
   * Zooms the view to the layer extent
   *
   * @public
   * @function
   * @api stable
   */
  removeFeatureById(featureId) {
    var foundFeature = this.sandBoxLayer_.getFeatureById(featureId);
    if (foundFeature !== undefined) {
      this.sandBoxFeatures_ = [];
      this.selectedFeatures_ = [];
      this.sandBoxLayer_.removeFeatures([foundFeature]);
      this.deletedFeatures_.push(foundFeature);
      this.isModified_ = true;
      return [foundFeature.getId()];
    } else {
      return false;
    }
  }

  /**
   * Zooms the view to the layer extent
   *
   * @public
   * @function
   * @api stable
   */
  removeFeature(MFeature) {
    var this_ = this;
    this.sandBoxLayer_.getFeatures().forEach(function(feature) {
      if (feature === MFeature) {
        this_.sandBoxLayer_.removeFeatures([feature]);
      }
    });
  }

  /**
   * Zooms the view to the layer extent
   *
   * @public
   * @function
   * @api stable
   */
  removeAllFeatures() {
    var features = this.sandBoxLayer_.getFeatures();
    this.sandBoxLayer_.removeFeatures(features);
    Array.prototype.push.apply(this.deletedFeatures_, features);
    this.sandBoxFeatures_ = [];
    this.selectedFeatures_ = [];
    this.isModified_ = true;
    return true;
  }

  /**
   * Zooms the view to the layer extent
   *
   * @public
   * @function
   * @api stable
   */
  addFeaturesToSandBox(featuresArray) {
    var this_ = this;
    featuresArray.forEach(function(feature, index, array) {
      var featureAlreadyAdded = false;
      for (let i = 0; i < this_.sandBoxLayer_.getFeatures().length; i++) {
        if (this_.sandBoxLayer_.getFeatures()[i].getImpl().getId() === Number(feature.id)) {
          featureAlreadyAdded = true;
          break;
        }
      }

      if (!featureAlreadyAdded) {
        var jsonFeature = {
          "type": "Feature",
          "geometry": {
            "type": feature.type,
            "coordinates": feature.coordinates
          }
        };

        var newFeature = new M.Feature(feature.id, jsonFeature);
        this_.sandBoxLayer_.addFeatures(newFeature);
      }
    });
  }

  /**
   * Zooms the view to the layer extent
   *
   * @public
   * @function
   * @api stable
   */
  addNewFeatureToSandBox(olFeature) {
    var geojsonFormat = new ol.format.GeoJSON();
    var jsonFeature = geojsonFormat.writeFeatureObject(olFeature);
    var newFeature = new M.Feature(olFeature.getId(), jsonFeature);
    this.sandBoxLayer_.addFeatures(newFeature);
  }

  addNewMFeatureToSandBox(feature) {
    this.sandBoxLayer_.addFeatures(feature);
  }

  /**
   * Zooms the view to the layer extent
   *
   * @public
   * @function
   * @api stable
   */
  removeFeaturesFromSandBox(featuresArray) {
    var i = featuresArray.length;
    while (i--) {
      var foundFeature = this.sandBoxLayer_.getFeatureById(featuresArray[i].getId());
      if (foundFeature !== undefined) {
        if (foundFeature instanceof M.Feature) {
          this.unselectFeature(foundFeature.getImpl().getOLFeature());
        } else {
          this.unselectFeature(foundFeature);
        }
        this.sandBoxLayer_.removeFeatures(foundFeature);
      }
    }
  }


  /**
   * Zooms the view to the layer extent
   *
   * @public
   * @function
   * @api stable
   */
  selectFeature(olFeature) {
    var foundFeature = this.sandBoxLayer_.getFeatureById(olFeature.getId());
    if (foundFeature !== undefined) {
      foundFeature.getImpl().getOLFeature().setStyle(this.selectableStyle(this.getSelectedStyle()));
      this.selectedFeatures_.push(foundFeature);
    }
  }

  /**
   * Zooms the view to the layer extent
   *
   * @public
   * @function
   * @api stable
   */
  unselectFeature(olFeature) {
    var i = this.selectedFeatures_.length;
    while (i--) {
      if (this.selectedFeatures_[i].getImpl().getOLFeature().getId() === olFeature.getId()) {
        this.selectedFeatures_[i].getImpl().getOLFeature().setStyle(this.selectableStyle(this.getSandBoxStyle()));
        this.selectedFeatures_.splice(i, 1);
      }
    }
  }

  /**
   * Zooms the view to the layer extent
   *
   * @public
   * @function
   * @api stable
   */
  selectAllFeatures() {
    var allFeatures = this.sandBoxLayer_.getFeatures();
    for (let i = 0; i < allFeatures.length; i++) {
      if (this.selectedFeatures_.length > 0) {
        var index = this.selectedFeatures_.indexOf(allFeatures[i]);
        if (index === -1) {
          this.selectFeature(allFeatures[i]);
        }
      } else {
        this.selectFeature(allFeatures[i]);
      }
    }
  }

  /**
   * Zooms the view to the layer extent
   *
   * @public
   * @function
   * @api stable
   */
  unselectAllFeatures() {
    var allFeatures = this.sandBoxLayer_.getFeatures();
    for (let i = 0; i < allFeatures.length; i++) {
      allFeatures[i].getImpl().getOLFeature().setStyle(this.selectableStyle(this.getSandBoxStyle()));
    }
    this.selectedFeatures_ = [];
  }

  /**
   * Zooms the view to the layer extent
   *
   * @public
   * @function
   * @api stable
   */
  getGeometriesExtension() {
    var features = this.ol3Layer_.getSource().getFeatures();
    var extent = new ol.extent.createEmpty();
    features.forEach(function(f, index, array) {
      ol.extent.extend(extent, f.getGeometry().getExtent());
    });

    return extent;
  }

  /**
   * Zooms the view to the features array
   *
   * @public
   * @function
   * @api stable
   */
  getOLFeaturesExtensionByAttribute(featuresIdArray, attribute) {
    var foundFeatures = [];
    for (let i = 0; i < featuresIdArray.length; i++) {
      var foundFeature = this.getOLFeatureByUniqueAttribute(Number(featuresIdArray[i]), attribute);
      foundFeatures.push(foundFeature);
    }

    var extent = new ol.extent.createEmpty();
    foundFeatures.forEach(function(f, index, array) {
      if (f !== null) {
        ol.extent.extend(extent, f.getGeometry().getExtent());
      }
    });

    return extent;
  }

  /**
   * Zooms the view to the features array
   *
   * @public
   * @function
   * @api stable
   */
  getOLFeaturesExtension(Mfeatures) {
    var olFeatures = [];
    for (let i = 0; i < Mfeatures.length; i++) {
      var olFeature = Mfeatures[i].getImpl().getOLFeature();
      olFeatures.push(olFeature);
    }

    var extent = new ol.extent.createEmpty();
    olFeatures.forEach(function(f, index, array) {
      if (f !== null) {
        ol.extent.extend(extent, f.getGeometry().getExtent());
      }
    });

    return extent;
  }


  /**foundFeature
   * Zooms the view to the layer extent
   *
   * @public
   * @function
   * @api stable
   */
  zoomToLayer() {
    if (this.ol3Layer_.getSource().getFeatures().length > 0) {
      var features = this.ol3Layer_.getSource().getFeatures();
      var extent = new ol.extent.createEmpty();
      features.forEach(function(f) {
        ol.extent.extend(extent, f.getGeometry().getExtent());
      });
      this.map_.getMapImpl().getView().fit(extent, { duration: 500 });
    }
  }

  /**
   * Zooms the view to the features array
   *
   * @public
   * @function
   * @api stable
   */
  zoomToFeatures(Mfeatures) {
    try {
      let extent = M.impl.utils.getFeaturesExtent(Mfeatures);
      this.map_.setBbox(extent);
    } catch (e) {
      M.dialog.info("No existe ninguna geometría asociada");
    }
  }

  /**
   * Zooms the view to the features array
   *
   * @public
   * @function
   * @api stable
   */
  zoomToFeaturesByIdsArray(featuresIdArray, attribute) {
    try {
      var extent = this.getOLFeaturesExtensionByAttribute(featuresIdArray, attribute);
      this.map_.getMapImpl().getView().fit(extent, { maxZoom: 12, duration: 500 });
    } catch (e) {
      M.dialog.info("No existe ninguna geometría asociada");
    }
  }

  /**
   * Zooms the view to the layer extent
   *
   * @public
   * @function
   * @api stable
   */
  zoomToFeatureById(featureId) {
    var foundFeature = this.getFeatureById(featureId);
    if (foundFeature !== null) {
      var extent = new ol.extent.createEmpty();
      ol.extent.extend(extent, foundFeature.getGeometry().getExtent());
      this.map_.getMapImpl().getView().fit(extent, { maxZoom: 12, duration: 500 });
    }
  }

  /**
   * Zooms the view to the layer extent
   *
   * @public
   * @function
   * @api stable
   */
  getMFeatureByUniqueAttribute(value, attr) {
    var MFeatures = this.sandBoxLayer_.getFeatures();
    for (let i = 0; i < MFeatures.length; i++) {
      if (MFeatures[i].getAttribute(attr) === value) {
        return MFeatures[i];
      }
    }
  }

  /**
   * Zooms the view to the layer extent
   *
   * @public
   * @function
   * @api stable
   */
  getFeatureById(featureId) {
    let foundFeature = null;
    if (this.ol3Layer_.getSource().getFeatures().length > 0) {
      var features = this.ol3Layer_.getSource().getFeatures();
      features.forEach(function(f, index, array) {
        if (f.getId() === featureId) {
          foundFeature = f;
          return true;
        }
      });
    }

    return foundFeature;
  }

  getMFeatureById(featureId) {
    let foundFeature = null;
    foundFeature = this.sandBoxLayer_.getFeatureById(featureId);
    return foundFeature;
  }

  /**
   * Zooms the view to the layer extent
   *
   * @public
   * @function
   * @api stable
   */
  getOLFeatureByUniqueAttribute(value, attr) {
    let foundFeature = null;
    if (this.ol3Layer_.getSource().getFeatures().length > 0) {
      var features = this.ol3Layer_.getSource().getFeatures();
      features.forEach(function(f, index, array) {
        if (f.get(attr) === value) {
          foundFeature = f;
          return true;
        }
      });
    }

    return foundFeature;
  }

  /**
   * Zooms the view to the layer extent
   *
   * @public
   * @function
   * @api stable
   */
  getDeletedFeatures() {
    return this.deletedFeatures_;
  }

  /**
   * Zooms the view to the layer extent
   *
   * @public
   * @function
   * @api stable
   */
  clearDeletedFeaturesArray() {
    this.deletedFeatures_ = [];
  }

  /**
   * Zooms the view to the layer extent
   *
   * @public
   * @function
   * @api stable
   */
  rollbackFeatures(clonedFeatures) {
    this.ol3Layer_.getSource().addFeatures(clonedFeatures);
  }

  /**
   * This function sets the map object of the layer
   *
   * @public
   * @function
   * @param {M.Map} map
   * @api stable
   */
  clear() {
    this.ol3Layer_.getSource().clear();
  }

  /**
   * This function sets the map object of the layer
   *
   * @public
   * @function
   * @param {M.Map} map
   * @api stable
   */
  refresh() {
    this.ol3Layer_.getSource().refresh();
  }

  /**
   * This function destroys this layer, clearing the HTML
   * and unregistering all events
   *
   * @public
   * @function
   * @api stable
   */
  destroy() {
    var olMap = this.map_.getMapImpl();
    if (!M.utils.isNullOrEmpty(this.ol3Layer_)) {
      olMap.removeLayer(this.ol3Layer_);
      this.ol3Layer_ = null;
    }
    this.map_.removeLayers(this.sandBoxLayer_);
    this.map_ = null;
    this.popup_ = null;
    this.sandBoxFeatures_ = [];
    this.name = null;
  }

  /**
   * This function sets the map object of the layer
   *
   * @public
   * @function
   * @param {M.Map} map
   * @api stable
   */
  getSandBoxStyle() {
    return new ol.style.Style({
      fill: new ol.style.Fill({
        color: [93, 95, 229, 0.2]
      }),
      stroke: new ol.style.Stroke({
        color: 'blue',
        width: 2
      })
    });
  }

  /**
   * This function sets the map object of the layer
   *
   * @public
   * @function
   * @param {M.Map} map
   * @api stable
   */
  getSelectedStyle() {
    return new ol.style.Style({
      fill: new ol.style.Fill({
        color: [249, 232, 6, 0.1]
      }),
      stroke: new ol.style.Stroke({
        color: 'yellow',
        width: 2
      })
    });
  }

}
