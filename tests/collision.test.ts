import { CollisionHandler, position } from '../src/index';
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
        width: 200,
    },
    helper = new Helper(CollisionHandler.bestFit, anchorSize, targetSize),
    leftCollision: (input: number) => number = () => 800;

helper.setupEnvironment(windowSize);

test('Collision changes the output', () => {
    const tP = 'center right',
        myA = 'top center',
        atA = 'bottom center';

    helper.setupTest(tP);

    const pData = position({
        ...{ debug: true },
        ...{
            my: myA,
            at: atA,
            target: document.querySelector<HTMLDivElement>('.target')!,
            anchor: document.querySelector<HTMLElement>('.anchor')!,
        },
    }) as allData;

    expect({
        left: parseInt(pData.left, 10),
        top: parseInt(pData.top, 10),
    }).toStrictEqual({
        left: helper.getLeft(tP, myA, atA, leftCollision),
        top: helper.getTop(tP, myA, atA),
    });
});
