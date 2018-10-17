/**
 * Sets the method used to round monetary amounts which contain
 * fractions of a cent / penny.
 */
export interface RoundingStrategy {
    round(input: number): number;
}
