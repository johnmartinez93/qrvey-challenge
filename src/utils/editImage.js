const Jimp = require("jimp")

exports.transformImage = async (url) => {
    try {
        const _image = await Jimp.read(url);

        const _transformedImageGrayscale = _image.grayscale();
        const _transformedImageSepia = _image.sepia();
        const _transformedImageBlur = _image.blur(5);

        const _transformedImageGrayscaleBuffer =
            await _transformedImageGrayscale.getBufferAsync(Jimp.MIME_PNG);
        const _transformedImageSepiaBuffer =
            await _transformedImageSepia.getBufferAsync(Jimp.MIME_PNG);
        const _transformedImageBlurBuffer =
            await _transformedImageBlur.getBufferAsync(Jimp.MIME_PNG);

        return { grayscale: _transformedImageGrayscaleBuffer, sepia: _transformedImageSepiaBuffer, blur: _transformedImageBlurBuffer }
    } catch (error) {
        console.log('transformImage error: ', error.message)
    }
}