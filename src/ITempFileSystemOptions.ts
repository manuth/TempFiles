import { ITempNameOptions } from "./ITempNameOptions.js";

/**
 * Provides options for creating a new temporary file-system entry.
 */
export interface ITempFileSystemOptions extends ITempNameOptions
{
    /**
     * A value indicating whether the file-entry should be kept after the process exits.
     */
    Keep?: boolean;

    /**
     * The mode to create the file-system entry with.
     */
    Mode?: number;
}
