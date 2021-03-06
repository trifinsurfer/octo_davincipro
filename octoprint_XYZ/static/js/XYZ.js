/*
 * View model for OctoPrint-Xyz
 *
 * Author: Dude
 * License: AGPLv3
 */
$(function() {
    function XyzViewModel(parameters) {
    	var self = this;
    	var printerState = parameters[0];
    	var filesState = parameters[1];
    	var settingsState = parameters[2];
    	
    	
		self.onEventPrintStarted = function(payload)   {
			console.log(payload);
			//filesState.uploadSdButton = undefined;	
		} 	
    	
    	printerState.print = function() {
    			console.log("Print")
            if (printerState.isPaused()) {
                showConfirmationDialog({
                    message: gettext("This will restart the print job from the beginning."),
                    onproceed: function() {
                        OctoPrint.job.restart();
                    }
                });
            } else {
            	if (settingsState.settings.plugins.XYZ.printer() != "Not Enabled") {
            		//filesState.uploadSdButton = undefined;
            		OctoPrint.postJson("api/plugin/XYZ", {"command": "printXYZ", "filename": printerState.filepath()})
            	} else {
                		OctoPrint.job.start();
             }
            }
        };
		filesState.loadFile = function(file, printAfterLoad) {
				console.log("Select")
            if (!file) {
                return;
            }
            var withinPrintDimensions = filesState.evaluatePrintDimensions(file, true);
            var print = printAfterLoad && withinPrintDimensions;
				if (settingsState.settings.plugins.XYZ.printer() != "Not Enabled") {
					if (print == true) {
							OctoPrint.files.select(file.origin, file.path, false);
            			OctoPrint.postJson("api/plugin/XYZ", {"command": "printXYZ", "filename": file.path})			
					} else {
							OctoPrint.files.select(file.origin, file.path, print);
					}
            } else {
            		OctoPrint.files.select(file.origin, file.path, print);
            	}
        };
   }
	
    // view model class, parameters for constructor, container to bind to
    OCTOPRINT_VIEWMODELS.push([
        XyzViewModel,

        // e.g. loginStateViewModel, settingsViewModel, ...
        ["printerStateViewModel","gcodeFilesViewModel","settingsViewModel"],

        // e.g. #settings_plugin_XYZ, #tab_plugin_XYZ, ...
        ["#state_wrapper","#files_wrapper"]
    ]);
});
