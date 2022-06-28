import { tmpdir } from "os";
import { join, resolve } from "path";
import fs from "fs-extra";
import RandExp from "randexp";
import { ITempBaseNameOptions } from "./ITempBaseNameOptions.js";
import { ITempFileSystemOptions } from "./ITempFileSystemOptions.js";
import { ITempNameOptions } from "./ITempNameOptions.js";

const { chmodSync, pathExistsSync, removeSync } = fs;
const { randexp } = RandExp;

/**
 * Represents a temporary file-system entry.
 *
 * @template T
 * The type of the options for initializing the file-system entry.
 */
export abstract class TempFileSystem<T extends ITempFileSystemOptions = ITempFileSystemOptions>
{
    /**
     * A value indicating whether temporary file-entries have been registered for deletion.
     */
    protected static Registered = false;

    /**
     * All temp-file entries which have been created so far.
     */
    protected static TempFileEntries: TempFileSystem[] = [];

    /**
     * A value indicating whether the object has been disposed.
     */
    private disposed = false;

    /**
     * The options of the filesystem entry.
     */
    private options: T;

    /**
     * The full name of the file-entry.
     */
    private fullName: string;

    /**
     * Initializes a new instance of the {@link TempFileSystem `TempFileSystem`} class.
     *
     * @param options
     * The options for the initialization.
     */
    public constructor(options?: T)
    {
        this.options = options;
        this.Initialize();
        this.Register();
    }

    /**
     * Gets the name of the temporary file-system entry.
     */
    public get FullName(): string
    {
        if (!this.fullName)
        {
            this.fullName = TempFileSystem.TempName(this.Options);
        }

        return this.fullName;
    }

    /**
     * Gets the options of the file-system entry.
     */
    public get Options(): T
    {
        return { ...this.options };
    }

    /**
     * Gets a value indicating whether the file-entry has been disposed.
     */
    public get Disposed(): boolean
    {
        return this.disposed;
    }

    /**
     * Creates a new available name for a temporary file or directory.
     *
     * @param options
     * The options for creating the file-entry name.
     *
     * @returns
     * A new available name for a temporary file or directory.
     */
    public static TempName(options?: ITempNameOptions): string
    {
        options = {
            Directory: tmpdir(),
            Retries: 5,
            ...options
        };

        /**
         * Generates a new filename.
         *
         * @returns
         * The newly generated filename.
         */
        let generateFileName = (): string =>
        {
            return resolve(join(options.Directory, this.TempBaseName(options)));
        };

        let fileName = generateFileName();

        for (let i = 0; i < options.Retries && pathExistsSync(fileName); i++)
        {
            fileName = generateFileName();
        }

        if (!pathExistsSync(fileName))
        {
            return fileName;
        }
        else
        {
            throw new RangeError("A file-name, which does not exist already, could not be found.");
        }
    }

    /**
     * Creates a new base-name for a temporary file-entry.
     *
     * @param options
     * The options for creating the file-entry name.
     *
     * @returns
     * A newly generated random base-name for a file-system entry.
     */
    public static TempBaseName(options?: ITempBaseNameOptions): string
    {
        options = {
            Prefix: `tmp-${process.pid}-`,
            Suffix: "",
            FileNamePattern: /^[0-9A-Za-z]{6}$/,
            ...options
        };

        return `${options.Prefix}${randexp(options.FileNamePattern)}${options.Suffix}`;
    }

    /**
     * Removes all temporary file-entries which are pending for deletion.
     */
    public static Cleanup(): void
    {
        for (let fileEntry of TempFileSystem.TempFileEntries)
        {
            if (!fileEntry.Options?.Keep)
            {
                try
                {
                    fileEntry.Dispose();
                }
                catch { }
            }
        }
    }

    /**
     * Disposes the temporary file-system entry and removes all references.
     */
    public Dispose(): void
    {
        if (this.Disposed)
        {
            throw new Error("This file-entry has been disposed already.");
        }
        else
        {
            if (!this.Options?.Keep)
            {
                removeSync(this.FullName);
            }

            this.disposed = true;
        }
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
        this.CreateFileSystemEntry();

        if (this.Options?.Mode)
        {
            chmodSync(this.FullName, this.Options.Mode);
        }
    }

    /**
     * Creates the file-system entry.
     */
    protected abstract CreateFileSystemEntry(): void;

    /**
     * Registers temporary file-entries for deletion.
     */
    protected Register(): void
    {
        if (!TempFileSystem.Registered)
        {
            process.on(
                "exit",
                () =>
                {
                    TempFileSystem.Cleanup();
                });

            TempFileSystem.Registered = true;
        }

        TempFileSystem.TempFileEntries.push(this);
    }
}
