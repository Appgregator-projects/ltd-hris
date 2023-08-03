class SumCollection extends Array {
    sum(key) {
        return this.reduce((a, b) => a + (b[key] || 0), 0);
    }
}


async function sumArray(data,key) {
    const total = new SumCollection(...data);
    const response=parseFloat(total.sum(key));
    return response;
}

export default sumArray;
