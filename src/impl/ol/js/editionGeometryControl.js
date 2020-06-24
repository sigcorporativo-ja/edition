// @namespace("M.impl.control")
export default class EditionGeometryControl extends M.impl.Control {
  /**
   * @classdesc
   * Main constructor of the EditionGeometryControl.
   *
   * @constructor
   * @extends {M.impl.Control}
   * @api stable
   */
  constructor(map) {
    super();
    this.map = map;
  }


  /**
   * This function adds the control to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map to add the plugin
   * @param {HTMLElement} html of the plugin
   * @api stable
   */
  addTo(map, html) {
    // super addTo
    super.addTo(map, html);
  }

  /**
   * This function set layer for modify features
   *
   * @public
   * @function
   * @param {M.layer.WFS} layer - Layer
   * @api stable
   */
  getFeaturesFromGeoJson(geojson) {
    var geojsonFormat = new ol.format.GeoJSON();
    return geojsonFormat.readFeatures(geojson);
  }

  /**
   * This function set layer for modify features
   *
   * @public
   * @function
   * @param {M.layer.WFS} layer - Layer
   * @api stable
   */
  getGeoJsonFromFeature(feature) {
    var geojsonFormat = new ol.format.GeoJSON();
    return geojsonFormat.writeFeatureObject(feature);
  }

  /**
   * This function set layer for modify features
   *
   * @public
   * @function
   * @param {M.layer.WFS} layer - Layer
   * @api stable
   */
  getFeatureRequestBody(requestParams, coordinates) {
    var point = new ol.geom.Point(coordinates);
    var srsName_ = this.map.getProjection().code;
    return new ol.format.WFS().writeGetFeature({
      srsName: srsName_,
      featurePrefix: requestParams.featurePrefix,
      featureTypes: requestParams.featureTypes,
      outputFormat: requestParams.outputFormat,
      maxFeatures: requestParams.maxFeatures,
      filter: ol.format.filter.intersects(requestParams.geomField, point, srsName_)
    });
  }

  /**
   * This function set layer for modify features
   *
   * @public
   * @function
   * @param {M.layer.WFS} layer - Layer
   * @api stable
   */
  getBbox(coordinates) {
    var bbox_ = ol.extent.boundingExtent([coordinates, coordinates]);
    for (let i = 0; i < bbox_.length; i++) {
      if (i == 2 || i == 3) {
        bbox_[i] = bbox_[i] + 0.0000000001;
      }
    }

    return bbox_;
  }

  /**
   * This function set layer for modify features
   *
   * @public
   * @function
   * @param {M.layer.WFS} layer - Layer
   * @api stable
   */
  getModifyStyle(olFeature) {
    return [
      new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(239,245,3,0.25)'
        }),
        stroke: new ol.style.Stroke({
          width: 3,
          color: 'rgba(239,245,3, 0.8)'
        }),
      }),
      new ol.style.Style({
        image: new ol.style.Circle({
          radius: 6,
          fill: new ol.style.Fill({
            color: 'rgba(230,137,16, 0.8)'
          })
        }),
        geometry: function(feature) {
          // return the coordinates of the first ring of the polygon
          var coordinates = olFeature.getGeometry().getCoordinates()[0];
          if (olFeature.getGeometry().getType() === "MultiPolygon") {
            coordinates = olFeature.getGeometry().getCoordinates()[0][0];
          }
          return new ol.geom.MultiPoint(coordinates);
        }
      })
    ];
  }

  /**
   * This function set layer for modify features
   *
   * @public
   * @function
   * @param {M.layer.WFS} layer - Layer
   * @api stable
   */
  createOLPolygonFeature(olFeature) {
    var json = olFeature.getGeometry();
    var featureTmp;

    for (let j = 0; j < json.coordinates.length; j++) {
      var polygon = json.coordinates[j];
      featureTmp = new M.Feature(Math.floor(Math.random() * 1000000), {
        "type": "Polygon",
        "geometry": polygon,
        "geometry_name": "geometry",
        "properties": {}
      });
    }

    return featureTmp;
  }
}
