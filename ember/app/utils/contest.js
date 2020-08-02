import { decodeDeltas } from 'ol/format/Polyline';
import LineString from 'ol/geom/LineString';
import { fromLonLat } from 'ol/proj';

/**
 * Dictionary of contest names and their colors.
 */
const CONTEST_COLORS = {
  'olc_plus classic': '#ff2c73',
  'olc_plus triangle': '#9f14ff',
};

/**
 * A contest of a flight.
 * @constructor
 * @param {Array<Object>} _contest Scored/Optimised contests.
 *   Such an object must contain: name, turnpoints, times
 *   turnpoints and times are googlePolyEncoded strings.
 * @param {Number} _sfid The SkyLines flight id this contest trace belongs to.
 */
export default class Contest {
  constructor(_contest) {
    this.name = _contest.name;
    this.times = decodeDeltas(_contest.times, 1, 1);
    let turnpoints = decodeDeltas(_contest.turnpoints, 2);

    this.geometry = new LineString([]);
    let turnpointsLength = turnpoints.length;
    let triangle = this.name.search(/triangle/) !== -1 && turnpointsLength === 5 * 2;

    if (triangle) {
      for (let i = 2; i < turnpointsLength - 2; i += 2) {
        let point = fromLonLat([turnpoints[i + 1], turnpoints[i]]);
        this.geometry.appendCoordinate(point);
      }

      this.geometry.appendCoordinate(this.geometry.getFirstCoordinate());
    } else {
      for (let i = 0; i < turnpointsLength; i += 2) {
        let point = fromLonLat([turnpoints[i + 1], turnpoints[i]]);
        this.geometry.appendCoordinate(point);
      }
    }

    this.color = CONTEST_COLORS[this.name] || '#ff2c73';
  }
}
