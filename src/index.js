import { RoughCanvas } from './canvas.js';
import 'babel-polyfill/dist/polyfill';

export default {
  canvas(canvas, config) {
    return new RoughCanvas(canvas, config);
  },
  createRenderer() {
    return RoughCanvas.createRenderer();
  }
};
