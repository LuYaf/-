import Map from 'ol/Map.js';
import OSM, { ATTRIBUTION } from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import View from 'ol/View.js';
import LayerGroup from 'ol/layer/Group.js';
import Stamen from 'ol/source/Stamen.js';

//加载初始标准地图
const map = new Map({
  target: 'map',
  view: new View({
    center: [12153494.776357276, 4076801.3198558404],//这个位置是西安
    zoom: 3.5,
  }),
});

//可在控制台看到所点击处的经纬度
map.on('click',function(e){
  console.log(e.coordinate)
});

//两个放大缩小按钮的逻辑
document.getElementById('zoom-out').onclick = function () {
  const view = map.getView();
  const zoom = view.getZoom();
  view.setZoom(zoom - 1);
};

document.getElementById('zoom-in').onclick = function () {
  const view = map.getView();
  const zoom = view.getZoom();
  view.setZoom(zoom + 1);
};

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
const baseLayerGroup = new LayerGroup({
  layers:[
    openStreetMapstandard, stamenTerrain
  ]
})
map.addLayer(baseLayerGroup);

//放大缩小按钮功能
document.getElementById('zoom-out').onclick = function () {
  const view = map.getView();
  const zoom = view.getZoom();
  view.setZoom(zoom - 1);
};

document.getElementById('zoom-in').onclick = function () {
  const view = map.getView();
  const zoom = view.getZoom();
  view.setZoom(zoom + 1);
};

//地图切换功能
const baseLayerElements = document.querySelectorAll('.sidebar >input[type=radio]')
//console.log(baseLayerElements);
for(let baseLayerElement of baseLayerElements){
  //console.log(baseLayerElements)
  baseLayerElement.addEventListener('change', function(){
    //console.log(this.value)
    let baseLayerElementValue = this.value;
    baseLayerGroup.getLayers().forEach(function(element, index, array){
      let baseLayerTitle = element.get('title');
      element.setVisible(baseLayerTitle === baseLayerElementValue);
    })
  })



}