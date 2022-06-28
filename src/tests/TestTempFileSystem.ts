import { TempFile } from "../TempFile.js";

/**
 * Provides an implementation of the {@link TempFile `TempFile`} class for testing.
 */
export class TestTempFile extends TempFile
{
    /**
     * @inheritdoc
     */
    public override Register(): void
    {
        super.Register();
    }
}
