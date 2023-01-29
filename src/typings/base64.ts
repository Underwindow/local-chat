type Base64<imageType extends string> = `data:image/${imageType};base64, ${string}`

export default Base64;