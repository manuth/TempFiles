import { ensureFileSync } from "fs-extra";
import { ITempFileSystemOptions } from "./ITempFileSystemOptions";
import { TempFileSystem } from "./TempFileSystem";

/**
 * Represents a temporary file.
 */
export class TempFile extends TempFileSystem
{
    /**
     * Initializes a new instance of the {@link TempFile `TempFile`} class.
     *
     * @param options
     * The options for the initialization.
     */
    public constructor(options?: ITempFileSystemOptions)
    {
        super(options);
    }

    /**
     * @inheritdoc
     */
    protected CreateFileSystemEntry(): void
    {
        ensureFileSync(this.FullName);
    }
}
