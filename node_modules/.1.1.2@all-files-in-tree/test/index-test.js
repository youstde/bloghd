const fs = require("fs");
const expect = require("expect.js");
const allFilesInTree = require("../index");

const ROOT_PATH = "root";
const PATH1 = "root/path1";
const PATH2 = "root/path2";
const PATH2_PATH3 = "root/path2/path3";

const DUMMY_FILE1 = "root/dummy1";
const DUMMY_FILE2 = "root/path1/dummy2";
const DUMMY_FILE3 = "root/path2/dummy3";
const DUMMY_FILE4 = "root/path2/dummy4";
const DUMMY_FILE5 = "root/path2/path3/dummy5";

const FILES = [DUMMY_FILE1, DUMMY_FILE2, DUMMY_FILE3, DUMMY_FILE4, DUMMY_FILE5];
const PATHS = [ROOT_PATH, PATH1, PATH2, PATH2_PATH3];

describe("all-files-in-tree", () => {
	before(() => {
		PATHS.forEach(path => fs.mkdirSync(path));
		FILES.forEach(file => fs.openSync(file, 'w'));
	});

	it("should find a lonley file in single dir", () => {
		expect(allFilesInTree.sync(PATH2_PATH3)).to.have.length(1);
	});

	it("should find all files in tree", () => {
		expect(allFilesInTree.sync(ROOT_PATH)).to.have.length(5);
	});

	it("should find all files, but asynchronous", done => {
		allFilesInTree.async(ROOT_PATH)
							.then(files => {
								expect(files).to.have.length(5);
								done();
							});
	});

	after(() => {
		FILES.forEach(file => fs.unlinkSync(file));
		PATHS.reverse().forEach(path => fs.rmdirSync(path));
	});
});