import type { Film } from "./Film";

export interface Rental {
    id?: number;
    intialFee: number;
    lateFee: number;
    created: Date;
    films: Film[];
}
