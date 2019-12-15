const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ImageminPlugin = require('imagemin-webpack-plugin').default
const mozjpeg = require('imagemin-mozjpeg')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const MODE = process.env.NODE_ENV === void 0 ? 'development' : 'production'
const DEV_MODE = MODE === 'development'

const PATHS = {
  src: path.join(__dirname, 'src'),
  dist: path.join(__dirname, 'dist')
}

const commonPlugins = [
  new CopyWebpackPlugin([
    {
      from: './static',
      to: './',
      ignore: ['.DS_Store', '.gitkeep']
    }
  ]),
  new ImageminPlugin({
    disable: DEV_MODE,
    test: /\.(jpe?g|png|bmp|gif|svg)$/,
    jpegtran: null,
    pngquant: {
      quality: '80-90',
      speed: 1,
      floyd: 0
    },
    optipng: null,
    gifsicle: {
      interlaced: false
    },
    svgo: {
      plugins: [
        {
          removeViewBox: false
        }
      ]
    },
    plugins: [
      mozjpeg({
        quality: 85,
        progressive: true
      })
    ]
  }),
  new MiniCssExtractPlugin({
    filename: '[name].css',
    chunkFilename: '[id].css'
  }),
]

const config = {
  mode: MODE,

  context: PATHS.src,

  entry: {
    index: ['./main.ts']
  },

  output: {
    filename: '[name].js',
    path: PATHS.dist,
    publicPath: '/'
  },

  module: {
    rules: [
      // js
      {
        test: /\.ts[x]?$/,
        use: 'ts-loader'
      },
      // css
      {
        test: /\.css$/,
        use: [
          DEV_MODE ?
          {
            loader: 'style-loader'
          } :
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      // images
      {
        test: /\.(jpe?g|png|bmp|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]'
        }
      },
      // glslify
      {
        test: /\.(glsl|vs|fs|vert|frag)$/,
        use: ['raw-loader', 'glslify-loader'],
        exclude: /node_modules/
      },
      // worker
      {
        test: /\.worker\.js$/,
        use: [
          {
            loader: 'worker-loader',
            options: {
              name: DEV_MODE ?
                '[name].js' :
                '[name].[hash].js'
            }
          },
        ]
      },
    ]
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.css'],
    modules: ['node_modules'],
    alias: {
      '~': PATHS.src,
    }
  },

  externals: {
    three: 'THREE',
  },

  plugins: commonPlugins,

  devtool: DEV_MODE ? 'inline-source-map' : 'none',

  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          name: 'vendor',
          chunks: 'initial',
          enforce: true
        }
      }
    },
    minimizer: DEV_MODE
      ? []
      : [
          new TerserPlugin({
            parallel: true,
            sourceMap: false,
            terserOptions: {
              warnings: false,
              compress: {
                drop_console: true
              }
            }
          })
        ]
  },

  devServer: {
    host: '0.0.0.0',
    disableHostCheck: true,
    contentBase: PATHS.dist,
    watchContentBase: true,
    historyApiFallback: true,
  },

  watchOptions: {
    ignored: /.frag$/,
  }
}

module.exports = config
