import Edition from 'facade/edition';

const map = M.map({
  container: 'mapjs',
  controls: ["scale", "scaleline", "layerswitcher", "mouse", "overviewmap", "location", "rotate"]
});

let lyProvincias = new M.layer.WFS({
  name: "Provincias",
  url: "http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/wfs",
  namespace: "tematicos"
});
map.addLayers(lyProvincias);

var campamentos = new M.layer.WFS({
  url: "http://geostematicos-sigc.juntadeandalucia.es/geoserver/sepim/ows",
  name: "sepim:campamentos",
  legend: "Campamentos",
  geometry: 'POINT',
  extract: true
});

map.addLayers(campamentos);



map.addLayers(new M.layer.GeoJSON({
  name: "Municipios",
  extract: false,
  url: "http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=tematicos:Municipios&maxFeatures=100&outputFormat=application/json"
}));

const mp = new Edition({});

map.addPlugin(mp);

window.map = map;
