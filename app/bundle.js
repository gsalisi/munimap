/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _SFMap = __webpack_require__(1);
	
	var _SFMap2 = _interopRequireDefault(_SFMap);
	
	var _DataService = __webpack_require__(2);
	
	var _DataService2 = _interopRequireDefault(_DataService);
	
	var _Toolbar = __webpack_require__(3);
	
	var _Toolbar2 = _interopRequireDefault(_Toolbar);
	
	var _MapSession = __webpack_require__(4);
	
	var _MapSession2 = _interopRequireDefault(_MapSession);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function setupEventListeners(mapSessions) {
	    var MAX_SELECTION = 3;
	    var sessionSVG = d3.select('.overlay-container').append('svg').attr('class', 'overlay');
	
	    window.onRouteSelectionChange = function (cb) {
	        if (cb.checked) {
	            if (Object.keys(mapSessions).length >= MAX_SELECTION) {
	                alert('Please uncheck checked routes to select new ones.');
	                cb.checked = false;
	                return;
	            }
	            var nms = new _MapSession2.default(cb.value, sessionSVG);
	            mapSessions[cb.value] = nms;
	        } else {
	            var _nms = mapSessions[cb.value];
	            _nms.destroy();
	            delete mapSessions[cb.value];
	        }
	    };
	}
	
	var $loader = document.querySelector('.loader');
	var mapSessions = {};
	
	// Setup Toolbar
	_DataService2.default.fetchRoutes().then(function (routesData) {
	    return new _Toolbar2.default(routesData);
	});
	// Setup Map
	_DataService2.default.fetchMapData().then(function (mapData) {
	    $loader.style.display = 'none';
	    new _SFMap2.default(mapData);
	}).then(function () {
	    // Listen for new Map Sessions
	    setupEventListeners(mapSessions);
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var SFMap = function () {
	    function SFMap(mapData) {
	        _classCallCheck(this, SFMap);
	
	        var projection = d3.geo.mercator().scale(331400).center([-122.431297, 37.773972]).translate([1200 / 2, 900 / 2]);
	        this.mapSVG = d3.select('.map');
	        this.sessionSVG = d3.select('.overlay');
	        this.geoPath = d3.geoPath(projection);
	        this._renderMap(mapData);
	    }
	
	    _createClass(SFMap, [{
	        key: '_renderMap',
	        value: function _renderMap(_ref) {
	            var _ref2 = _slicedToArray(_ref, 4),
	                arteries = _ref2[0],
	                neigh = _ref2[1],
	                streets = _ref2[2],
	                freeways = _ref2[3];
	
	            // No time to figure out how to place the street labels properly
	            this.mapSVG.selectAll('path.neighborhoods').data(neigh.features).enter().append('path').attr('class', 'neighborhoods').attr('d', this.geoPath);
	            this.mapSVG.selectAll('path.freeways').data(freeways.features).enter().append('path').attr('class', 'freeways').attr('d', this.geoPath);
	            this.mapSVG.selectAll('path.arteries').data(arteries.features).enter().append('path').attr('class', 'arteries').attr('d', this.geoPath);
	            var streetPaths = this.mapSVG.selectAll('path.streets').data(streets.features).enter().append('path').attr('class', 'streets').attr('d', this.geoPath);
	        }
	    }]);
	
	    return SFMap;
	}();
	
	exports.default = SFMap;

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var DataService = function () {
	    function DataService() {
	        _classCallCheck(this, DataService);
	    }
	
	    _createClass(DataService, null, [{
	        key: 'fetchRoutes',
	        value: function fetchRoutes() {
	            return fetch('routes').then(function (response) {
	                if (response.status !== 200) {
	                    console.log(response);
	                } else {
	                    return response.json();
	                }
	            }).then(function (route) {
	                return route.body && route.body.route;
	            });
	        }
	    }, {
	        key: 'fetchMapData',
	        value: function fetchMapData() {
	            var promises = [];
	            promises.push(fetch('arteries.json'));
	            promises.push(fetch('neighborhoods.json'));
	            promises.push(fetch('streets.json'));
	            promises.push(fetch('freeways.json'));
	
	            return Promise.all(promises).then(function (responses) {
	                return Promise.all(responses.map(function (r) {
	                    return r.json();
	                }));
	            });
	        }
	    }, {
	        key: 'fetchVehicleLocations',
	        value: function fetchVehicleLocations(vehicleTag) {
	            return fetch('locations?r=' + vehicleTag).then(function (response) {
	                if (response.status !== 200) {
	                    console.log(response);
	                } else {
	                    return response.json();
	                }
	            }).then(function (data) {
	                return DataService._normalizeVehicles(data);
	            });
	        }
	    }, {
	        key: '_normalizeVehicles',
	        value: function _normalizeVehicles(vehicleLocationsResp) {
	            if (!vehicleLocationsResp.body || !vehicleLocationsResp.body.vehicle) {
	                return;
	            } else if (!Array.isArray(vehicleLocationsResp.body.vehicle)) {
	                var v = vehicleLocationsResp.body.vehicle;
	                return [v];
	            }
	            return vehicleLocationsResp.body.vehicle;
	        }
	    }, {
	        key: 'fetchRouteConfig',
	        value: function fetchRouteConfig(vehicleTag) {
	            return fetch('routeConfig?r=' + vehicleTag).then(function (response) {
	                if (response.status !== 200) {
	                    console.log(response);
	                } else {
	                    return response.json();
	                }
	            }).then(function (route) {
	                return route.body && route.body.route;
	            });
	        }
	    }]);
	
	    return DataService;
	}();
	
	exports.default = DataService;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Toolbar = function () {
	    function Toolbar(routes) {
	        _classCallCheck(this, Toolbar);
	
	        this.$container = document.querySelector('.checkbox-container');
	        this._routes = routes;
	        this._renderRoutesList(routes);
	    }
	
	    _createClass(Toolbar, [{
	        key: '_renderRoutesList',
	        value: function _renderRoutesList(routes) {
	            var listHtml = [];
	            routes.forEach(function (r) {
	                listHtml.push('<label class="route-item">\n                    <input type="checkbox" value="' + r.tag + '" class="js-route-checkbox"\n                        onclick="onRouteSelectionChange(this)">\n                    ' + r.title + '\n                </label><br>');
	            });
	            this.$container.innerHTML = listHtml.join('\n');
	        }
	    }]);
	
	    return Toolbar;
	}();
	
	exports.default = Toolbar;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _DataService = __webpack_require__(2);
	
	var _DataService2 = _interopRequireDefault(_DataService);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var MapSession = function () {
	    function MapSession(vehicleTag, sessionSVG) {
	        var _this = this;
	
	        _classCallCheck(this, MapSession);
	
	        this.projection = d3.geo.mercator().scale(331400).center([-122.431297, 37.773972]).translate([1200 / 2, 900 / 2]);
	        this.vehicleTag = vehicleTag;
	        this.vehicleMap = new Map();
	        var width = 1200;
	        var height = 900;
	        this.sessionSVG = sessionSVG;
	        this.geoPath = d3.geoPath(this.projection);
	        this.routeColor = '#FFE3AE';
	
	        _DataService2.default.fetchRouteConfig(vehicleTag).then(function (routeData) {
	            _this.routeColor = routeData.color;
	            _this.routeColorOpposite = routeData.oppositeColor;
	            _this.renderRoute(routeData);
	            // this.updateVehicleLocations();
	            _this.intervalID = _this.autoRefresh();
	        });
	    }
	
	    _createClass(MapSession, [{
	        key: 'autoRefresh',
	        value: function autoRefresh() {
	            var _this2 = this;
	
	            return window.setInterval(function () {
	                _this2.updateVehicleLocations();
	            }, 2000);
	        }
	    }, {
	        key: 'updateVehicleLocations',
	        value: function updateVehicleLocations() {
	            var _this3 = this;
	
	            return _DataService2.default.fetchVehicleLocations(this.vehicleTag).then(function (vehicles) {
	                if (vehicles) {
	                    vehicles.forEach(function (v) {
	                        return _this3.vehicleMap.set(v.id, v);
	                    });
	                    var newValues = [];
	                    var _iteratorNormalCompletion = true;
	                    var _didIteratorError = false;
	                    var _iteratorError = undefined;
	
	                    try {
	                        for (var _iterator = _this3.vehicleMap.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                            var v = _step.value;
	
	                            newValues.push(v);
	                        }
	                    } catch (err) {
	                        _didIteratorError = true;
	                        _iteratorError = err;
	                    } finally {
	                        try {
	                            if (!_iteratorNormalCompletion && _iterator.return) {
	                                _iterator.return();
	                            }
	                        } finally {
	                            if (_didIteratorError) {
	                                throw _iteratorError;
	                            }
	                        }
	                    }
	
	                    _this3.renderVehicles(newValues);
	                }
	            });
	        }
	    }, {
	        key: 'renderVehicles',
	        value: function renderVehicles(vehicles) {
	            var _this4 = this;
	
	            // Really want to animate this movement but no time :(
	            this.sessionSVG.selectAll('.vehicle-' + this.vehicleTag).remove();
	            this.sessionSVG.selectAll('.vehicle-direction-' + this.vehicleTag).remove();
	
	            this.sessionSVG.selectAll('circle.vehicle-' + this.vehicleTag).data(vehicles).enter().append('circle').attr('cx', function (d) {
	                return _this4.projection([d.lon, d.lat])[0];
	            }).attr('cy', function (d) {
	                return _this4.projection([d.lon, d.lat])[1];
	            }).attr('id', function (d) {
	                return d.id;
	            }).attr('r', '8px').attr('fill', '#' + this.routeColor).attr('stroke', '#' + this.routeColorOpposite).attr('opacity', '0.85').attr('stroke-width', '3px').attr('class', 'vehicle vehicle-' + this.vehicleTag);
	
	            this.sessionSVG.selectAll('polyline.vehicle-direction-' + this.vehicleTag).data(vehicles).enter().append('polyline').attr('class', 'vehicle-direction vehicle-direction-' + this.vehicleTag).attr('points', function (d) {
	                var xCenter = _this4.projection([d.lon, d.lat])[0];
	                var yCenter = _this4.projection([d.lon, d.lat])[1];
	                var x1 = xCenter - 4;
	                var y1 = yCenter + 4;
	                var x2 = x1 + 4;
	                var y2 = y1 - 8;
	                var x3 = xCenter + 4;
	                var y3 = yCenter + 4;
	                return x1 + ', ' + y1 + '\n                        ' + x2 + ', ' + y2 + '\n                        ' + x3 + ', ' + y3;
	            }).attr('stroke', '#' + this.routeColorOpposite).attr('fill', 'rgba(0, 0, 0, 0)').attr('stroke-width', '2px').attr('transform', function (d) {
	                var xCenter = _this4.projection([d.lon, d.lat])[0];
	                var yCenter = _this4.projection([d.lon, d.lat])[1];
	                return 'rotate(' + d.heading + ' ' + xCenter + ' ' + yCenter + ')';
	            });
	        }
	    }, {
	        key: 'renderRoute',
	        value: function renderRoute(route) {
	            var _this5 = this;
	
	            function toGeoJson(points) {
	                return points.map(function (obj) {
	                    return {
	                        type: 'Feature',
	                        geometry: {
	                            type: 'LineString',
	                            coordinates: obj.point.map(function (p) {
	                                return [p.lon, p.lat, 0];
	                            })
	                        }
	                    };
	                });
	            }
	            var routeData = toGeoJson(route.path);
	            this.sessionSVG.selectAll('path.routepath-' + this.vehicleTag).data(routeData).enter().append('path').attr('fill', 'rgba(0, 0, 0, 0)').attr('stroke-width', '6px').attr('stroke', '#' + route.color).attr('opacity', '0.7').attr('class', 'routepath-' + this.vehicleTag).attr('d', this.geoPath);
	
	            this.sessionSVG.selectAll('circle.routestops-' + this.vehicleTag).data(route.stop).enter().append('circle').attr('cx', function (d) {
	                return _this5.projection([d.lon, d.lat])[0];
	            }).attr('cy', function (d) {
	                return _this5.projection([d.lon, d.lat])[1];
	            }).attr('id', function (d) {
	                return d.id;
	            }).attr('r', '3px').attr('fill', '#' + this.routeColorOpposite).attr('opacity', '0.4').attr('class', 'routestops-' + this.vehicleTag).append("svg:title").text(function (d) {
	                return d.title;
	            });
	        }
	    }, {
	        key: 'destroy',
	        value: function destroy() {
	            window.clearInterval(this.intervalID);
	            this.sessionSVG.selectAll('.routepath-' + this.vehicleTag).remove();
	            this.sessionSVG.selectAll('.routestops-' + this.vehicleTag).remove();
	            this.sessionSVG.selectAll('.vehicle-' + this.vehicleTag).remove();
	            this.sessionSVG.selectAll('.vehicle-direction-' + this.vehicleTag).remove();
	        }
	    }]);
	
	    return MapSession;
	}();
	
	exports.default = MapSession;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map