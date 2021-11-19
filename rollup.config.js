import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  input: 'src/index.ts',
  plugins: [typescript(), terser()],
  output: {
    file: 'dist/bundle.min.cjs',
    format: 'cjs',
  },
};

export default config;
