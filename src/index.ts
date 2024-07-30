import { CollisionHandler } from './Enumerators/CollisionHandler';
import { Helpers } from './helpers';
import { IOptions } from './Interfaces/IOptions';
import {
    Alignment,
    CombinedAlignment,
    HorizontalAlignment,
    VerticalAlignment,
} from './Types/AlignmentTypes';
import { CalculationOutcome } from './Types/CalculationOutcome';
import { FitPosition } from './Types/FitPosition';
import { FitData } from './Types/FitData';
import { PositionData } from './Types/PositionData';

/**
 * Get the position placement for one element relative to another
 * @param options The options to help attain the `top` & `left`
 * @returns object with a top and left value in the form `{number}px`
 */
function position(options: IOptions): PositionData {
    const { _bodyRect, _anchorRect, _targetRect } = initialisePrivateFields(),
        myPos = Helpers.parse(
            options.my,
            options.defaults
                ? Helpers.parse(options.defaults.my)
                : { vertical: 'top', horizontal: 'center' },
            true,
        ),
        atPos = Helpers.parse(
            options.at,
            options.defaults
                ? Helpers.parse(options.defaults.at)
                : { vertical: 'bottom', horizontal: 'center' },
            true,
        );

    if (
        options.collision === CollisionHandler.ignore ||
        (options.collision === CollisionHandler.flipfit &&
            myPos === 'center center' &&
            atPos === 'center center')
    ) {
        return {
            left: calculateLeft(myPos, atPos).value.toString() + 'px',
            top: calculateTop(myPos, atPos).value.toString() + 'px',
            // @ts-ignore
            ...(options.debug === true
                ? { _bodyRect, _anchorRect, _targetRect }
                : {}),
        };
    }

    const pos = calculatePosition(myPos, atPos, options);

    return {
        top: pos.top.toString() + 'px',
        left: pos.left.toString() + 'px',
        // @ts-ignore
        ...(options.debug === true
            ? { _bodyRect, _anchorRect, _targetRect }
            : {}),
    };

    function initialisePrivateFields() {
        const _bodyRect = document.body.getBoundingClientRect(),
            _anchorRect: DOMRect =
                options.anchor instanceof MouseEvent
                    ? {
                          bottom: NaN,
                          height: 10,
                          left: options.anchor.pageX,
                          right: NaN,
                          top: options.anchor.pageY,
                          width: 10,
                          x: options.anchor.pageY,
                          y: options.anchor.pageX,
                          toJSON: () => {
                              return '{}';
                          },
                      }
                    : options.anchor.getBoundingClientRect(),
            originalDisplay = options.target.style.display,
            _targetRect = options.target.getBoundingClientRect();

        options.target.style.display = 'block';
        options.target.style.display = originalDisplay;

        // Adjust to scrollable regions
        if (options.anchor instanceof HTMLElement) {
            // Finally, adjust for window scroll position
            const doc = document.documentElement;
            _anchorRect.y +=
                (window.scrollY ||
                    document.documentElement.scrollTop ||
                    document.body.scrollTop ||
                    0) - (doc.clientTop || 0);
            _anchorRect.x +=
                (window.scrollX ||
                    document.documentElement.scrollLeft ||
                    document.body.scrollLeft ||
                    0) - (doc.clientLeft || 0);
        }

        return {
            _bodyRect,
            _anchorRect,
            _targetRect,
        };
    }

    function calculatePosition(
        my: CombinedAlignment,
        at: CombinedAlignment,
        options: IOptions,
    ): FitPosition {
        const fitDataArray = getFitPositions(),
            fitData = fitDataArray.filter((f) => f.my === my && f.at === at)[0];

        if (
            options.collision === CollisionHandler.ignore ||
            (!fitData.top.willCollide && !fitData.left.willCollide)
        ) {
            return { top: fitData.top.value, left: fitData.left.value };
        }

        if (options.collision === CollisionHandler.flipfit) {
            return calculatePosition(Helpers.flip(my), Helpers.flip(at), {
                collision: CollisionHandler.ignore,
                ...options,
            });
        }

        let myFits = fitDataArray.filter(
            (f) =>
                (!f.top.willCollide || f.top.mayOverflow) &&
                !f.left.willCollide,
        );

        if (myFits.length === 0) {
            return { top: fitData.top.value, left: fitData.left.value };
        } else if (myFits.length === 1) {
            return { top: myFits[0].top.value, left: myFits[0].left.value };
        }

        myFits = Helpers.findBestFits(my, at, options, myFits);

        if (myFits.length === 0) {
            return { top: fitData.top.value, left: fitData.left.value };
        } else if (myFits.length === 1) {
            return { top: myFits[0].top.value, left: myFits[0].left.value };
        }

        let tempFits = myFits.filter((f) => f.my === my);

        if (tempFits.length > 0) {
            myFits = tempFits;
        }

        tempFits = myFits.filter((f) => f.at === at);

        if (tempFits.length > 0) {
            myFits = tempFits;
        }

        return { top: myFits[0].top.value, left: myFits[0].left.value };
    }

    function calculateTop(
        my: CombinedAlignment | VerticalAlignment,
        at: CombinedAlignment | VerticalAlignment,
    ): CalculationOutcome {
        let top = 0;
        let myV: VerticalAlignment, atV: VerticalAlignment;

        if (my === 'top' || my === 'bottom' || my === 'center') {
            myV = my;
        } else {
            myV = my.split(' ')[0] as VerticalAlignment;
        }

        if (at === 'top' || at === 'bottom' || at === 'center') {
            atV = at;
        } else {
            atV = at.split(' ')[0] as VerticalAlignment;
        }

        // First get the adjustment
        if (myV === 'top') {
            top = 0;
        } else if (myV === 'bottom') {
            top = _targetRect.height * -1;
        } else {
            top = (_targetRect.height / 2) * -1;
        }

        // Then add the position
        if (atV === 'top') {
            top += _anchorRect.y;
        } else if (atV === 'bottom') {
            top += _anchorRect.y + _anchorRect.height;
        } else {
            top += _anchorRect.y + _anchorRect.height / 2;
        }

        const willCollide =
            top < 0 || top + _targetRect.height > _bodyRect.height;

        return {
            value: top,
            willCollide: willCollide,
            mayOverflow: myV === 'top',
        };
    }

    function calculateLeft(
        my: CombinedAlignment | HorizontalAlignment,
        at: CombinedAlignment | HorizontalAlignment,
    ): CalculationOutcome {
        let left = 0;
        let myH: HorizontalAlignment, atH: HorizontalAlignment;

        if (my === 'left' || my === 'right' || my === 'center') {
            myH = my;
        } else {
            myH = my.split(' ')[1] as HorizontalAlignment;
        }

        if (at === 'left' || at === 'right' || at === 'center') {
            atH = at;
        } else {
            atH = at.split(' ')[1] as HorizontalAlignment;
        }

        // First get the adjustment
        if (myH === 'left') {
            left = 0;
        } else if (myH === 'right') {
            left = _targetRect.width * -1;
        } else {
            left = (_targetRect.width / 2) * -1;
        }

        // Then add the position
        if (atH === 'left') {
            left += _anchorRect.x;
        } else if (atH === 'right') {
            left += _anchorRect.x + _anchorRect.width;
        } else {
            left += _anchorRect.x + _anchorRect.width / 2;
        }

        const willCollide =
            left < 0 || left + _targetRect.width > _bodyRect.width;

        return { value: left, willCollide: willCollide };
    }

    function getFitPositions(): FitData[] {
        const data: FitData[] = [];

        (<VerticalAlignment[]>['top', 'bottom', 'center']).forEach((myV) => {
            (<HorizontalAlignment[]>['left', 'right', 'center']).forEach(
                (myH) => {
                    (<VerticalAlignment[]>['top', 'bottom', 'center']).forEach(
                        (atV) => {
                            (<HorizontalAlignment[]>[
                                'left',
                                'right',
                                'center',
                            ]).forEach((atH) => {
                                data.push({
                                    my: `${myV} ${myH}` as CombinedAlignment,
                                    at: `${atV} ${atH}` as CombinedAlignment,
                                    top: calculateTop(myV, atV),
                                    left: calculateLeft(myH, atH),
                                });
                            });
                        },
                    );
                },
            );
        });

        return data;
    }
}

export {
    position,
    CollisionHandler,
    IOptions,
    Alignment,
    CombinedAlignment,
    HorizontalAlignment,
    VerticalAlignment,
    PositionData,
};
