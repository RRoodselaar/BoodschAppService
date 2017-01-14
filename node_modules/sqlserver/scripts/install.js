// Warning: This install script is one giant hack.
//
// For backwards compatibility reasons, an Azure Mobile Service needs to be able to reference the msnodesql driver in its package.json
// but it needs it to be called 'sqlserver' at the time of resolution e.g require('sqlserver');
//
// For reasons I won't go into, this module is not available under the name 'sqlserver', so at installation time the module
// copies itself to the 'sqlserver' directory.

var fs = require('fs'),
	util = require('util'),
	path = require('path'),
	child_process = require('child_process'),
	pkg = require('../package.json');

var moduleName = pkg.name,
	targetModuleName = 'sqlserver',
	parentDirectory = path.resolve('..');

// Only do this step if this script is running due to installation as a module
if(path.basename(parentDirectory) == 'node_modules') {
	// Only perform the copy if there is no sqlserver\package.json, or it exists but it has the same module name as us
	// i.e. it is a previous copy	
	var targetModulePackageJsonPath = path.resolve(path.join('..', targetModuleName, 'package.json'));
	if(fs.existsSync(targetModulePackageJsonPath) && require(targetModulePackageJsonPath).name != moduleName) {
		console.error("Conflicting module found, unable to alias self as '%s'", targetModuleName);
	} else {			
		var command = util.format("robocopy %s %s /MIR", moduleName, targetModuleName);
		child_process.exec(command, { cwd: parentDirectory }, function(error, stdout, stderr) {    
	        // Robocopy returns 1 for a successful copy operation
	        if((error === null || error.code === 1) && fs.existsSync(targetModulePackageJsonPath)) {
	        	console.log("Module successfully aliased self as '%s'.", targetModuleName);
	        } else {
		        console.error(error);
		        console.error(stderr);    
		        console.log(stdout);                    	
	        }       
		});
	}
}