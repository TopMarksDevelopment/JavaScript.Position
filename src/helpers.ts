import {
    Alignment,
    CombinedAlignment,
    HorizontalAlignment,
    VerticalAlignment,
} from './Types/AlignmentTypes';
import { IAlignments } from './Interfaces/IAlignments';
import { FitData } from './Types/FitData';
import { IOptions } from './Interfaces/IOptions';

export class Helpers {
    /**
     * Parse an alignment string to it's `vertical` and `horizontal` alignments
     * @param alignment The alignment data to parse
     */
    static parse(alignment: CombinedAlignment): IAlignments;
    static parse(alignment: Alignment, defaults: IAlignments): IAlignments;
    static parse(
        alignment: Alignment,
        defaults: IAlignments,
        asCombined: true,
    ): CombinedAlignment;
    static parse(
        alignment: Alignment,
        defaults?: IAlignments,
        asCombined?: boolean,
    ): IAlignments | CombinedAlignment {
        let vert = defaults?.vertical ?? 'center',
            horiz: HorizontalAlignment = defaults?.horizontal ?? 'center';

        if (alignment.indexOf(' ') < 0) {
            const vertOrHoriz = alignment as
                | VerticalAlignment
                | HorizontalAlignment;

            if (vertOrHoriz === 'center') {
                vert = vertOrHoriz;
                horiz = vertOrHoriz;
            } else if (vertOrHoriz === 'top' || vertOrHoriz === 'bottom') {
                vert = vertOrHoriz;
            } else {
                horiz = vertOrHoriz;
            }
        } else {
            vert = alignment.split(' ')[0] as VerticalAlignment;
            horiz = alignment.split(' ')[1] as HorizontalAlignment;
        }

        return asCombined === true
            ? (`${vert} ${horiz}` as CombinedAlignment)
            : { vertical: vert, horizontal: horiz };
    }

    static flipAlignment(old: VerticalAlignment): VerticalAlignment;
    static flipAlignment(old: HorizontalAlignment): HorizontalAlignment;
    static flipAlignment(
        old: VerticalAlignment | HorizontalAlignment,
    ): VerticalAlignment | HorizontalAlignment {
        switch (old) {
            case 'top':
                return 'bottom';

            case 'bottom':
                return 'top';

            case 'left':
                return 'right';

            case 'right':
                return 'left';

            default:
                return 'center';
        }
    }

    static flip(old: CombinedAlignment): CombinedAlignment {
        const parsedOld = Helpers.parse(old);

        return `${Helpers.flipAlignment(
            parsedOld.vertical,
        )} ${Helpers.flipAlignment(parsedOld.horizontal)}` as CombinedAlignment;
    }

    static findBestFits(
        my: CombinedAlignment,
        at: CombinedAlignment,
        options: IOptions,
        inFitData: FitData[],
    ): FitData[] {
        const parsedMy = Helpers.parse(my),
            parsedAt = Helpers.parse(at);

        let bestFits: FitData[];

        const bestAltHorizFits = inFitData.filter(
            (f) =>
                f.my.startsWith(parsedMy.vertical + ' ') &&
                f.at.startsWith(parsedAt.vertical + ' '),
        );

        const bestAltVertFits = inFitData.filter(
            (f) =>
                f.my.endsWith(' ' + parsedMy.horizontal) &&
                f.at.endsWith(' ' + parsedAt.horizontal),
        );

        if (bestAltVertFits.length > 0 && bestAltHorizFits.length > 0) {
            bestFits =
                options.bestFitPreference === 'vertical'
                    ? bestAltVertFits
                    : bestAltHorizFits;
        } else if (bestAltVertFits.length > 0) {
            bestFits = bestAltVertFits;
        } else if (bestAltHorizFits.length > 0) {
            bestFits = bestAltHorizFits;
        } else {
            if (options.bestFitPreference === 'vertical') {
                // If it's center then we don't care about overlay. Infact, it's prefered!
                const bothCenter =
                        parsedMy.horizontal === 'center' &&
                        parsedAt.horizontal === 'center',
                    flippedMy = bothCenter
                        ? 'left' // <= Does pushing to the left fit?
                        : Helpers.flipAlignment(parsedMy.horizontal),
                    flippedAt = bothCenter
                        ? 'left' // <= Does pushing to the left fit?
                        : Helpers.flipAlignment(parsedMy.horizontal);

                bestFits = inFitData.filter(
                    (f) =>
                        f.my.endsWith(' ' + flippedMy) &&
                        f.at.endsWith(' ' + flippedAt),
                );

                if (bestFits.length === 0 && bothCenter) {
                    // What about to the right?
                    bestFits = inFitData.filter(
                        (f) =>
                            f.my.endsWith(
                                ' ' + Helpers.flipAlignment(flippedMy),
                            ) &&
                            f.at.endsWith(
                                ' ' + Helpers.flipAlignment(flippedAt),
                            ),
                    );
                }
            } else {
                // If it's center then we don't care about overlay. Infact, it's prefered!
                const bothCenter =
                        parsedMy.vertical === 'center' &&
                        parsedAt.vertical === 'center',
                    flippedMy = bothCenter
                        ? 'top' // <= Does pushing to the top fit?
                        : Helpers.flipAlignment(parsedMy.vertical),
                    flippedAt = bothCenter
                        ? 'top' // <= Does pushing to the top fit?
                        : Helpers.flipAlignment(parsedMy.vertical);

                bestFits = inFitData.filter(
                    (f) =>
                        f.my.startsWith(flippedMy + ' ') &&
                        f.at.startsWith(flippedAt + ' '),
                );

                if (bestFits.length === 0 && bothCenter) {
                    // What about to the bottom?
                    bestFits = inFitData.filter(
                        (f) =>
                            f.my.startsWith(
                                Helpers.flipAlignment(flippedMy) + ' ',
                            ) &&
                            f.at.startsWith(
                                Helpers.flipAlignment(flippedAt) + ' ',
                            ),
                    );
                }
            }
        }

        return bestFits;
    }
}
