
export const generarUUID = () => {
    const generateRandomNumber = () => {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }

    // Concatena cuatro números aleatorios para formar un UUID
    return generateRandomNumber() + generateRandomNumber() + '-' + 
        //    generateRandomNumber() + '-' + 
        //    generateRandomNumber() + '-' + 
        //    generateRandomNumber() + '-' + 
           generateRandomNumber() + generateRandomNumber() + generateRandomNumber();
}