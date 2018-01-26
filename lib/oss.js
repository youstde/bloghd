const OSS = require('ali-oss');
const path = require('path');
const co = require('co');
const allFilesInTree = require("all-files-in-tree");
const client = new OSS({
    region: 'oss-cn-beijing',
    accessKeyId: 'LTAIpsTPM0CtU3gh',
    accessKeySecret: 'ZxLA96YGXlwrk0cQgw2QvA1DDzcuwG'
});
client.useBucket('stblog');
const Oss={
    putDir(dir,name,groupName){
        const files = allFilesInTree.sync(dir);
        for(let i=0;i<files.length;i++){
            let file = files[i];
            this.put(file,name,groupName);
        }
    },

    put(dir,file ,name){
            return new Promise((resolve,reject)=>{
            	co(function* (){
	            	let ossFilePath = dir + '/' + name;
	            	let result = yield client.put(ossFilePath , file);
	            	if(result.res.status === 200) {
	            		console.log(result);
	            		resolve({
	            			requestUrls: result.res.requestUrls,
	            			success: true
	            		});
	            	}else {
	            		resolve({
	            			success: false
	            		});
	            	}
            	});
            });
    }
};



module.exports=Oss;