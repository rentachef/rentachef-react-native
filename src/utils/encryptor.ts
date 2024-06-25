import CryptoJS from 'crypto-js'

const passphrase = 'paraBailarLaBamba2022' //TODO hide somewhere

const encryptData = (data: any) => CryptoJS.AES.encrypt(JSON.stringify(data), passphrase).toString()

const decryptData = (encryptedData: string) => {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedData, passphrase)
        const decryptedData = bytes.toString(CryptoJS.enc.Utf8)
        return JSON.parse(decryptedData)
    } catch(e) {
        console.log('ERROR DECRYPTING: ', e)
    } 
}

export { encryptData, decryptData }