import Map from 'ol/Map.js';
import Overlay from 'ol/Overlay.js';
import OSM, { ATTRIBUTION } from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import View from 'ol/View.js';
import LayerGroup from 'ol/layer/Group.js';
import Stamen from 'ol/source/Stamen.js';
import { toLonLat } from 'ol/proj.js';
import { fromLonLat  } from 'ol/proj';
import XYZ from 'ol/source/XYZ.js';
import { format, toStringHDMS } from 'ol/coordinate.js';
import VectorImageLayer from 'ol/layer/VectorImage';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON.js';
import { Circle, Fill, Stroke, Style } from 'ol/style.js';
import { fromCircle } from 'ol/geom/Polygon';
import { bbox } from 'ol/loadingstrategy';
import { Vector } from 'ol/layer';
import { Vector as VectorLayer } from 'ol/layer';



// const container = document.getElementById('popup');
// const content = document.getElementById('popup-content');
// const closer = document.getElementById('popup-closer');


// const overlay = new Overlay({
//   element: container,
//   autoPan: {
//     animation: {
//       duration: 250,
//     },
//   },
// });

// closer.onclick = function () {
//   overlay.setPosition(undefined);
//   closer.blur();
//   return false;
// };



//加载初始标准地图
const map = new Map({
  target: 'map',
  view: new View({
    center : fromLonLat([80, 25]),//地图中心
    zoom: 3.5,
  }),
});


//地图类型
const openStreetMapstandard = new TileLayer({
  source: new OSM(),
  visible: true,
  title: 'OSMStandard'
})

const stamenTerrain = new TileLayer({
  source: new Stamen({
    layer: 'terrain'
  }),
  visible: false,
  title: 'StamenTerrain'
})

const ordinaryMap = new TileLayer({
  source: new XYZ({
    // 无地形
    url: "http://t2.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=5c5b12c8441e157121ce19c6d6417460"
  }),
  visible: false,
  title: 'OrdinaryMap'
})

const terrainMap = new TileLayer({
  source: new XYZ({
    // 有地形
    url: 'http://t0.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=5c5b12c8441e157121ce19c6d6417460',
  }),
  visible: false,
  title: 'TerrainMap'
})

const tileMark1 = new TileLayer({
  source: new XYZ({
    url: 'http://t3.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=5c5b12c8441e157121ce19c6d6417460'
  }),
  visible: false,
  title: 'OrdinaryMap'
})

const tileMark2 = new TileLayer({
  source: new XYZ({
    url: 'http://t3.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=5c5b12c8441e157121ce19c6d6417460'
  }),
  visible: false,
  title: 'TerrainMap'
})

const baseLayerGroup = new LayerGroup({
  layers:[
    openStreetMapstandard, stamenTerrain, ordinaryMap, terrainMap, tileMark1, tileMark2
  ]
})
map.addLayer(baseLayerGroup);

//地图切换功能
const baseLayerElements = document.querySelectorAll('.sidebar >input[type=radio]')
for(let baseLayerElement of baseLayerElements){
  baseLayerElement.addEventListener('change', function(){
    let baseLayerElementValue = this.value;
    baseLayerGroup.getLayers().forEach(function(element, index, array){
      let baseLayerTitle = element.get('title');
      element.setVisible(baseLayerTitle === baseLayerElementValue);
    })
  })
}
//新疆地区显示
const fill = new Fill({
  color: 'rgba(255,255,255,0.4)',
});
const stroke = new Stroke({
  color: '#3399CC',
  width: 1.25,
});
const styles = [
  new Style({
    image: new Circle({
      fill: fill,
      stroke: stroke,
      radius: 5,
    }),
    fill: fill,
    stroke: stroke,
  }),
];

//新疆大区域显示功能
const xinjiangallGeoJSON = new VectorImageLayer({
  source: new VectorSource({
    url: './data/grassland/xinjiangall.geojson',
    format: new GeoJSON()
  }),
  visible: false,
  title: 'xinjiangallGeoJSON',
  style: styles
  })
map.addLayer(xinjiangallGeoJSON);



//新疆小区域显示功能
const xinjiangGeoJSON = new VectorImageLayer({
  source: new VectorSource({
    url: './data/grassland/map.geojson',
    format: new GeoJSON()
  }),
  visible: false,
  title: 'xinjiangGeoJSON',
  style: styles
  })
map.addLayer(xinjiangGeoJSON);


//点击菜单显示新疆小区域
const grasslandMenu = document.getElementById('grassland');
const grasslandSubMenu = document.querySelectorAll('#grassland + ul > li')[2]; // 选择多种资源子菜单项
grasslandSubMenu.addEventListener('click', function() {
  xinjiangGeoJSON.setVisible(true);
  xinjiangallGeoJSON.setVisible(true);
  grasslandRoadGeoJSON.setVisible(false);
  routeGeoJSON.setVisible(false)
});
const grasslandxjMenu = document.querySelectorAll('#grassland + ul > li')[1]; // 选择新疆区域子菜单项
grasslandxjMenu.addEventListener('click', function() {
  xinjiangGeoJSON.setVisible(false);
  xinjiangallGeoJSON.setVisible(true);
  grasslandRoadGeoJSON.setVisible(false);
  routeGeoJSON.setVisible(false)
});

//草原丝绸之路路线
const grasslandRoadGeoJSON = new VectorImageLayer({
  source: new VectorSource({
    url: './data/grassland/grasslandRoad.geojson',
    format: new GeoJSON()
  }),
  visible: false,
  title: 'grasslandRoadGeoJSON',
  style: styles
  })
map.addLayer(grasslandRoadGeoJSON);

//点击菜单触发草原丝绸之路
const grasslandRoad = document.getElementById('grasslandroad');
grasslandRoad.addEventListener('click', function() {
  // 这里设置显示silkRoadGeoJSON图层，隐藏其他图层
  grasslandRoadGeoJSON.setVisible(true);
  xinjiangGeoJSON.setVisible(false);
  routeGeoJSON.setVisible(false);
  xinjiangallGeoJSON.setVisible(false);
  // 以此类推，如果有更多的图层，都可以在这里设置隐藏
});




//新疆地区点击显示json信息
const overlayContainerinerElement = document.querySelector('.overlay-container');
const overlayLayer = new Overlay({
  element: overlayContainerinerElement  
})
map.addOverlay(overlayLayer);

const overlayFratureName = document.getElementById('feature-name');//name
const overlayFratureInfo = document.getElementById('feature-info')//info
const overlayFeatureImages = document.getElementById('feature-images');//img

map.on('click', function(e) {
  overlayLayer.setPosition(undefined);
  let clickedCoordinate = e.coordinate;
  let clickedFeature = null;
  map.forEachFeatureAtPixel(e.pixel, function(feature, layer) {
    clickedFeature = feature;
  }, {
    layerFilter: function(layerCandidate) {
      return layerCandidate.get('title') === 'xinjiangGeoJSON';
    }
  });


  if (clickedFeature) {
    //let clickedFeatureID = clickedFeature.get('id');
    let clickedFeatureName = clickedFeature.get('name');
    let clickedFeatureInfo = clickedFeature.get('info');
    let clickedFeatureImages = clickedFeature.get('images');
    // 显示具体信息
    overlayLayer.setPosition(clickedCoordinate);
    overlayFratureName.innerHTML = clickedFeatureName;
    overlayFratureInfo.innerHTML = clickedFeatureInfo;
    overlayFeatureImages.innerHTML = '';

    clickedFeatureImages.forEach(function(imagePath) {
      const imgElement = document.createElement('img');
      imgElement.src = imagePath;
      imgElement.className = 'feature-image';
      overlayFeatureImages.appendChild(imgElement);

      imgElement.addEventListener('click', function() {// 点击图片时触发放大操作
        imgElement.classList.toggle('enlarge');
      });
    });
  }
});




// 丝绸之路路线图
const routestyles = function(feature) {
  let geometry = feature.getGeometry();
  let styles = [];
  if (geometry.getType() == 'Point' & feature.get('marker-color') == '#ff0000') {
    styles.push(new Style({
      image: new Circle({
        radius: 3,
        fill: new Fill({
          color: "#F45B69"
        }),
        stroke: new Stroke({
          color: feature.get('stroke'),
          width: 1
        })
      })
    }));
  } 
  else if (geometry.getType() == 'Point' & feature.get('marker-color') != '#ff0000') {
    styles.push(new Style({
      image: new Circle({
        radius: 3,
        fill: new Fill({
          color: "#03A9F4"
        }),
        stroke: new Stroke({
          color: feature.get('stroke'),
          width: 1
        })
      })
    }));
  } 
  else if (geometry.getType() == 'LineString') {
    styles.push(new Style({
      stroke: new Stroke({
        color: "#028090",
        width: 2,
        opacity: 1
      })
    }));
  }
  return styles;
};


const routeSource = new VectorImageLayer({
  source: new VectorSource({
    // projection: 'EPSG:4326',
    url: './data/route_all_in.geojson',
    format: new GeoJSON(),
  }),
  visible: false,
  title: 'routeGeoJSON',
  style: routestyles,
});
map.addLayer(routeSource);

//点击显示坐标功能
// map.on('singleclick', function (evt) {
//   const coordinate = evt.coordinate;
//   const hdms = toStringHDMS(toLonLat(coordinate));
//   content.innerHTML = '<p>你点击的坐标是:</p><code>' + hdms + '</code>';
//   overlay.setPosition(coordinate);
// });