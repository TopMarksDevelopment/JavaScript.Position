import rollupTypescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
export default [
    {
        input: 'src/index.ts',
        output: [
            {
                file: 'lib/index.js',
                format: 'umd',
                sourcemap: true,
                compact: false,
                name: 'TopMarksDevelopment',
            },
            {
                file: 'lib/index.cjs',
                format: 'cjs',
                sourcemap: true,
                compact: false,
            },
            {
                file: 'lib/index.m.js',
                format: 'es',
                sourcemap: true,
                compact: false,
            },
        ],
        plugins: [rollupTypescript(), terser()],
    },
    {
        input: 'src/helpers.ts',
        output: [
            {
                file: 'lib/helpers.js',
                format: 'umd',
                sourcemap: true,
                compact: false,
                name: 'TopMarksDevelopment',
            },
            {
                file: 'lib/helpers.cjs',
                format: 'cjs',
                sourcemap: true,
                compact: false,
            },
            {
                file: 'lib/helpers.m.js',
                format: 'es',
                sourcemap: true,
                compact: false,
            },
        ],
        plugins: [rollupTypescript(), terser()],
    },
];
