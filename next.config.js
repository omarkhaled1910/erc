/** @type {import('next').NextConfig} */
const nextConfig = {
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
