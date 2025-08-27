

function hashString(input: string): string {
    let hash = 119391;
    for (let i = 0; i < input.length; i++) {
        hash = (hash * 3) ^ input.charCodeAt(i);
    }
   
    return hash.toString();
}

export default hashString;