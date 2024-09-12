import { CollisionHandler, CombinedAlignment, position } from '../src/index';
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
    helper = new Helper(CollisionHandler.ignore, anchorSize, targetSize),
    collisionHandler: (input: number) => number = (input) => input + 50;

helper.setupEnvironment(windowSize);

describe('HoverPosition (collisions ignored)', () => {
    describe.each(positionArray)('Target Position: %s', (tP) => {
        describe.each(positionArray)('options.my: %s', (myPlacement) => {
            test.each(positionArray)('options.at: %s', (atPlacement) => {
                helper.setupTest(tP);

                const pData = position({
                    ...{ debug: true },
                    ...{
                        my: myPlacement,
                        at: atPlacement,
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
                    left: helper.getLeft(tP, myPlacement, atPlacement),
                    top: helper.getTop(tP, myPlacement, atPlacement),
                });
            });
        });
    });
});

test('Window scroll adjusts output', () => {
    // Set the window scroll position
    window.scrollX = 50;
    window.scrollY = 50;

    const targetWindowPosition = 'top left',
        myPlacement = 'top center',
        atPlacement = 'bottom center';

    helper.setupTest(targetWindowPosition);

    const pData = position({
        ...{ debug: true },
        ...{
            my: myPlacement,
            at: atPlacement,
            target: document.querySelector<HTMLDivElement>('.target')!,
            anchor: document.querySelector<HTMLElement>('.anchor')!,
            collision: CollisionHandler.ignore,
        },
    }) as allData;

    expect({
        left: parseInt(pData.left, 10),
        top: parseInt(pData.top, 10),
    }).toStrictEqual({
        left: helper.getLeft(
            targetWindowPosition,
            myPlacement,
            atPlacement,
            collisionHandler,
        ),
        top: helper.getTop(
            targetWindowPosition,
            myPlacement,
            atPlacement,
            collisionHandler,
        ),
    });

    // Reset the window scroll position
    window.scrollX = 0;
    window.scrollY = 0;
});
