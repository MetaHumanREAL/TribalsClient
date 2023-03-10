const fs = require('original-fs');
const path = require('path');
const https = require('https');


module.exports = {
    totalScripts: 0,
    runScripts: (win, app) => {
        let scriptDirectory = path.normalize(`${app.getPath('documents')}/Tribals-Client/Scripts`);
    
        if(!fs.existsSync(scriptDirectory)) {
            fs.mkdirSync(scriptDirectory, {
                recursive: true
            });
        }
    
        let files = fs.readdirSync(scriptDirectory, { withFileTypes: true });
        this.totalScripts = files.length;
        
        if(files.length == 0) return;
    
        files.forEach(file => {
            if(!file.name.includes('js')) return;
            let script = fs.readFileSync(scriptDirectory + '/' + file.name, { encoding: 'utf-8' });
            win.webContents.executeJavaScript(script);
        });
    },
    replaceResources: (win, app) => {

        function checkCreateFolder(folder) {
            if (!fs.existsSync(folder)) {
                fs.mkdirSync(folder, { recursive: true });
            }
            return folder;
        }

        checkCreateFolder(app.getPath('documents') + "\\Tribals-Client\\Resource Swapper\\");
        checkCreateFolder(app.getPath('documents') + "\\Tribals-Client\\Skin Swapper\\");
        checkCreateFolder(app.getPath('documents') + "\\Tribals-Client\\Scripts\\");

        const AdBlockList = [
            'pubads.g.doubleclick.net',
            'video-ad-stats.googlesyndication.com',
            'simage2.pubmatic.com/AdServer',
            'pagead2.googlesyndication.com',
            'securepubads.g.doubleclick.net',
            'googleads.g.doubleclick.net',
            'adclick.g.doubleclick.net'
        ]
    
        let swapDirectory = path.normalize(`${app.getPath('documents')}/Tribals-Client/Resource Swapper`)
        let skinSwapper = path.normalize(`${app.getPath('documents')}/Tribals-Client/Skin Swapper`)
        
        if(!fs.existsSync(swapDirectory)) {
            fs.mkdirSync(swapDirectory, {
                recursive: true
            });
        }
        
        win.webContents.session.webRequest.onBeforeRequest((details, callback) => {
            if (AdBlockList.includes(new URL(details.url).hostname)) {
                return callback({ cancel: true });
            }

            if (new URL(details.url).hostname === 'tribals.io' && new URL(details.url).pathname.length > 1) {
                let url = `${swapDirectory}\\${new URL(details.url).pathname}`;
                if(fs.existsSync(url)) {
                    return callback({ cancel: false, redirectURL: `swap:/${url}` });
                }
            }
    
            return callback({ cancel: false });
        });
    }
}
