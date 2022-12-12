import { CombinedAlignment } from './AlignmentTypes';
import { CalculationOutcome } from './CalculationOutcome';

export type FitData = {
    my: CombinedAlignment;
    at: CombinedAlignment;
    top: CalculationOutcome;
    left: CalculationOutcome;
};
