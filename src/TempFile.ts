import { fileSync } from "tmp";
import { FileOptions } from ".";
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
    public constructor(options?: FileOptions)
    {
        super(options);
    }

    protected Initialize(options: FileOptions): void
    {
        this.TempFileSystemEntry = fileSync(options);
    }
}