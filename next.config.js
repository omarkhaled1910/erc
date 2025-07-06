/** @type {import('next').NextConfig} */
const nextConfig = {
    distDir: "out",
    output: "standalone",
    images: {
        unoptimized: true,
    },
    basePath: "",
    assetPrefix: "./",
    trailingSlash: false,
    //    experimental:{
    //     turbo :{
    //         "@"
    //     }
    //    }
}

module.exports = nextConfig
