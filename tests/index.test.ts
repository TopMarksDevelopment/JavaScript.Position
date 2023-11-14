import { CollisionHandler, CombinedAlignment, position } from '../src/index';
// @ts-ignore
import { allData, Helper, SizeData } from './Helpers';

const windowSize: SizeData = {
        height: 1000,
        width: 1000,
    },
    anchorSize: SizeData = {
        height: 100,
        width: 100,
    },
    targetSize: SizeData = {
        height: 100,
        width: 100,
    },
    positionArray: CombinedAlignment[] = [
        'top left',
        'top center',
        'top right',
        'center left',
        'center center',
        'center right',
        'bottom left',
        'bottom center',
        'bottom right',
    ],
    helper = new Helper(CollisionHandler.ignore, anchorSize, targetSize);

helper.setupEnvironment(windowSize);

describe('HoverPosition (collisions ignored)', () => {
    // Add base style

    describe.each(positionArray)('Target Position: %s', (tP) => {
        describe.each(positionArray)('options.my: %s', (myAlignment) => {
            test.each(positionArray)('options.at: %s', (atAlignment) => {
                helper.setupTest(tP);

                const pData = position({
                    ...{ debug: true },
                    ...{
                        my: myAlignment,
                        at: atAlignment,
                        target: document.querySelector<HTMLDivElement>(
                            '.target',
                        )!,
                        anchor: document.querySelector<HTMLElement>('.anchor')!,
                        collision: CollisionHandler.ignore,
                    },
                }) as allData;
                /*
                console.log(
                    `${tP}|${myAlignment}|${atAlignment}`,
                    pData,
                );
                */
                expect({
                    left: parseInt(pData.left, 10),
                    top: parseInt(pData.top, 10),
                }).toStrictEqual({
                    left: helper.getLeft(tP, myAlignment, atAlignment),
                    top: helper.getTop(tP, myAlignment, atAlignment),
                });
            });
        });
    });
});

test('Window scroll adjusts output', () => {
    window.scrollX = 50;
    window.scrollY = 50;
    
    const tP = 'top left',
        myA = 'top center',
        atA = 'bottom center';
    
    helper.setupTest(tP);

    const pData = position({
        ...{ debug: true },
        ...{
            my: myA,
            at: atA,
            target: document.querySelector<HTMLDivElement>(
                '.target',
            )!,
            anchor: document.querySelector<HTMLElement>('.anchor')!,
            collision: CollisionHandler.ignore,
        },
    }) as allData;
    
    expect({
        left: parseInt(pData.left, 10),
        top: parseInt(pData.top, 10),
    }).toStrictEqual({
        left: helper.getLeft(tP, myA, atA) + 50,
        top: helper.getTop(tP, myA, atA) + 50,
    });
    
    window.scrollX = 50;
    window.scrollY = 50;
});
