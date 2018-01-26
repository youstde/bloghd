# all-files-in-tree

Recursively get all files in a directory tree, given the root path (starting point)

**If you like it, star; if you don't, please tell me why!! :)**

## Installation

```
npm install all-files-in-tree
```

## Usage

```
var allFilesInTree = require("all-files-in-tree");

// You have the sync version:
var files = allFilesInTree.sync("/home/user/dir");

// Or the async one:
allFilesInTree.async("/home/user/dir")
					.then(function(files) {
						// do your stuff here
					});
```
That easy? YES, that's the idea. ;)

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Credits

[@luispablo](https://twitter.com/luispablo)
