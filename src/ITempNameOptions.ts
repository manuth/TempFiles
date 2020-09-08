import { ITempBaseNameOptions } from "./ITempBaseNameOptions";

/**
 * Provides options for creating a temporary name.
 */
export interface ITempNameOptions extends ITempBaseNameOptions
{
    /**
     * The parent directory of the temporary file.
     */
    Directory?: string;

    /**
     * The number of tries to create an available file-entry name.
     */
    Retries?: number;
}
