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
  plugins: [ // (count: 3)
    commonjs({
      include: 'node_modules/**',
      extensions: [
        '.js'
      ]
    }),
    resolve({
      jsnext: true,
      main: true,
      // builtins: false,
      browser: true,
      extensions: [
        '.js',
        '.json'
      ]
    }),
    babel({
      babelrc: false,
      plugins: ['transform-regenerator', 'external-helpers'],
      exclude: 'node_modules/**',
      //externalHelpers: true,
      presets: [
        [ 'env', { modules: false }]
      ]
    }),
  ],
}
