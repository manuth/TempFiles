import { DirOptions, FileOptions } from "tmp";
import { TempResult } from "./TempResult";

/**
 * Represents a temporary file-system entry.
 */
export abstract class TempFileSystem<T extends FileOptions | DirOptions = FileOptions | DirOptions>
{
    /**
     * The options of the filesystem entry.
     */
    private options: T;

    /**
     * The temporary file-system entry.
     */
    private tempFileSystemEntry: TempResult;

    /**
     * Initializes a new instance of the `TempFileSystem` class.
     *
     * @param options
     * The options for the initialization.
     */
    public constructor(options?: T)
    {
        this.options = options;
        this.Initialize();
    }

    /**
     * Gets the name of the temporary file-system entry.
     */
    public get FullName(): string
    {
        return this.tempFileSystemEntry.name;
    }

    /**
     * Gets the options of the file-systme entry.
     */
    public get Options(): T
    {
        return { ...this.options };
    }

    /**
     * Gets or sets the temporary file-system entry.
     */
    protected get TempFileSystemEntry(): TempResult
    {
        return this.tempFileSystemEntry;
    }

    /**
     * @inheritdoc
     */
    protected set TempFileSystemEntry(value: TempResult)
    {
        this.tempFileSystemEntry = value;
    }

    /**
     * Disposes the temporary file-system entry and removes all references.
     */
    public Dispose(): void
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
    public toString(): string
    {
        return this.FullName;
    }

    /**
     * Initializes the temporary file-system entry.
     */
    protected Initialize(): void
    {
        if (!this.options.keep)
        {
            process.on(
                "exit",
                () =>
                {
                    this.Dispose();
                });
        }

        this.TempFileSystemEntry = this.CreateFileEntry();
    }

    /**
     * Creates the filesystem entry.
     */
    protected abstract CreateFileEntry(): TempResult;
}
