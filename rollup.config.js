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
            }
        ],
        plugins: [rollupTypescript(), terser()],
    },
    {
        input: {
            ['index']: 'src/index.ts',
            ['helpers']: 'src/helpers.ts',
            ['Enumerators/CollisionHandler']: 'src/Enumerators/CollisionHandler.ts'
        },
        output: [
            {
                entryFileNames: '[name].m.js',
                dir: 'lib',
                format: 'es',
                sourcemap: true,
                compact: false,
            },
            {
                entryFileNames: '[name].cjs',
                dir: 'lib',
                format: 'cjs',
                sourcemap: true,
                compact: false,
            },
        ],
        plugins: [rollupTypescript(), terser()],
    },
];
