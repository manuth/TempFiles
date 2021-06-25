/**
 * Provides options for creating a basename of a temporary file-entry.
 */
export interface ITempBaseNameOptions
{
    /**
     * The prefix of the base-name.
     */
    Prefix?: string;

    /**
     * The suffix of the base-name.
     */
    Suffix?: string;

    /**
     * Either the name of the base file-entry or a pattern for creating the base name.
     */
    FileNamePattern?: RegExp | string;
}
