import {
    CollisionHandler,
    CombinedAlignment,
    PositionData,
} from '../src/index';
import { Helpers } from '../src/helpers';

export type SizeData = {
    height: number;
    width: number;
};

export type allData = PositionData & {
    _bodyRect: DOMRect;
    _anchorRect: DOMRect;
    _targetRect: DOMRect;
};

export class Helper {
    collision: CollisionHandler;
    anchorSize: SizeData;
    targetSize: SizeData;
    appendTo: HTMLElement | undefined;

    constructor(
        collision: CollisionHandler,
        anchor: SizeData,
        target: SizeData,
        appendTo?: HTMLElement,
    ) {
        this.collision = collision;
        this.anchorSize = anchor;
        this.targetSize = target;
        this.appendTo = appendTo;
    }

    setupEnvironment(windowSize: SizeData) {
        window.innerWidth = windowSize.height;
        window.innerHeight = windowSize.width;

        document.body.getBoundingClientRect = jest.fn(() => ({
            x: 0,
            y: 0,
            width: windowSize.width,
            height: windowSize.height,
            top: 0,
            right: windowSize.width,
            bottom: windowSize.height,
            left: 0,
            toJSON: () => '{}',
        }));

        // Add our anchor
        let div = document.createElement('div');
        div.classList.add('anchor');
        div.style.height = `${this.anchorSize.height}px`;
        div.style.width = `${this.anchorSize.width}px`;
        document.body.insertAdjacentElement('beforeend', div);

        // Add our target
        div = document.createElement('div');
        div.classList.add('target');
        div.style.height = `${this.targetSize.height}px`;
        div.style.width = `${this.targetSize.width}px`;
        div.style.position = 'absolute';
        document.body.insertAdjacentElement('beforeend', div);
    }

    getLeft(
        tP: CombinedAlignment,
        my?: CombinedAlignment,
        at?: CombinedAlignment,
    ) {
        let left = 0;

        switch (Helpers.parse(tP).horizontal) {
            case 'center':
                // Center
                left += window.innerWidth / 2 - this.anchorSize.width / 2;
                break;
            case 'right':
                // Center
                left += window.innerWidth - this.anchorSize.width;
                break;
            default:
                break;
        }

        if (at) {
            switch (Helpers.parse(at).horizontal) {
                case 'center':
                    // Center
                    left += this.anchorSize.width / 2;
                    break;
                case 'right':
                    // Center
                    left += this.anchorSize.width;
                    break;
                default:
                    break;
            }
        }

        if (my) {
            switch (Helpers.parse(my).horizontal) {
                case 'center':
                    // Center
                    left -= this.targetSize.width / 2;
                    break;
                case 'right':
                    // Center
                    left -= this.targetSize.width;
                    break;
                default:
                    break;
            }
        }

        if (this.collision === CollisionHandler.ignore) {
            return left;
        }

        // Work on collision
        return left;
    }

    getTop(
        tP: CombinedAlignment,
        my?: CombinedAlignment,
        at?: CombinedAlignment,
    ) {
        let top = 0;

        switch (Helpers.parse(tP).vertical) {
            case 'center':
                // Center
                top += window.innerHeight / 2 - this.anchorSize.height / 2;
                break;

            case 'bottom':
                // Center
                top += window.innerHeight - this.anchorSize.height;
                break;

            default:
                break;
        }

        if (at) {
            switch (Helpers.parse(at).vertical) {
                case 'center':
                    // Center
                    top += this.anchorSize.height / 2;
                    break;

                case 'bottom':
                    // Center
                    top += this.anchorSize.height;
                    break;

                default:
                    break;
            }
        }

        if (my) {
            switch (Helpers.parse(my).vertical) {
                case 'center':
                    // Center
                    top -= this.targetSize.height / 2;
                    break;

                case 'bottom':
                    // Center
                    top -= this.targetSize.height;
                    break;

                default:
                    break;
            }
        }

        if (this.collision === CollisionHandler.ignore) {
            return top;
        }

        // Work on collision
        return top;
    }

    /**
     * Set fake client bound data
     * @note Jest doesn't render anything so this must be called
     * @param tP The `CombinedAlignment` we're setting up for
     */
    setupTest(tP: CombinedAlignment) {
        const anchorEl = document.querySelector<HTMLElement>('.anchor'),
            targetEl = document.querySelector<HTMLElement>('.target');

        anchorEl!.getBoundingClientRect = jest.fn(() => {
            const top = this.getTop(tP),
                left = this.getLeft(tP);

            return {
                x: left,
                y: top,
                width: this.anchorSize.width,
                height: this.anchorSize.height,
                top: top,
                right: left + this.anchorSize.width,
                bottom: top + this.anchorSize.height,
                left: left,
                toJSON: () => '{}',
            };
        });

        targetEl!.getBoundingClientRect = jest.fn(() => {
            const top = 0,
                left = 0;

            return {
                x: left,
                y: top,
                width: this.targetSize.width,
                height: this.targetSize.height,
                top: top,
                right: left + this.targetSize.width,
                bottom: top + this.targetSize.height,
                left: left,
                toJSON: () => '{}',
            };
        });
    }
}
