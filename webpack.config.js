module.exports = {
    entry: './sig',
    output: {
        filename: 'build.js',
        library: 'sig'
    },
    node: {
        net: 'empty',
        tls: 'empty',
        dns: 'empty',
        fs: 'empty'
      }
}