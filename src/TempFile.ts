import { fileSync, Options } from "tmp";
import { TempFileSystem } from "./TempFileSystem";

/**
 * Represents a temporary file.
 */
export class TempFile extends TempFileSystem
{
    /**
     * Initializes a new instance of the `TempFile` class.
     *
     * @param options
     * The options for the initialization.
     */
    public constructor(options?: Options)
    {
        super(options);
    }

    protected Initialize(options: Options): void
    {
        this.TempFileSystemEntry = fileSync(options);
    }
}