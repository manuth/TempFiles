import { TmpNameOptions, TmpNameResult } from ".";

/**
 * Represents a temporary file-system entry.
 */
export abstract class TempFileSystem
{
    /**
     * The temporary file-system entry.
     */
    private tempFileSystemEntry: TmpNameResult;

    /**
     * Initializes a new instance of the `TempFileSystem` class.
     *
     * @param options
     * The options for the initialization.
     */
    public constructor(options?: TmpNameOptions)
    {
        this.Initialize(options);
    }

    /**
     * Gets the name of the temporary file-system entry.
     */
    public get FullName()
    {
        return this.tempFileSystemEntry.name;
    }

    /**
     * Gets or sets the temporary file-system entry.
     */
    protected get TempFileSystemEntry()
    {
        return this.tempFileSystemEntry;
    }

    protected set TempFileSystemEntry(value)
    {
        this.tempFileSystemEntry = value;
    }

    /**
     * Disposes the temporary file-system entry and removes all references.
     */
    public Dispose()
    {
        this.TempFileSystemEntry.removeCallback();
        this.TempFileSystemEntry = null;
    }

    /**
     * Returns a string which represents the object.
     *
     * @returns
     * A string which represents the object.
     */
    public toString()
    {
        return this.FullName;
    }

    /**
     * Initializes the temporary file-system entry.
     *
     * @param options
     * The options for the initialization.
     */
    protected abstract Initialize(options: TmpNameOptions): void;
}