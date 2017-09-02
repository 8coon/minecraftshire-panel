
export default (callback) => {
    let resolve;
    let reject;

    const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
    });

    const then = result => {
        // Continue
        if (result === false) {
            callback()
                .then(then)
                .catch(reject);
            return;
        }

        resolve(result);
    };

    then(false);
    return promise;
}
