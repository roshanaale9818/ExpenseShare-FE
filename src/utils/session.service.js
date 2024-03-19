const getSessionValue = (key) => {
    try {
        const user = JSON.parse(sessionStorage.getItem('user'));
        const value = user[key];
        if (!value) {
            return null;
        }
        return value;
    }
    catch (err) {
        console.log("Error in session", err);
        return null;
    }
}
export { getSessionValue }