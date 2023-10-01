# THIS PROJECT IS MOVING
This project is moving to [Codeberg.org](https://codeberg.org).

If you wish to check out the most recent source code, file an issue or contribute to this project, please head to the [new repository on Codeberg.org](https://codeberg.org/lordgizmo/TempFiles):

<https://codeberg.org/lordgizmo/TempFiles>

# TempFiles
Provides the functionality to handle temporary files and directories the object-oriented way.

## Installing TempFiles
`TempFiles` can be installed using the `npm`-cli:
```bash
npm install --save @manuth/temp-files
```

## Using TempFiles
You can create temporary filesystem-entries by initializing new instances of the `TempFile`- or the `TempDirectory`-class.  
Temporary filesystem-entries easily can be removed by invoking `TempFileSystem.Dispose()`.

When working with a `TempDirectory` you can use `TempDirectory.MakePath(...string[])` to create paths relative to the directory.

### Example
```ts
import fs = require("fs");
import { TempDirectory, TempFile } from "@manuth/temp-files";

let tempDir = new TempDirectory();
let tempFile = new TempFile(
    {
        postfix: ".json"
    });

let fileName = tempDir.MakePath("this", "is", "a", "test.txt");
fs.writeFileSync(fileName, "Hello World");
fs.writeFileSync(tempFile.FullName, '{ "Message": "Hello World" }');

tempFile.Dispose();
tempDir.Dispose();
```
