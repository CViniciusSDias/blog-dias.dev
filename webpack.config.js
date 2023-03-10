var Encore = require('@symfony/webpack-encore');

Encore
// directory where compiled assets will be stored
    .setOutputPath('source/build/')
    // public path used by the web server to access the output path
    .setPublicPath('/build')
    .copyFiles({
        from: './source/assets/fonts'
    })
    .copyFiles({
        from: './source/assets/img'
    })
    .addEntry('app', './source/assets/js/app.js')
    .addEntry('lite-yt-embed-script', 'lite-youtube-embed/src/lite-yt-embed.js')
    .addStyleEntry('index', './source/assets/css/index.scss')
    .addStyleEntry('post', './source/assets/css/post.scss')
    .addStyleEntry('lite-yt-embed-style', 'lite-youtube-embed/src/lite-yt-embed.css')

    .disableSingleRuntimeChunk()

    .cleanupOutputBeforeBuild()
    .enableSourceMaps(!Encore.isProduction())
    // enables hashed filenames (e.g. app.abc123.css)
    .enableVersioning(false)

    .enableSassLoader()
;

module.exports = Encore.getWebpackConfig();
