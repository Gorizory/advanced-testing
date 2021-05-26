module.exports = {
    plugins: [
        require('autoprefixer')({
            browsers: [
                'last 1 version',
            ],
        }),
        require('postcss-clearfix'),
        require('postcss-conditionals'),
        require('postcss-extend'),
        require('postcss-hexrgba'),
        require('postcss-import'),
        require('postcss-media-minmax'),
        require('postcss-nested'),
        require('postcss-sassy-mixins'),
        require('postcss-simple-vars'),
        require('postcss-size'),
    ],
};
