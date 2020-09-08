import { ITempNameOptions } from "./ITempNameOptions";

/**
 * Provides options for creating a new temporary file-system entry.
 */
export interface ITempFileSystemOptions extends ITempNameOptions
{
    /**
     * A value indicating whether the file-entry should be kept after exiting the process.
     */
    Keep?: boolean;
}
