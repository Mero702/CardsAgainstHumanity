export function shuffleArray<T>(array:Array<T>):Array<T> {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}
export function* getRandomOrder(count:number) {
    let array = []
    for(let i = count; i > 0; i--)
        array.push(i)
    for (let i = count - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    while(array.length > 0)
        yield array.shift()
}