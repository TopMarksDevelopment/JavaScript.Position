import rollupTypescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
export default [
    {
        input: ['src/index.ts', 'src/helpers.ts'],
        output: [
            {
                dir: 'lib/',
                entryFileNames: '[name].cjs',
                format: 'cjs',
                sourcemap: true,
                compact: false,
            },
            {
                dir: 'lib/',
                entryFileNames: '[name].m.js',
                format: 'es',
                sourcemap: true,
                compact: false,
            },
        ],
        plugins: [rollupTypescript(), terser()],
    },
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
        ],
        plugins: [rollupTypescript(), terser()],
    },
];
