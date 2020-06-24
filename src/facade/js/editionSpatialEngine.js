/*jshint undef:false */
/**
 *
 * @function
 * @api
 */
export const bufferFeature = (feature, distance) => {
  feature.setGeometry(bufferGeometry(feature.getGeoJSON().geometry, distance));
  return feature;
};

/**
 * Buffer sobre geometry geoJSON, devuelve geoJSON
 *
 * @public
 * @function
 * @api stable
 */
export const bufferGeometry = (geometry, distance) => {
  let jstsGeom = getJSTSGeometry(geometry);
  let bufferGeometry = jstsGeom.buffer(distance);
  let finalGeometry = getGeoJSONGeometry(bufferGeometry);
  return finalGeometry;
};

/**
 * @public
 * @function
 * @param {*} jstsGeometry 
 */
export const getGeoJSONGeometry = (jstsGeometry) => {
  let writter = new jsts.io.GeoJSONWriter();
  let geojsonGeometry = writter.write(jstsGeometry);
  return geojsonGeometry;
};

/**
 * Zooms the view to the layer extent
 *
 * @public
 * @function
 * @api stable
 */
export const unionFeature = (feature1, feature2) => {
  // Clonamos el feature1
  let newFeature = new M.Feature(feature1.getId(), feature1.getGeoJSON());
  newFeature.setGeometry(unionGeometry(feature1.getGeometry(), feature2.getGeometry()));
  return newFeature;

};

export const unionGeometry = (geom1, geom2) => {
  let jstsGeom1 = getJSTSGeometry(geom1);
  let jstsGeom2 = getJSTSGeometry(geom2);
  let unionGeometry = jstsGeom1.union(jstsGeom2);

  return getGeoJSONGeometry(unionGeometry);
};


/**
 * Zooms the view to the layer extent
 *
 * @public
 * @function
 * @api stable
 */
export const splitFeature = (feature, geometryLine) => {
  let jsts_geom = getJSTSGeometry(feature.getGeometry());

  if (jsts_geom._geometries !== undefined) {
    jsts_geom = jsts_geom._geometries[0];
  }

  let jsts_geom_line = getJSTSGeometry(geometryLine);
  let union = jsts_geom.getExteriorRing().union(jsts_geom_line);

  let polygonizer = getPolygonizer();
  polygonizer.add(union);
  let polygons = polygonizer.getPolygons();
  let resultFeatures = [];

  for (var i = polygons.iterator(); i.hasNext();) {

    var polygon = i.next();
    let newFeature = new M.Feature(Math.random(), feature.getGeoJSON());
    let totalHoles = jsts_geom.getNumInteriorRing();

    for (var n = 0; n < totalHoles; n++) {
      let hole = jsts_geom.getInteriorRingN(n);
      let holePolygonizer = getPolygonizer();
      holePolygonizer.add(hole);
      let holePolygons = holePolygonizer.getPolygons();

      polygon = polygon.difference(holePolygons.iterator().next());
    }
    let impl_geom = getGeoJSONGeometry(polygon);
    newFeature.setGeometry(impl_geom);
    resultFeatures.push(newFeature);
  }
  return resultFeatures;
};

/**
 * Zooms the view to the layer extent
 *
 * @public
 * @function
 * @api stable
 */
export const intersects = (features, geometryIntersects) => {
  let jsts_geom_intersects = getJSTSGeometry(geometryIntersects);
  let targetFeatures = [];

  features.forEach(function (feature) {
    var jsts_geom = getJSTSGeometry(feature.getGeometry());

    if (jsts_geom.intersects(jsts_geom_intersects)) {
      targetFeatures.push(feature);
    }

  });
  return targetFeatures;
};

/**
 * Zooms the view to the layer extent
 *
 * @public
 * @function
 * @api stable
 */
export const intersection = (feature1, feature2) => {
  let jsts_geom1 = getJSTSGeometry(feature1.getGeometry());
  let jsts_geom2 = getJSTSGeometry(feature2.getGeometry());
  let resultGeom = jsts_geom1.intersection(jsts_geom2);

  let intersectionGeom = getGeoJSONGeometry(resultGeom);
  return intersectionGeom;
};

/**
 * Zooms the view to the layer extent
 *
 * @public
 * @function
 * @api stable
 */
export const difference = (feature, feature2) => {
  var jsts_geom_difference = getJSTSGeometry(feature2.getGeometry());
  var jsts_geom = getJSTSGeometry(feature.getGeometry());
  var resultGeom = jsts_geom.difference(jsts_geom_difference);

  var impl_geom = getGeoJSONGeometry(resultGeom);
  return impl_geom;
};

/**
 * Zooms the view to the layer extent
 *
 * @public
 * @function
 * @api stable
 */
export const getJSTSGeometry = (geometry) => {
  let parser = new jsts.io.GeoJSONReader();
  let f = parser.read(geometry);
  return f;
};

/**
 * Zooms the view to the layer extent
 *
 * @public
 * @function
 * @api stable
 */
export const getPolygonizer = () => {
  return new jsts.operation.polygonize.Polygonizer();
};

/**
 * Zooms the view to the layer extent
 *
 * @public
 * @function
 * @api stable
 */
export const dividePolygon = (splitFeature, selectedFeature) => {
  let polygon2Divide = getJSTSGeometry(selectedFeature.getGeometry());
  if (polygon2Divide._geometries !== undefined) {
    polygon2Divide = polygon2Divide._geometries[0];
  }

  let line4Divide = getJSTSGeometry(splitFeature.getGeometry());

  try {
    let union = polygon2Divide.getExteriorRing().union(line4Divide);

    let polygonizer = new jsts.operation.polygonize.Polygonizer();
    polygonizer.add(union);
    let polygons = polygonizer.getPolygons();
    let polygons2Create = polygons;
    let newHole = null;

    if (polygons.size() < 2) {
      try {
        let geojsonRepresentation = selectedFeature.getGeometry();
        // eslint-disable-next-line no-undef
        let polygon2Divide2Line = turf.polygonToLine(geojsonRepresentation);
        polygon2Divide2Line.geometry.coordinates.push(splitFeature.getGeometry().coordinates);
        // eslint-disable-next-line no-undef
        let poligonos = turf.lineToPolygon(polygon2Divide2Line);
        // eslint-disable-next-line no-undef
        newHole = turf.polygon([poligonos.geometry.coordinates[poligonos.geometry.coordinates.length - 1]]);
        return dividePolygonWithHoles(newHole, selectedFeature);
      } catch (e) {
        return null;
      }
    }

    let exteriorRingTargetPoly = polygon2Divide.getExteriorRing();
    let polygonizerTarget = new jsts.operation.polygonize.Polygonizer();
    polygonizerTarget.add(exteriorRingTargetPoly);


    if (polygonizer.getGeometry().getArea() - polygonizerTarget.getGeometry().getArea() > 0.1) {
      return -1;
    } else {
      if (polygon2Divide.getNumInteriorRing() > 0) {
        if (!line4Divide.isSimple()) {
          newHole = getNewHolePolygon(polygon2Divide, line4Divide);
          return dividePolygonWithHolesJSTS(newHole, polygon2Divide, selectedFeature);
        } else {
          var result = getPolygonsOnHoles(polygonizer, polygon2Divide);
          return dividePolygonWithHolesJSTS(null, result, selectedFeature);
        }
      } else if (polygons.size() < 2) {
        return null;
      }

      return createDividedPolygons(polygons2Create, selectedFeature);
    }
  } catch (e) {
    //User has tried to divide a multipolygon
    return undefined;
  }
};

/**
 * Zooms the view to the layer extent
 *
 * @public
 * @function
 * @api stable
 */
export const getNewHolePolygon = (polygon2Divide, line4Divide) => {
  let polygonizerHole = new jsts.operation.polygonize.Polygonizer();
  let union = polygon2Divide.getExteriorRing().union(line4Divide);
  polygonizerHole.add(union);
  let polygons = polygonizerHole.getPolygons();
  for (let i = polygons.iterator(); i.hasNext();) {
    const polygon = i.next();
    if (polygon._holes.length > 0) {
      polygonizerHole.add(polygon._holes[0]);
      return polygonizerHole.getPolygons().get(0);
    }
  }
  return false;
};

/**
 * Zooms the view to the layer extent
 *
 * @public
 * @function
 * @api stable
 */
export const getPolygonsOnHoles = (polygonizer, polygon2Divide) => {
  let polygons = polygonizer.getPolygons();
  let polygonizerHoles = new jsts.operation.polygonize.Polygonizer();
  let poly1 = polygons.get(0);
  let poly2 = null;

  for (let i = 0; i < polygon2Divide._holes.length; i++) {
    polygonizerHoles.add(polygon2Divide._holes[i]);
  }

  let holes = polygonizerHoles.getPolygons();

  if (polygons.size() === 2) {
    poly2 = polygons.get(1);
  }

  for (let j = holes.iterator(); j.hasNext();) {
    const hole = j.next();
    poly1 = poly1.difference(hole);
    if (poly2 !== null)
      poly2 = poly2.difference(hole);
  }

  let result = [];
  result.push(poly1);
  if (poly2 !== null)
    result.push(poly2);

  return result;
};

/**
 * Zooms the view to the layer extent
 *
 * @public
 * @function
 * @api stable
 */
export const dividePolygonWithHolesJSTS = (newHole, polygon2Divide, selectedFeature) => {
  let polygonGeoJson, newFeature;
  let resultFeatures = [];
  let cont = 1;

  let newPolygons = [];

  if (newHole !== null) {
    var targetPolygonNoHoles = selectedFeature.getGeometry();

    var olNewTargetFeatureJSTS = polygon2Divide.difference(newHole);
    var newHoleFeatureJSTS = newHole.intersection(polygon2Divide);

    var olNewTargetFeatureJSTSgj = getGeoJSONGeometry(olNewTargetFeatureJSTS);
    var newHoleFeatureJSTSgj = getGeoJSONGeometry(newHoleFeatureJSTS);

    if (olNewTargetFeatureJSTSgj !== null && newHoleFeatureJSTSgj !== null) {
      targetPolygonNoHoles = olNewTargetFeatureJSTSgj;
      newHole = newHoleFeatureJSTSgj;
      newPolygons.push(targetPolygonNoHoles);
      newPolygons.push(newHole);
    } else {
      return -1;
    }

    for (let i = 0; i < newPolygons.length; i++) {
      newFeature = new M.Feature(Math.random(), {
        "type": "Feature",
        "id": Math.random(),
        "geometry": newPolygons[i],
        "geometry_name": "geometry",
        "properties": {}
      });
      resultFeatures.push(newFeature);
      cont += cont;
    }
  } else {
    newPolygons = polygon2Divide;

    for (let i = 0; i < newPolygons.length; i++) {
      polygonGeoJson = getGeoJSONGeometry(newPolygons[i]);
      newFeature = new M.Feature(Math.random(), {
        "type": "Feature",
        "id": Math.random(),
        "geometry": polygonGeoJson,
        "geometry_name": "geometry",
        "properties": {}
      });
      resultFeatures.push(newFeature);
      cont++;
    }
  }

  return resultFeatures;
};

/**
 * Zooms the view to the layer extent
 *
 * @public
 * @function
 * @api stable
 */
export const dividePolygonWithHoles = (newHole, selectedFeature) => {
  let resultFeatures = [];
  var cont = 1;
  let newPolygons = [];
  let geomSelected = selectedFeature.getGeometry();
  let geojsonRepresentation = geomSelected;
  let targetPolygonNoHoles = geojsonRepresentation;

  try {
    // eslint-disable-next-line no-undef
    if (!turf.booleanContains(targetPolygonNoHoles, newHole) && !turf.booleanOverlap(targetPolygonNoHoles, newHole)) {
      return -1;
    }
    let targetPolygonNoHolesJSTS = getJSTSGeometry(geomSelected);
    var newHoleJSTS = getJSTSGeometry(newHole.geometry);
    var olNewTargetFeatureJSTS = targetPolygonNoHolesJSTS.difference(newHoleJSTS);
    var newHoleFeatureJSTS = newHoleJSTS.intersection(targetPolygonNoHolesJSTS);

    var olNewTargetFeatureJSTSgj = getGeoJSONGeometry(olNewTargetFeatureJSTS);
    var newHoleFeatureJSTSgj = getGeoJSONGeometry(newHoleFeatureJSTS);

    if (olNewTargetFeatureJSTSgj !== null && newHoleFeatureJSTSgj !== null) {
      targetPolygonNoHoles.geometry = olNewTargetFeatureJSTSgj;
      newHole.geometry = newHoleFeatureJSTSgj;
      newPolygons.push(targetPolygonNoHoles);
      newPolygons.push(newHole);
    } else {
      return -1;
    }

  } catch (e) {
    return -2;
  }

  for (let i = 0; i < newPolygons.length; i++) {
    var newFeature = new M.Feature(Math.random(), {
      "type": "Feature",
      "id": Math.random(),
      "geometry": newPolygons[i],
      "geometry_name": "geometry",
      "properties": {}
    });
    resultFeatures.push(newFeature);
    cont += cont;
  }

  return resultFeatures;
};

/**
 * Zooms the view to the layer extent
 *
 * @public
 * @function
 * @api stable
 */
export const createDividedPolygons = (polygons, selectedFeature) => {
  let resultFeatures = [];
  let cont = 1;

  for (let i = polygons.iterator(); i.hasNext();) {
    const polygon = i.next();
    let polygonGeoJson = getGeoJSONGeometry(polygon);
    let newFeature = new M.Feature(Math.random(), selectedFeature.getGeoJSON());
    newFeature.setGeometry(polygonGeoJson);
    resultFeatures.push(newFeature);
    cont += cont;
  }

  return resultFeatures;
};
