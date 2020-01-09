const path = require("path");

// This project does not use webpack for bundling purposes, but for the webpack 
// development server, or WDS. This server allows us to connect over wifi with
// iPads, because we can specify the host of the server. I did not find that
// capability in the npm utility package "serve."

module.exports = {
    mode: "development",
    devServer: {
        open: true,
        openPage: "index.html",

        // having either this or the publicPath in the output config seems to do the same thing
        publicPath: ".",

        // The contentBase lets you run npm start from anywhere and it will serve from the
        // root of graspable-math.
        contentBase: path.resolve(__dirname, ""),

        // Detects changes of files. Server defaults to reloading on file changes.
        watchContentBase: true,

        port: 5000
    }
}
