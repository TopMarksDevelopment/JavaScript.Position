import { CollisionHandler } from '../Enumerators/CollisionHandler';
import { CombinedAlignment, Alignment } from '../Types/AlignmentTypes';

export interface IOptions {
    my: Alignment;
    at: Alignment;
    anchor: HTMLElement | MouseEvent;
    target: HTMLElement;
    collision?: CollisionHandler;
    bestFitPreference?: 'horizontal' | 'vertical';
    defaults?: { my: CombinedAlignment; at: CombinedAlignment };
}
