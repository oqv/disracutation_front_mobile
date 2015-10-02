var neemuAC = neemuAC || {},
    protocolo = 'http://',
    scriptsLoaded = [],
    timestamp = new Date().getTime(),
    scriptsPage = window.document.getElementsByTagName('script');

neemuAC.plugin = neemuAC.plugin || {};

if(window.document.URL.match('^https'))
{
    protocolo = 'https://';
}

/**
 * Inicialização do Plugin
 */
neemuAC.plugin.init = function(options)
{
    var shopurl;

    // get do valor da URL da Loja
    shopurl = neemuAC.plugin.getShopUrl(options);
    // load dos scripts do Neemu
    neemuAC.plugin.loadScripts
    ([
        protocolo + 'scripts.neemu.com/neemu.commons.min.js?_=' + timestamp,
        shopurl + 'autocomplete.js?_=' + timestamp
    ]);
};

/**
 * Get do valor da URL da Loja
 */
neemuAC.plugin.getShopUrl = function(options)
{
    var host = window.location.hostname;

    if(host.indexOf('local') != -1 || host.indexOf('192.168') != -1) // url para ambiente de teste
    {
        return options.url.localhost.replace('[HOST]', host);
    }
    else if(host.indexOf('valid') != -1) // url para ambiente de validação
    {
        return options.url.valid.replace('[HOST]', host);
    }
    else // url para ambiente de produção
    {
        return options.url.production.replace('[HOST]', host);
    }
};

/**
 * Load a file
 *
 * @param string filesrc
 * @param 'css','js' filetype
 * @param 'body','html' locationhtml
 * @param function callback
 * @return void
 */

neemuAC.plugin.loadScripts = function(files, scripttag)
{
    if(files.length > 0)
    {
        var tag = undefined;
        var file = files.shift();
        var filename = file.split('/').pop(); // nome do arquivo
        var canAddScript;

        if(!scriptsLoaded[file])
        {
            canAddScript = true;

            for(var index = 0, len = scriptsPage.length; index < len; index++)
            {
                var scriptsrc = scriptsPage[index].getAttribute('src');

                if(scriptsrc != null && scriptsrc != undefined)
                {
                    // nome do arquivo
                    var scriptname = scriptsrc.split('/').pop();

                    if(scriptname == filename)
                    {
                        canAddScript = false;
                        break;
                    }
                }
            }
        }
        else
        {
            canAddScript = false;
        }

        if(scripttag == undefined)
        {
            for(var index = (scriptsPage.length - 1); index >= 0; index--)
            {
                if(scriptsPage[index].type != '' &&
                    scriptsPage[index].parentNode != null)
                {
                    scripttag = scriptsPage[index];
                    break;
                }
            }
        }

        if(canAddScript)
        {
            tag = window.document.createElement('script');
            tag.setAttribute("type","text/javascript");
            tag.setAttribute("src", file);

            scripttag.parentNode.insertBefore(tag, scripttag);

            tag.onload = function()
            {
                if(!scriptsLoaded[file])
                {
                    scriptsLoaded[file] = true;
                    neemuAC.plugin.loadScripts(files, scripttag);
                }
            };

            tag.onreadystatechange = function()
            {
                if((this.readyState == 'loaded' || this.readyState == 'complete') && !scriptsLoaded[file])
                {
                    scriptsLoaded[file] = true;
                    neemuAC.plugin.loadScripts(files, scripttag);
                }
            };
        }
        else
        {
            neemuAC.plugin.loadScripts(files, scripttag);
        }
    }
};

neemuAC.plugin.getFileParentDir = function(name)
{
    for (var i = scriptsPage.length - 1; i >= 0; --i)
    {
        var src = scriptsPage[i].src;
        var l = src.length;
        var length = name.length;
        if (src.substr(l - length) == name)
        {
            var url = src.substr(0, l - length - 1);
            return url.substr(url.lastIndexOf('/') + 1, 100);
        }
    }
};

// loja
// var loja = neemuAC.plugin.getFileParentDir('neemu_plugin.js');
var loja = 'oqvestir';

// inicialização do plugin do autocomplete
neemuAC.plugin.init
(
    {
        url:
        {
            localhost: protocolo + 'local.scripts/' + loja + '/',
            valid: protocolo + 'scriptsvalid.neemu.com/' + loja + '/',
            production: protocolo + 'scripts.neemu.com/' + loja + '/'
        }
    }
);
