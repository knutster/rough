import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/rough.js',
    format: 'iife',
    name: 'rough',
    sourcemap: false
  },
  plugins: [
    babel({
      babelrc: true,
      comments: true,
      runtimeHelpers: true
    }),
    resolve({
      jsnext: true,
      main: true,
      browser: true,
    }),
    commonjs()
  ]
}
